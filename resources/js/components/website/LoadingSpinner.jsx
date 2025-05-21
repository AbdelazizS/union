import React, { useEffect, useState } from 'react';
import { Sparkles, Droplets, Wand2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const LoadingSpinner = ({ className, size = "default" }) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [progress, setProgress] = useState(0);
  const icons = [Sparkles, Droplets, Wand2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 100);
    }, 30);
    return () => clearInterval(progressInterval);
  }, []);

  const sizeClasses = {
    sm: "w-32 h-32",
    default: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const logoSizeClasses = {
    sm: "w-24 h-24",
    default: "w-36 h-36",
    lg: "w-48 h-48",
  };

  return (
    <div className={cn("relative flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-white/50 to-white/10 dark:from-gray-900/50 dark:to-gray-900/10", className)}>
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "relative rounded-full",
          "bg-gradient-to-br from-white/80 via-emerald-50/80 to-white/80",
          "dark:from-gray-900/80 dark:via-emerald-950/80 dark:to-gray-900/80",
          "backdrop-blur-md border border-emerald-200/20 dark:border-emerald-800/20",
          "shadow-[0_0_30px_rgba(16,185,129,0.1)] dark:shadow-[0_0_30px_rgba(16,185,129,0.05)]",
          sizeClasses[size]
        )}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            className="text-emerald-400/20 dark:text-emerald-500/20"
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </svg>

        {/* Outer rotating ring with gradient */}
        <motion.div
          animate={{ 
            rotate: 360,
            background: [
              "linear-gradient(45deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))",
              "linear-gradient(45deg, rgba(5,150,105,0.1), rgba(4,120,87,0.1))",
              "linear-gradient(45deg, rgba(4,120,87,0.1), rgba(16,185,129,0.1))"
            ]
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            background: { duration: 6, repeat: Infinity, ease: "linear" }
          }}
          className="absolute inset-0 rounded-full border border-emerald-200/10 dark:border-emerald-800/10"
        />

        {/* Logo container with 3D effect */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcon}
              initial={{ opacity: 0, y: 100, rotateX: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -100, 
                rotateX: 20,
                transition: {
                  duration: 0.5,
                  ease: "easeInOut"
                }
              }}
              className="relative preserve-3d"
            >
              <motion.img
                src="/images/logo.png"
                alt="Logo"
                className={cn(
                  "object-contain",
                  logoSizeClasses[size],
                  "filter drop-shadow-[0_0_20px_rgba(16,185,129,0.25)] brightness-110"
                )}
                animate={{
                  y: [0, -3, 0],
                  filter: [
                    "brightness(1.1) drop-shadow(0 0 20px rgba(16,185,129,0.25))",
                    "brightness(1.15) drop-shadow(0 0 25px rgba(16,185,129,0.3))",
                    "brightness(1.1) drop-shadow(0 0 20px rgba(16,185,129,0.25))"
                  ],
                  rotateY: [0, 2, 0, -2, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Enhanced glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-400/5 dark:bg-emerald-500/5 blur-xl"
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
