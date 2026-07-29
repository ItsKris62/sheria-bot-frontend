export interface BlogRouteState {
  q?: string
  category?: string
  tag?: string
  page?: number
}

export function normaliseBlogPage(value: string | number | undefined): number {
  const page = typeof value === "number" ? value : Number.parseInt(value || "1", 10)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export function cleanBlogParam(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function buildBlogHref(state: BlogRouteState, hash = "articles"): string {
  const params = new URLSearchParams()
  const q = cleanBlogParam(state.q)
  const category = cleanBlogParam(state.category)
  const tag = cleanBlogParam(state.tag)
  const page = normaliseBlogPage(state.page)

  if (q) params.set("q", q)
  if (category && category !== "All") params.set("category", category)
  if (tag) params.set("tag", tag)
  if (page > 1) params.set("page", String(page))

  const query = params.toString()
  return `/blog${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`
}

export function getPaginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: Array<number | "ellipsis"> = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) items.push("ellipsis")
  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }
  if (end < totalPages - 1) items.push("ellipsis")
  items.push(totalPages)
  return items
}

export function safeImageUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  if (value.startsWith("/")) return value
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined
  } catch {
    return undefined
  }
}

const SENSITIVE_SOURCE_PARAMS = [
  "access_token",
  "api_key",
  "auth",
  "authorization",
  "code",
  "credential",
  "expires",
  "jwt",
  "key",
  "policy",
  "refresh_token",
  "secret",
  "signature",
  "signed",
  "token",
  "x-amz-credential",
  "x-amz-signature",
]

export function safeSourceUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined

  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined
    if (url.username || url.password) return undefined

    for (const key of Array.from(url.searchParams.keys())) {
      const normalized = key.toLowerCase()
      if (SENSITIVE_SOURCE_PARAMS.some((sensitive) => normalized.includes(sensitive))) {
        url.searchParams.delete(key)
      }
    }

    return url.toString()
  } catch {
    return undefined
  }
}
