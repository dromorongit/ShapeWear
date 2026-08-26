export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateReferralCode(name: string): string {
  const base = slugify(name).slice(0, 20)
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${base}-${suffix}`
}
