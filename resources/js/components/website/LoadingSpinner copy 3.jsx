import React, { useEffect, useState } from 'react';
import { Sparkles, Droplets, Wand2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const LoadingSpinner = ({ className, size = "default" }) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const icons = [Sparkles, Droplets, Wand2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-8 h-8",
    default: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const Icon = icons[currentIcon];

  return (
    <div className={cn("relative flex items-center justify-center min-h-screen w-full", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "relative rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
          "backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20",
          "shadow-lg shadow-blue-500/10",
          sizeClasses[size]
        )}
      >
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/30 dark:border-blue-600/30"
        />

        {/* Inner pulsing circle */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-2 rounded-full bg-blue-100/50 dark:bg-blue-900/50"
        />

        {/* Icon container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIcon}
              initial={{ opacity: 0, y: 10, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -10, rotate: 10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-blue-600 dark:text-blue-400"
            >
              <Icon className={cn(
                size === "sm" ? "w-4 h-4" : 
                size === "default" ? "w-6 h-6" : 
                "w-8 h-8"
              )} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Shimmering particles */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400/20 to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
