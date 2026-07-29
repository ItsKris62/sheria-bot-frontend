import type { TableOfContentsItem } from "@/lib/blog/markdown"
import { cn } from "@/lib/utils"

interface BlogTableOfContentsProps {
  items: TableOfContentsItem[]
}

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  if (items.length < 3) return null

  return (
    <nav aria-label="Article table of contents" className="rounded-lg border border-border/70 bg-card/80 p-4">
      <details className="group lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-foreground marker:text-primary">
          In this article
        </summary>
        <TableOfContentsList items={items} className="mt-3" />
      </details>
      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-foreground">In this article</p>
        <TableOfContentsList items={items} className="mt-3" />
      </div>
    </nav>
  )
}

function TableOfContentsList({ items, className }: { items: TableOfContentsItem[]; className?: string }) {
  return (
    <ol className={cn("space-y-2 text-sm", className)}>
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
          <a
            href={`#${item.id}`}
            className="block rounded-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  )
}
