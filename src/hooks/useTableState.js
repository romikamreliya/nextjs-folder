import { useState } from "react";
import { perPageOptions } from "@/lib/enum";

/**
 * Generic table state and action handler hook for CRUD pages.
 *
 * @param {{ sortKey?: string, sortDir?: "asc" | "desc" }} config
 * @returns {{
 *   tableState: object,
 *   setTableState: Function,
 *   handleTableAction: (columns: Array, action: string, data: unknown) => void
 * }}
 */
export function useTableState(config = {}) {
    const { sortKey = "createdAt", sortDir = "desc" } = config;

    const [tableState, setTableState] = useState({
        search: "",
        rowsPerPage: 100,
        rowsPerPageOptions: perPageOptions,
        sort: { columnKey: sortKey, direction: sortDir },
        pagination: { currentPage: 1, totalPages: 1, totalRows: 0 },
    });

    /**
     * Shared action dispatcher for AppTable's `actions` prop.
     * @param {Array<{ key: string, sortable?: boolean }>} columns  Page's TableColumns array.
     * @param {string} action  Action type: "search" | "perPage" | "pageChange" | "sort"
     * @param {unknown} data   Payload for the action.
     */
    const handleTableAction = (columns, action, data) => {
        switch (action) {
            case "search":
                setTableState((prev) => ({ ...prev, search: data, pagination: { ...prev.pagination, currentPage: 1 } }));
                break;
            case "perPage":
                setTableState((prev) => ({ ...prev, rowsPerPage: data, pagination: { ...prev.pagination, currentPage: 1 } }));
                break;
            case "pageChange":
                setTableState((prev) => ({ ...prev, pagination: { ...prev.pagination, currentPage: data } }));
                break;
            case "sort": {
                const colIndex = columns.findIndex((c) => c.key === data && c.sortable);
                if (colIndex === -1) return;
                setTableState((prev) => ({
                    ...prev,
                    sort: {
                        columnKey: data,
                        direction: data === prev.sort.columnKey ? (prev.sort.direction === "asc" ? "desc" : "asc") : "asc",
                    },
                }));
                break;
            }
            default:
                break;
        }
    };

    return { tableState, setTableState, handleTableAction };
}
