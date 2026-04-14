/**
 * Slug Generator Utility
 * Converts university names to URL-friendly slugs
 */

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove multiple hyphens
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
}

export function generateUniqueSlug(name: string, existingSlugs: string[]): string {
  let baseSlug = generateSlug(name);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
