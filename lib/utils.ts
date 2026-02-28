import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Check if WebGL is supported in the browser */
export function isWebGLSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/** Check if device is mobile based on viewport */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/** Check if user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/** Generate a slug from a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Format a year for display */
export function formatYear(year: number): string {
  return year.toString();
}

/** Get phase color by phase number */
export function getPhaseColor(phase: number): string {
  const colors: Record<number, string> = {
    1: "#3B82F6", // blue
    2: "#EF4444", // red
    3: "#FFD700", // gold
    4: "#A855F7", // purple
    5: "#EC4899", // pink
    6: "#06B6D4", // cyan
  };
  return colors[phase] || "#A855F7";
}

/** Get phase gradient by phase number */
export function getPhaseGradient(phase: number): string {
  const gradients: Record<number, string> = {
    1: "from-blue-600 to-blue-400",
    2: "from-red-600 to-red-400",
    3: "from-yellow-500 to-amber-400",
    4: "from-purple-600 to-purple-400",
    5: "from-pink-600 to-pink-400",
    6: "from-cyan-600 to-cyan-400",
  };
  return gradients[phase] || "from-purple-600 to-purple-400";
}
