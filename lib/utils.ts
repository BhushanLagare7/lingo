import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names with clsx
 * Utility function for conditionally combining CSS class names
 * Automatically handles conflicts and merges Tailwind classes efficiently
 *
 * @param {...ClassValue} inputs - Array of class names or condition-value pairs
 * @returns {string} Merged and optimized CSS class string
 *
 * @example
 * // Conditional class application
 * const isActive = true;
 * const buttonClass = cn(
 *   "px-4 py-2 rounded",
 *   isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
 * );
 *
 * @example
 * // Multiple class combinations
 * const combinedClass = cn(
 *   "font-medium",
 *   "text-lg",
 *   size === "sm" && "text-sm",
 *   error && "border-red-500"
 * );
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Get absolute URL for a given path
 * @param {string} path - The path to append to the base URL
 * @returns {string} The absolute URL with protocol and domain
 *
 * @example
 * // Returns: https://localhost:3000/learn/path
 * const url = absoluteUrl("/learn/path");
 */
export const absoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};
