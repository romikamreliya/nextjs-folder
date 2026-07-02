"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  cn,
  EmptyState,
} from "@heroui/react";
import AppSearch from "./search";
import AppLoading from "./loading";

import { AltArrowDown, Columns, AltArrowUp, Archive, MenuDots, Trash } from "../icon/icons";

import AppDropdown from "./dropdown";

const SEARCH_ANIM = `
  @keyframes es-radar-sweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes es-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes es-scan-line {
    0% { transform: translateY(0px); opacity: 0.2; }
    50% { opacity: 0.8; }
    100% { transform: translateY(115px); opacity: 0.2; }
  }
  @keyframes es-pulse-glow {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.35; }
  }
  @keyframes es-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
  .es-radar {
    animation: es-radar-sweep 6s linear infinite;
    transform-origin: 180px 90px;
  }
  .es-floating-item {
    animation: es-float 4s ease-in-out infinite;
  }
  .es-scanner-beam {
    animation: es-scan-line 3s ease-in-out infinite alternate;
  }
  .es-glow {
    animation: es-pulse-glow 2.5s ease-in-out infinite;
  }
  .es-led {
    animation: es-blink 1.5s step-end infinite;
  }
`;

function EmptySearchScene() {
  return (
    <div className="relative w-full max-w-[360px] h-[180px] mx-auto mb-2 flex items-center justify-center">
      <style dangerouslySetInnerHTML={{ __html: SEARCH_ANIM }} />
      <svg viewBox="0 0 360 180" fill="none" className="w-full h-full text-(--color-text-muted)" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="es-radar-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-info)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-info)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="es-laser" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-info)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-info)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="es-screen-clip">
            <circle cx="180" cy="90" r="60" />
          </clipPath>
        </defs>

        {/* Grid Floor */}
        <line x1="20" y1="160" x2="340" y2="160" stroke="var(--color-border)" strokeWidth="1.2" />
        {[60, 100, 140, 180, 220, 260, 300].map((x, i) => (
          <line key={i} x1="180" y1="160" x2={x} y2="180" stroke="var(--color-border-subtle)" strokeWidth="0.6" />
        ))}

        {/* Radar Console Base / Pedestal */}
        <path d="M150,160 L160,135 L200,135 L210,160 Z" fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1.2" />
        <line x1="165" y1="145" x2="195" y2="145" stroke="var(--color-border-subtle)" strokeWidth="1" />

        {/* Holographic Radar Screen Circle */}
        <circle cx="180" cy="90" r="60" fill="url(#es-radar-glow)" stroke="var(--color-border)" strokeWidth="1.5" className="es-glow" />
        <circle cx="180" cy="90" r="40" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="180" cy="90" r="20" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Radar Crosshairs */}
        <line x1="180" y1="30" x2="180" y2="150" stroke="var(--color-border-subtle)" strokeWidth="0.8" strokeDasharray="4 4" />
        <line x1="120" y1="90" x2="240" y2="90" stroke="var(--color-border-subtle)" strokeWidth="0.8" strokeDasharray="4 4" />

        {/* Rotating Sweep Line */}
        <line x1="180" y1="90" x2="180" y2="30" stroke="var(--color-info)" strokeWidth="1.5" className="es-radar" />

        {/* Floating Holographic Search Target */}
        <g className="es-floating-item" style={{ transformOrigin: '180px 90px' }}>
          {/* Empty folder icon */}
          <path d="M165,77 H195 V105 H165 Z" fill="var(--color-surface)" stroke="var(--color-border-dark)" strokeWidth="1.5" />
          <path d="M165,77 L173,69 H187 L195,77" fill="var(--color-surface-subtle)" stroke="var(--color-border-dark)" strokeWidth="1.5" />
          {/* Question mark inside folder */}
          <text x="180" y="95" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="14" fontWeight="800" fontFamily="sans-serif">?</text>
          
          {/* Lens hovering over folder */}
          <circle cx="192" cy="74" r="8" stroke="var(--color-info)" strokeWidth="1.8" fill="var(--color-bg)" />
          <line x1="197.5" y1="79.5" x2="205" y2="87" stroke="var(--color-info)" strokeWidth="2.2" />
        </g>

        {/* Status LEDs on pedestal */}
        <circle cx="174" cy="151" r="2" fill="var(--color-danger)" className="es-led" />
        <circle cx="180" cy="151" r="2" fill="var(--color-warning)" className="es-led" style={{ animationDelay: '0.5s' }} />
        <circle cx="186" cy="151" r="2" fill="var(--color-success)" className="es-led" style={{ animationDelay: '1s' }} />

        {/* Scan overlay beam */}
        <g clipPath="url(#es-screen-clip)">
          <line x1="120" y1="30" x2="240" y2="30" stroke="var(--color-info)" strokeWidth="1.5" className="es-scanner-beam" opacity="0.6" />
          <rect x="120" y="30" width="120" height="15" fill="url(#es-laser)" className="es-scanner-beam" />
        </g>
      </svg>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * AppTable — generic, fully self-contained data table.
 *
 * Props:
 *  title              {string}   aria-label for the table
 *  items              {Array}    full dataset (unfiltered, unsorted)
 *  TableColumns       {Array}    [{ key, name, sortable? }]
 *  renderCell         {Function} (item, columnKey) => ReactNode
 *  actions            {Function} (action, data) => void
 *  searchText         {string}   current search query
 *  rowsPerPageOptions {Array}    options for the "Show" selector  (default: [100,200,300,500,1000])
 *  defaultRowsPerPage {number}   (default: 100)
 *  searchPlaceholder  {string}   placeholder for the search input
 *  emptyContent       {string}   text shown when no rows match
 *  pagination         {Object}   { currentPage, totalPages, totalRows }
 *  rowClassName       {Function} (item) => string, extra className applied to that row's <TableRow>
 */
const AppTable = ({
  title = "Table",
  items = [],
  TableColumns = [],
  renderCell,
  actions,
  searchText = "",
  rowsPerPageOptions = [100, 200, 300, 500, 1000],
  defaultRowsPerPage = 100,
  searchPlaceholder = "Search...",
  emptyContent = "No data found.",
  pagination = { currentPage: 1, totalPages: 1, totalRows: 0 },
  sort = { columnKey: null, direction: null },
  loading = false,
  rowClassName,
}) => {
  const { t } = useTranslation("common");
  const resolvedSearchPlaceholder = searchPlaceholder ?? t("table.search");
  const resolvedEmptyContent      = emptyContent ?? t("table.noData");

  // ── State ──────────────────────────────────────────────────────────────────
  const [rowCount, setRowCount] = useState(defaultRowsPerPage);
  const [tableColumn, setTableColumn] = useState(TableColumns.map((col) => col.key));

  // ── Header: columns to render ────────────────────────────────────────────
  const displayedHeaderColumns = useMemo(
    () => TableColumns.filter((c) => tableColumn.includes(c.key)),
    [tableColumn, TableColumns]
  );

  const getPageNumbers = () => {
    const pages = [];

    if (pagination.totalPages <= 1) {
      return [1];
    }

    pages.push(1);

    if (pagination.currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, pagination.currentPage - 1);
    const end = Math.min(pagination.totalPages - 1, pagination.currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (pagination.currentPage < pagination.totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(pagination.totalPages);

    return [...new Set(pages)];
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="card-premium animate-fade-in-up mb-7 bg-(--color-surface) border border-border-subtle p-4 rounded-[26px]">
      {/* ── Toolbar ── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-100 flex-1">
          <AppSearch
            placeholder={resolvedSearchPlaceholder}
            value={searchText}
            onChange={(e) => actions("search", e)}
          />
        </div>

        {/* Column Visibility */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0">
          <AppDropdown
            label={t("table.columns")}
            icon={Columns}
            arrowIcon={AltArrowDown}
            selectionMode="multiple"
            selectedKeys={tableColumn}
            items={TableColumns.map((col) => ({ label: col.name ?? col.label, value: col.key }))}
            onChange={(key) => {
              setTableColumn((prev) =>
                prev.includes(key)
                  ? (prev.length === 1 ? prev : prev.filter((item) => item !== key))
                  : [...prev, key]
              );
            }}
          />
          <AppDropdown
            label={t("table.rows", { count: rowCount })}
            icon={MenuDots}
            arrowIcon={AltArrowDown}
            selectedKeys={[String(rowCount)]}
            items={rowsPerPageOptions.map((option) => ({ label: String(option), value: String(option) }))}
            onChange={(key) => {
              setRowCount(key)
              actions("perPage", key);
            }}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto min-w-full">
        <Table
          aria-label={title}
          className="min-w-full"
        >
          <Table.ScrollContainer>
          <TableContent aria-labelledby={title} className="min-w-120">
            <TableHeader>
              {displayedHeaderColumns.map((col) => {
                const sortDirection = sort.columnKey === col.key ? sort.direction : null;
                return (
                  <TableColumn 
                    isRowHeader
                    key={col.key}
                    align={col.key === "actions" ? "end" : "start"}
                    onClick={() => actions("sort", col.key)}
                    className={col.sortable ? "cursor-pointer select-none" : ""}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.name ?? col.label}
                      {col.sortable && sort.columnKey === col.key && (
                        <span className="inline-flex flex-col gap-px">
                          <AltArrowUp
                            className={cn(
                                      "size-3 transform transition-transform duration-100 ease-out",
                                      sortDirection === "desc" ? "rotate-180" : "",
                                    )}
                          />
                        </span>
                      )}
                    </span>
                  </TableColumn>
                );
              })}
            </TableHeader>

            <TableBody
              renderEmptyState={() => (
                loading ? (
                  <div className="flex items-center justify-center py-10">
                    <AppLoading />
                  </div>
                ) :
                items.length === 0 ? (
                  searchText ? (
                    <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-3 text-center py-12">
                      <EmptySearchScene />
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-base font-semibold text-(--color-text-primary)">
                          {t("table.noMatchingRecords")}
                        </h3>
                        <p className="text-xs sm:text-sm text-(--color-text-muted) max-w-[280px] sm:max-w-none">
                          {t("table.tryDifferentKeyword")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => actions("search", "")}
                        className="mt-2 px-4 py-1.5 text-sm font-semibold rounded-full border border-border-subtle bg-(--color-surface) text-(--color-text-primary) shadow-(--shadow-xs) hover:bg-(--color-hover) active:scale-[0.97] transition-all cursor-pointer"
                      >
                        {t("table.clearSearch")}
                      </button>
                    </EmptyState>
                  ) : (
                    <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center py-10">
                      <Archive className="size-6 text-(--color-text-muted)" />
                      <span className="text-sm text-(--color-text-muted)">{resolvedEmptyContent}</span>
                    </EmptyState>
                  )
                ) : null
              )}
            >
              {(loading ? [] : items).map((item, index) => (
                <TableRow key={item.id ?? index} className={rowClassName?.(item) || undefined}>
                  {displayedHeaderColumns.map((col) => (
                    <TableCell key={col.key}>{renderCell(item, col.key)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableContent>
          </Table.ScrollContainer>
          {
            pagination.totalRows > 0 && (
              <Table.Footer>
                <Pagination size="sm" className="max-sm:grid max-sm:items-center max-sm:justify-center max-sm:justify-items-center">
                  <Pagination.Summary>
                    {t("table.showing", {
                      from:  (pagination.currentPage - 1) * defaultRowsPerPage + 1 || 1,
                      to:    Math.min(pagination.currentPage * defaultRowsPerPage, pagination.totalRows),
                      total: pagination.totalRows,
                    })}
                  </Pagination.Summary>
                  <Pagination.Content>
                    <Pagination.Item>
                      <Pagination.Previous
                        isDisabled={pagination.currentPage === 1}
                        onPress={() => actions("pageChange", pagination.currentPage - 1)}
                      >
                        <Pagination.PreviousIcon />
                        {t("pagination.prev")}
                      </Pagination.Previous>
                    </Pagination.Item>
                    {getPageNumbers().map((p, i) =>
                        p === "ellipsis" ? (
                          <Pagination.Item key={`ellipsis-${i}`}>
                            <Pagination.Ellipsis />
                          </Pagination.Item>
                        ) : (
                          <Pagination.Item key={p}>
                            <Pagination.Link isActive={p === pagination.currentPage} onPress={() => actions("pageChange", p)}>
                              {p}
                            </Pagination.Link>
                          </Pagination.Item>
                        ),
                      )}
                    <Pagination.Item>
                      <Pagination.Next
                        isDisabled={pagination.currentPage === pagination.totalPages}
                        onPress={() => actions("pageChange", pagination.currentPage + 1)}
                      >
                        {t("pagination.next")}
                        <Pagination.NextIcon />
                      </Pagination.Next>
                    </Pagination.Item>
                  </Pagination.Content>
                </Pagination>
              </Table.Footer>
            )
          }
        </Table>
      </div>
    </div>
  );
};

export default AppTable;