import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional className fragments and resolves Tailwind class
 * conflicts (e.g. "px-2" followed by "px-4" keeps only the latter).
 * Used by every component in components/ui so variant props can safely
 * be overridden by a caller-supplied className.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
