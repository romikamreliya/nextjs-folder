"use client";

import React, { useMemo } from "react";
import AppTable from "@/components/ui/table";
import { useTableState } from "@/hooks/useTableState";
import { StatusChip } from "@/components/ui/statusTag";
import { useTranslation } from "@/hooks/useTranslation";

// ── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "1", name: "Alice Johnson", email: "alice.johnson@example.com", role: "Administrator", status: "active", createdAt: "2026-01-10" },
  { id: "2", name: "Bob Smith", email: "bob.smith@example.com", role: "Editor", status: "active", createdAt: "2026-02-14" },
  { id: "3", name: "Charlie Brown", email: "charlie.brown@example.com", role: "Viewer", status: "inactive", createdAt: "2026-03-01" },
  { id: "4", name: "Diana Prince", email: "diana.prince@example.com", role: "Administrator", status: "active", createdAt: "2025-12-25" },
  { id: "5", name: "Evan Wright", email: "evan.wright@example.com", role: "Editor", status: "pending", createdAt: "2026-04-18" },
  { id: "6", name: "Fiona Gallagher", email: "fiona.g@example.com", role: "Viewer", status: "locked", createdAt: "2026-05-02" },
  { id: "7", name: "George Costanza", email: "george.c@example.com", role: "Editor", status: "inactive", createdAt: "2026-01-20" },
  { id: "8", name: "Hannah Abbott", email: "hannah.a@example.com", role: "Viewer", status: "active", createdAt: "2026-06-12" },
  { id: "9", name: "Ian Malcolm", email: "chaos.ian@example.com", role: "Administrator", status: "active", createdAt: "2025-11-30" },
  { id: "10", name: "Julia Roberts", email: "julia.r@example.com", role: "Editor", status: "pending", createdAt: "2026-06-05" },
];

export default function DemoTablePage() {
  const { t } = useTranslation(["common", "sidebar"]);

  // Define Table Columns
  const TableColumns = useMemo(() => [
    { key: "name", name: "Name", sortable: true },
    { key: "email", name: "Email Address", sortable: true },
    { key: "role", name: "User Role", sortable: true },
    { key: "status", name: "Account Status", sortable: true },
    { key: "createdAt", name: "Date Created", sortable: true },
  ], []);

  // useTableState Hook to manage client-side state
  const { tableState, setTableState, handleTableAction } = useTableState({
    sortKey: "name",
    sortDir: "asc"
  });

  // Client-side filtering, sorting, and pagination logic
  const processedData = useMemo(() => {
    let result = [...MOCK_USERS];

    // 1. Search Filter
    if (tableState.search.trim()) {
      const query = tableState.search.toLowerCase().trim();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
    }

    // 2. Sorting
    if (tableState.sort.columnKey) {
      const { columnKey, direction } = tableState.sort;
      result.sort((a, b) => {
        const valA = String(a[columnKey] || "").toLowerCase();
        const valB = String(b[columnKey] || "").toLowerCase();
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tableState.search, tableState.sort]);

  // Pagination bounds calculation
  const totalRows = processedData.length;
  const totalPages = Math.ceil(totalRows / tableState.rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (tableState.pagination.currentPage - 1) * tableState.rowsPerPage;
    const end = start + tableState.rowsPerPage;
    return processedData.slice(start, end);
  }, [processedData, tableState.pagination.currentPage, tableState.rowsPerPage]);

  // Synchronize pagination total rows/pages back to useTableState
  React.useEffect(() => {
    setTableState((prev) => {
      if (
        prev.pagination.totalRows === totalRows &&
        prev.pagination.totalPages === totalPages
      ) {
        return prev;
      }
      return {
        ...prev,
        pagination: {
          ...prev.pagination,
          totalRows,
          totalPages,
          currentPage: Math.min(prev.pagination.currentPage, totalPages) || 1,
        },
      };
    });
  }, [totalRows, totalPages, setTableState]);

  // Action dispatcher
  const actions = (action, data) => {
    handleTableAction(TableColumns, action, data);
  };

  // Cell Renderer
  const renderCell = (user, columnKey) => {
    switch (columnKey) {
      case "name":
        return <span className="font-semibold text-(--color-text-primary)">{user.name}</span>;
      case "email":
        return <span className="text-(--color-text-secondary)">{user.email}</span>;
      case "role":
        return <span className="text-(--color-text-muted) font-medium">{user.role}</span>;
      case "status":
        return <StatusChip status={user.status} />;
      case "createdAt":
        return <span className="text-(--color-text-muted) text-xs font-mono">{user.createdAt}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) tracking-tight">
          Demo User Accounts
        </h1>
        <p className="text-sm text-(--color-text-muted) mt-1">
          A fully interactive demonstration table using the custom, reusable AppTable component with client-side state management.
        </p>
      </div>

      <AppTable
        title="Demo Users Table"
        items={paginatedData}
        TableColumns={TableColumns}
        renderCell={renderCell}
        actions={actions}
        searchText={tableState.search}
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10, 20]}
        pagination={{
          currentPage: tableState.pagination.currentPage,
          totalPages,
          totalRows,
        }}
        sort={tableState.sort}
      />
    </div>
  );
}
