import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="rounded-lg px-3 py-1.5 text-sm hover:bg-foreground/5 transition-colors"
        >
          이전
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={`/?page=${page}`}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            page === currentPage
              ? "bg-foreground text-background font-medium"
              : "hover:bg-foreground/5"
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="rounded-lg px-3 py-1.5 text-sm hover:bg-foreground/5 transition-colors"
        >
          다음
        </Link>
      )}
    </nav>
  );
}
