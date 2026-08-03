import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { buildBlogHref, getPaginationItems, type BlogRouteState } from "@/lib/blog/url"
import { cn } from "@/lib/utils"

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  state: BlogRouteState
}

export function BlogPagination({ currentPage, totalPages, state }: BlogPaginationProps) {
  if (totalPages <= 1) return null

  const items = getPaginationItems(currentPage, totalPages)
  const previousDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  return (
    <Pagination className="mt-10" aria-label="Blog article pages">
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          {previousDisabled ? (
            <span
              aria-disabled="true"
              className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm text-muted-foreground/50"
            >
              Previous
            </span>
          ) : (
            <PaginationPrevious href={buildBlogHref({ ...state, page: currentPage - 1 })} />
          )}
        </PaginationItem>

        {items.map((item, index) => (
          <PaginationItem key={`${item}-${index}`}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={item === currentPage}
                href={buildBlogHref({ ...state, page: item })}
                aria-label={`Go to page ${item}`}
                className={cn(item === currentPage && "border-primary/60 bg-primary/10 text-primary")}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          {nextDisabled ? (
            <span
              aria-disabled="true"
              className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm text-muted-foreground/50"
            >
              Next
            </span>
          ) : (
            <PaginationNext href={buildBlogHref({ ...state, page: currentPage + 1 })} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
