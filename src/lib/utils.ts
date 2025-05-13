
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add formatting utility for large numbers
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Utility function to determine flood severity color
export function getFloodSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'severe':
      return 'text-flood-danger';
    case 'high':
      return 'text-flood-warning';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
    default:
      return 'text-flood-safe';
  }
}
