/**
 * Model tier configuration for the chat application
 *
 * Defines four performance tiers:
 * - Istantaneo: Fastest responses, lower quality (~23s)
 * - Base: Fast, balanced (default, ~27s)
 * - Medio: Better reasoning capabilities (~61s)
 * - Avanzato: Best quality, most focused responses (~78s)
 */

export const MODEL_TIERS = {
  istantaneo: {
    model: "gpt-5-nano",
    reasoning: "low" as const,
    label: "Istantaneo",
  },
  base: {
    model: "gpt-5-nano",
    reasoning: "medium" as const,
    label: "Base",
  },
  medio: {
    model: "gpt-5-mini",
    reasoning: "medium" as const,
    label: "Medio",
  },
  avanzato: {
    model: "gpt-5",
    reasoning: "high" as const,
    label: "Avanzato",
  },
} as const;

export type ModelTier = keyof typeof MODEL_TIERS;
export type ReasoningEffort = "low" | "medium" | "high";

export const DEFAULT_TIER: ModelTier = "base";

/**
 * Get model configuration for a given tier
 */
export function getModelConfig(tier: ModelTier = DEFAULT_TIER) {
  return MODEL_TIERS[tier] || MODEL_TIERS[DEFAULT_TIER];
}
