"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MODEL_TIERS, DEFAULT_TIER } from "@/lib/model-config"

/**
 * Model tier selector dropdown
 * Allows users to choose between Istantaneo, Base, Medio, and Avanzato performance tiers
 */
export function ModelSelector({ value = DEFAULT_TIER, onChange, className = "" }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[110px] h-8 text-xs ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MODEL_TIERS).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            {config.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ModelSelector
