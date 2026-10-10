import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatCurrency(v: number, c = "SAR") { return `${c} ${v.toLocaleString()}`; }
export function formatNumber(v: number, d = 0) { return v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }); }
