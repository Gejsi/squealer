export function isImage(url: string | undefined): boolean {
  return url ? /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url) : false
}
