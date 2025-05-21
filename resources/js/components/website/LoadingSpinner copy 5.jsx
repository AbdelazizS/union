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
    <div className={cn(
      "relative flex items-center justify-center min-h-screen w-full",
      "bg-gradient-to-b from-white/90 to-white/80",
      "dark:from-gray-900/90 dark:to-gray-900/80",
      "backdrop-blur-sm",
      className
    )}>
      {/* Subtle background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 via-transparent to-emerald-50/50 dark:from-emerald-950/50 dark:via-transparent dark:to-emerald-950/50"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "relative rounded-full",
          "bg-white/80 dark:bg-gray-900/80",
          "backdrop-blur-md",
          "border border-emerald-100/20 dark:border-emerald-800/20",
          "shadow-[0_0_30px_rgba(16,185,129,0.08)] dark:shadow-[0_0_30px_rgba(16,185,129,0.03)]",
          sizeClasses[size]
        )}
      >
        {/* Sophisticated progress ring with gradient */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <defs>
            {/* Main progress gradient */}
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.2)" />
              <stop offset="50%" stopColor="rgba(16,185,129,0.4)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.2)" />
            </linearGradient>
            {/* Background track gradient */}
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.05)" />
              <stop offset="50%" stopColor="rgba(16,185,129,0.1)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.05)" />
            </linearGradient>
          </defs>
          
          {/* Background track */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="url(#trackGradient)"
            strokeWidth="2"
            strokeDasharray="283"
            strokeLinecap="round"
            className="text-emerald-400/10 dark:text-emerald-500/10"
          />

          {/* Animated progress ring */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="2"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="text-emerald-400/20 dark:text-emerald-500/20"
            transition={{ duration: 0.1, ease: "linear" }}
          />

          {/* Glow effect for progress */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="4"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="text-emerald-400/5 dark:text-emerald-500/5 blur-[2px]"
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </svg>

        {/* Subtle rotating border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-emerald-200/10 dark:border-emerald-800/10"
        />

        {/* Logo container */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcon}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 1
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
              className="relative"
            >
              <motion.img
                src="/images/logo.png"
                alt="Logo"
                className={cn(
                  "object-contain",
                  logoSizeClasses[size],
                  "filter drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                )}
                animate={{
                  y: [0, -2, 0],
                  filter: [
                    "brightness(1) drop-shadow(0 0 15px rgba(16,185,129,0.15))",
                    "brightness(1.02) drop-shadow(0 0 20px rgba(16,185,129,0.2))",
                    "brightness(1) drop-shadow(0 0 15px rgba(16,185,129,0.15))"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Subtle glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-400/5 dark:bg-emerald-500/5 blur-xl"
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
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
