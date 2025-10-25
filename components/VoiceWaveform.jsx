"use client";

import { motion } from "framer-motion";

export default function VoiceWaveform({ isActive = true }) {
  // Array of 4 bars with different animation delays
  const bars = [
    { height: "h-3", delay: 0 },
    { height: "h-5", delay: 0.1 },
    { height: "h-4", delay: 0.2 },
    { height: "h-6", delay: 0.15 },
  ];

  return (
    <div className="flex items-center gap-0.5 h-6">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className={`w-0.5 rounded-full bg-red-500`}
          animate={
            isActive
              ? {
                  height: ["12px", "24px", "8px", "20px", "12px"],
                }
              : {
                  height: "4px",
                }
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: bar.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
