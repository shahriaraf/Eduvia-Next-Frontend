import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional className fragments and resolves Tailwind class
 * conflicts (e.g. "px-2" followed by "px-4" keeps only the latter).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
