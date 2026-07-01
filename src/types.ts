export interface SkinMetrics {
  oil: number;
  hydration: number;
  sensitivity: number;
  acne: number;
  wrinkle: number;
}

export interface Hotspot {
  name: string;
  level: string; // e.g. "极高" | "高" | "中" | "低"
  type: "oil" | "inflammation" | "normal";
  x: number; // percentage coordinate (0-100)
  y: number; // percentage coordinate (0-100)
}

export interface SkincareIngredient {
  name: string;
  ratio: string;
  reason: string;
}

export interface Recipe {
  base: "water" | "essence" | "lotion" | "oil" | "cleanser";
  efficacies: string[];
  ingredients: SkincareIngredient[];
  scent: string;
  size: "30ml" | "60ml";
}

export interface DiagnosisReport {
  diagnosisTitle: string;
  diagnosisDesc: string;
  metrics: SkinMetrics;
  hotspots: Hotspot[];
  recommendedRecipe: {
    base: "water" | "essence" | "lotion" | "oil" | "cleanser";
    efficacies: string[];
    ingredients: SkincareIngredient[];
  };
}

export type ScreenType = "START" | "SCANNING" | "DIAGNOSIS" | "CUSTOMIZE" | "SUBSCRIBE";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
