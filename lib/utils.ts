import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount with R symbol (South African Rand)
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "R0.00";
  return `R${numAmount.toFixed(2)}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(): string {
  return "R";
}
