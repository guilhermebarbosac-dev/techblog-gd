'use client'
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { PaginationProps } from '@/lib/types';

export default function PaginationGlobal({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {

  //FUNÇÃO ASSÍNCRONA PARA OBTER PÁGINAS VISÍVEIS
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {

      pages.push(1);

      if (currentPage > 2) {
        if (currentPage > 3) {
          pages.push('ellipsis1');
        }
        if (currentPage !== 1 && currentPage !== totalPages) {
          pages.push(currentPage);
        }
      }

      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
          pages.push('ellipsis2');
        }
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  //FUNÇÃO PARA ALTERNAR ENTRE PAGINAS EXISTENTES
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  //SE HOUVER APENAS UMA PÁGINA RETORNA NULO
  if (totalPages <= 1) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center w-full py-4 px-2">
        <Pagination className="w-full max-w-lg">
          <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {visiblePages.map((page) => {
              if (typeof page === 'string' && page.startsWith('ellipsis')) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis className="h-8 w-8 sm:h-10 sm:w-10 text-primary text-[14px] leading-[21px] tracking-normal font-bold bg-button-primary rounded-[20px] border-none" />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    className={`h-8 w-8 sm:h-10 sm:w-10 text-primary text-xs sm:text-[14px] leading-[21px] tracking-normal font-bold rounded-[20px] border-none cursor-pointer ${currentPage === page ? "bg-button-secondary" : "bg-button-primary hover:bg-button-secondary"
                      }`}
                    isActive={currentPage === page}
                    onClick={() => handlePageClick(page as number)}
                  >
                    <p className="mt-1">{page}</p>
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
