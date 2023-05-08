import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImage(url: string | undefined): boolean {
  return url ? /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url) : false
}
