export interface TableOfContentsItem {
  id: string
  text: string
  level: 2 | 3
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function extractTableOfContents(markdown: string): TableOfContentsItem[] {
  const seen = new Map<string, number>()
  const items: TableOfContentsItem[] = []

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const level = match[1].length as 2 | 3
    const text = match[2].replace(/\s+#+$/, "").trim()
    const baseId = slugifyHeading(text)
    if (!baseId) continue

    const count = seen.get(baseId) ?? 0
    seen.set(baseId, count + 1)
    items.push({
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
      text,
      level,
    })
  }

  return items
}
