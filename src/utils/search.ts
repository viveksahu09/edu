export function searchItems<T>(items: T[], query: string, key: keyof T): T[] {
  if (!query.trim()) return items;

  return items.filter((item) => {
    const value = item[key];
    if (typeof value === "string") {
      return value.toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });
}
