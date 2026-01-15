"use client";

import { motion } from "framer-motion";
import { Image, Mic, FileText } from "lucide-react";

/**
 * Feature hint pill component
 * Displays a subtle hint about available features
 */
function FeatureHint({ icon, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + delay, duration: 0.3 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                 bg-zinc-100 dark:bg-zinc-800/60
                 text-xs text-zinc-500 dark:text-zinc-400
                 hover:bg-zinc-200 dark:hover:bg-zinc-700
                 hover:text-zinc-700 dark:hover:text-zinc-300
                 transition-colors cursor-default select-none"
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>
      {label}
    </motion.div>
  );
}

/**
 * Empty state component for new chats
 * Displays a centered welcome message with the composer and feature hints
 */
export default function EmptyState({ children }) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center px-4">
      {/* Welcome greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-2xl sm:text-3xl font-light text-zinc-700 dark:text-zinc-200 mb-8 text-center"
      >
        Come posso aiutarti oggi?
      </motion.h1>

      {/* Composer slot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        {children}
      </motion.div>

      {/* Feature hints */}
      <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-xl">
        <FeatureHint
          icon={<Image className="w-3.5 h-3.5" />}
          label="Trascina un'immagine"
          delay={0}
        />
        <FeatureHint
          icon={<Mic className="w-3.5 h-3.5" />}
          label="Usa la voce"
          delay={0.05}
        />
        <FeatureHint
          icon={<FileText className="w-3.5 h-3.5" />}
          label="Carica un PDF"
          delay={0.1}
        />
      </div>
    </div>
  );
}
