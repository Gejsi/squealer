import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImage(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url)
}

export function isYoutubeUrl(url: string): boolean {
  const YOUTUBE_REGEX =
    /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)(?!.*\/channel\/)(?!\/@)(.+)?$/

  return YOUTUBE_REGEX.test(url)
}

export function isLink(url: string): boolean {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
    url
  )
}
