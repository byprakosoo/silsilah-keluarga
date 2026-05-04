import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push("...")
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push("...")
    }

    pages.push(totalPages)
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-accent)] hover:text-white"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 text-center text-sm"
            style={{
              fontFamily: "var(--font-elms-sans), sans-serif",
              color: "var(--on-surface-variant)",
            }}
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full text-sm"
            style={{
              fontFamily: "var(--font-elms-sans), sans-serif",
              backgroundColor:
                page === currentPage ? "var(--gold-accent)" : "transparent",
              color: page === currentPage ? "#ffffff" : "var(--gold-accent)",
              borderColor: "var(--gold-accent)",
              fontWeight: page === currentPage ? 700 : 500,
            }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-accent)] hover:text-white"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
