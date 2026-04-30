export function generateSlug(fullName: string, birthYear?: number): string {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
  return birthYear ? `${base}-${birthYear}` : base
}
