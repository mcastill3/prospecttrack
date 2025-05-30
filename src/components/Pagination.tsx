"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    const minPage = Math.max(1, page - 2);
    const maxPage = Math.min(totalPages, page + 2);

    if (minPage > 1) {
      pageNumbers.push(1);
      if (minPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = minPage; i <= maxPage; i++) {
      pageNumbers.push(i);
    }

    if (maxPage < totalPages) {
      if (maxPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>

      <div className="flex items-center gap-2 text-sm">
        {pageNumbers.map((p, index) =>
          p === "..." ? (
            <span key={`dots-${index}`} className="px-2">...</span>
          ) : (
            <button
              key={p}
              className={`px-2 rounded-sm ${
                page === p ? "bg-lamaPurple1 text-white font-bold" : ""
              }`}
              onClick={() => changePage(Number(p))}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        disabled={!hasNext}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
