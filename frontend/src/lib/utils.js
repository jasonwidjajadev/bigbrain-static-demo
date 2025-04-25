import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// Helper function for shadcn
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
