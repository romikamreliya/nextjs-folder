"use client";

import React from "react";
import AppCheckbox from "@/components/ui/checkbox";
import { 
  ShieldUser, Settings, Users, Briefcase, Package, CheckCircle, Widget, 
  DollarSign, ShoppingCart, Buildings, Chart2, Shop, Box, Tag, 
  Star, VerifiedCheck, AdjustmentIcon, Bill, CardSend, List, Calendar, FileText,
} from "@/components/icon/icons";

function getResourceIcon(label) {
  if (!label) return Widget;
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("user role") || lowerLabel.includes("role")) return ShieldUser;
  if (lowerLabel.includes("customer")) return Users;
  if (lowerLabel.includes("user")) return Users;
  if (lowerLabel.includes("branch")) return Shop;
  if (lowerLabel.includes("department")) return Buildings;
  if (lowerLabel.includes("designation")) return Briefcase;
  if (lowerLabel.includes("product group")) return Tag;
  if (lowerLabel.includes("product brand") || lowerLabel.includes("brand")) return Star;
  if (lowerLabel.includes("product")) return Box;
  if (lowerLabel.includes("license")) return VerifiedCheck;
  if (lowerLabel.includes("tax registration") || lowerLabel.includes("tax")) return FileText;
  if (lowerLabel.includes("supplier invoice") || lowerLabel.includes("invoice")) return Bill;
  if (lowerLabel.includes("supplier payment") || lowerLabel.includes("payment")) return CardSend;
  if (lowerLabel.includes("supplier")) return DollarSign;
  if (lowerLabel.includes("stock adjustment") || lowerLabel.includes("stock")) return AdjustmentIcon;
  if (lowerLabel.includes("purchase order")) return ShoppingCart;
  if (lowerLabel.includes("asn")) return Package;
  if (lowerLabel.includes("grn")) return FileText;
  if (lowerLabel.includes("chart of account")) return List;
  if (lowerLabel.includes("financial year")) return Calendar;
  if (lowerLabel.includes("account statement") || lowerLabel.includes("statement")) return FileText;

  if (lowerLabel.includes("setting") || lowerLabel.includes("config")) return Settings;
  if (lowerLabel.includes("report") || lowerLabel.includes("analytic")) return Chart2;
  
  return Widget;
}

function getModuleIcon(label) {
  const key = String(label || "").toLowerCase();
  if (key.includes("admin")) return Users;
  if (key.includes("business")) return Briefcase;
  if (key.includes("inventory")) return Package;
  if (key.includes("system")) return Settings;
  if (key.includes("trading")) return ShoppingCart;
  if (key.includes("accounting")) return DollarSign;
  if (key.includes("hr")) return Buildings;
  return ShieldUser;
}

export default function PermissionMatrixTable({
  isLoading = false,
  rows = [],
  selectedPermissions = [],
  onTogglePermission,
  onToggleColumn,
  onToggleRow,
  readOnly = false,
  loadingLabel,
  emptyLabel,
  columns = [],
  quickToggleLabel = "QUICK TOGGLE (APPLY TO ALL MODULES)",
  quickToggleDesc = "Click any action below (like View, Add, Edit) to select or deselect it for all Modules rows instantly.",
  allSelectedLabel = "All Selected",
  partiallySelectedLabel = "Partially Selected (Click to Select All)",
  noneSelectedLabel = "None Selected",
}) {
  const selectedSet = React.useMemo(() => new Set(selectedPermissions), [selectedPermissions]);

  const groupedRows = React.useMemo(() => {
    const groups = new Map();
    rows.forEach((row) => {
      const groupKey = row.moduleLabel || "General";
      const list = groups.get(groupKey) ?? [];
      list.push(row);
      groups.set(groupKey, list);
    });
    return Array.from(groups.entries());
  }, [rows]);

  const columnPermissionIds = React.useMemo(() => {
    const nextColumns = {};
    columns.forEach((column) => { nextColumns[column.key] = []; });
    rows.forEach((row) => {
      columns.forEach((column) => {
        const key = column.key;
        const permission = row.actions[key];
        if (permission?.id) nextColumns[key].push(permission.id);
      });
    });
    return nextColumns;
  }, [rows, columns]);

  const getColumnState = React.useCallback((columnKey) => {
    const ids = columnPermissionIds[columnKey] ?? [];
    const selectedCount = ids.filter((id) => selectedSet.has(id)).length;
    return {
      allSelected: ids.length > 0 && selectedCount === ids.length,
      isIndeterminate: selectedCount > 0 && selectedCount < ids.length,
    };
  }, [columnPermissionIds, selectedSet]);

  const getModuleSelectionStats = React.useCallback((groupRows) => {
    const ids = groupRows.flatMap(row => Object.values(row.actions).filter(Boolean).map(p => p.id));
    const selectedCount = ids.filter(id => selectedSet.has(id)).length;
    return {
      selectedCount,
      totalCount: ids.length,
      isAllSelected: ids.length > 0 && selectedCount === ids.length,
      isIndeterminate: selectedCount > 0 && selectedCount < ids.length,
    };
  }, [selectedSet]);

  const handleToggleModule = React.useCallback((groupRows) => {
    if (readOnly) return;
    const allIds = groupRows.flatMap(row => Object.values(row.actions).filter(Boolean).map(p => p.id));
    const selectedCount = allIds.filter(id => selectedSet.has(id)).length;
    const isModuleAllSelected = allIds.length > 0 && selectedCount === allIds.length;

    if (isModuleAllSelected) {
      groupRows.forEach(row => {
        const rowIds = Object.values(row.actions).filter(Boolean).map(p => p.id);
        const isRowSelected = rowIds.length > 0 && rowIds.every(id => selectedSet.has(id));
        if (isRowSelected) {
          onToggleRow?.(row);
        }
      });
    } else {
      groupRows.forEach(row => {
        const rowIds = Object.values(row.actions).filter(Boolean).map(p => p.id);
        const isRowSelected = rowIds.length > 0 && rowIds.every(id => selectedSet.has(id));
        if (!isRowSelected) {
          onToggleRow?.(row);
        }
      });
    }
  }, [selectedSet, onToggleRow, readOnly]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-(--color-border-dashed) rounded-2xl bg-(--color-bg-subtle)/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--color-btn-primary) mb-4"></div>
        <p className="text-sm font-semibold text-(--color-text-secondary)">{loadingLabel}</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-(--color-border-dashed) rounded-2xl bg-(--color-bg-subtle)/50 text-center">
        <ShieldUser className="h-10 w-10 text-(--color-text-muted)/50 mb-4" />
        <p className="text-sm font-semibold text-(--color-text-secondary)">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      
      {/* Quick Select Bar */}
      {!readOnly && (
        <div 
          className="flex flex-col gap-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 px-5 py-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 text-white mt-0.5 shadow-sm">
              <svg className="size-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                {quickToggleLabel}
              </h5>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                {quickToggleDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pl-8">
            {columns.map(column => {
               const state = getColumnState(column.key);
               return (
                 <AppCheckbox
                   key={column.key}
                   name={`quick-col-${column.key}`}
                   label={column.label}
                   isSelected={state.allSelected}
                   isIndeterminate={state.isIndeterminate}
                   disabled={readOnly}
                   onChange={() => onToggleColumn?.(column.key)}
                   className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                     state.allSelected 
                      ? "border-zinc-900/20 bg-zinc-900/5 text-zinc-900 dark:border-zinc-700/60 dark:bg-zinc-800/40 dark:text-zinc-100 shadow-sm" 
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                   }`}
                   classNames={{
                     label: "text-[10px] font-bold uppercase tracking-wider text-inherit cursor-pointer"
                   }}
                 />
               );
            })}
          </div>

          <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 w-full" />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-8 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 select-none">
            <div className="flex items-center gap-2">
              <div className="flex size-4 items-center justify-center rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-sm">
                <svg className="size-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <span>{allSelectedLabel}</span>
            </div>

            <span className="text-zinc-300 dark:text-zinc-700 font-bold">•</span>

            <div className="flex items-center gap-2">
              <div className="flex size-4 items-center justify-center rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 text-zinc-750 dark:text-zinc-250 shadow-sm">
                <div className="w-2 h-0.5 bg-current rounded-full" />
              </div>
              <span>{partiallySelectedLabel}</span>
            </div>

            <span className="text-zinc-300 dark:text-zinc-700 font-bold">•</span>

            <div className="flex items-center gap-2">
              <div className="size-4 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm" />
              <span>{noneSelectedLabel}</span>
            </div>
          </div>
        </div>
      )}
      <div 
        className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-(--color-surface) overflow-hidden"
      >
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200/50 dark:border-zinc-800/50">
              <tr>
                <th 
                  className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider sticky left-0 z-10 bg-zinc-50/95 dark:bg-zinc-900/95 border-r border-(--color-border-subtle) dark:border-zinc-800/50 min-w-[220px]"
                  style={{ borderRightColor: "var(--color-border-subtle)" }}
                >
                  MODULE / RESOURCE
                </th>
                <th 
                  className="px-3 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-center border-r border-(--color-border-subtle) dark:border-zinc-800/50"
                  style={{ borderRightColor: "var(--color-border-subtle)" }}
                >
                  FULL ACCESS
                </th>
                {columns.map(col => (
                  <th key={col.key} className="px-3 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-center">
                    {col.label.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {groupedRows.map(([moduleLabel, groupRows], moduleIndex) => {
                const ModuleIcon = getModuleIcon(moduleLabel);
                const stats = getModuleSelectionStats(groupRows);
                
                return (
                  <React.Fragment key={moduleLabel}>
                    {/* Module Header Row */}
                    <tr 
                      className="bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-y border-zinc-200/60 dark:border-zinc-800/60"
                    >
                      {/* Module Column 1 */}
                      <td 
                        className="px-5 py-3.5 sticky left-0 z-10 bg-zinc-50/95 dark:bg-zinc-900/95 border-r border-(--color-border-subtle) dark:border-zinc-800/50"
                        style={{ borderRightColor: "var(--color-border-subtle)" }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Module Icon */}
                          <div className="flex shrink-0 items-center justify-center w-7 h-7 rounded shadow-sm border transition-colors duration-500 ease-out bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100">
                            <ModuleIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">{moduleLabel}</span>
                            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {stats.selectedCount} of {stats.totalCount} selected
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Module Column 2 (FULL ACCESS) */}
                      <td 
                        className="px-3 module-table-section py-3.5 text-center border-r border-(--color-border-subtle) dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/20"
                        style={{ borderRightColor: "var(--color-border-subtle)" }}
                      >
                        <div className="flex w-full items-center justify-center">
                          <AppCheckbox
                            name={`module-full-${moduleLabel}`}
                            isSelected={stats.isAllSelected}
                            isIndeterminate={stats.isIndeterminate}
                            disabled={readOnly}
                            onChange={() => handleToggleModule(groupRows)}
                          />
                        </div>
                      </td>

                      {/* Empty Action Columns for Module Row */}
                      {columns.map(col => (
                        <td key={col.key} className="px-3 py-3.5 bg-zinc-50/20 dark:bg-zinc-900/10 border-b border-zinc-200/60 dark:border-zinc-800/60" />
                      ))}
                    </tr>
                    
                    {/* Resource Rows */}
                    {groupRows.map((row, rowIndex) => {
                      const ResourceIcon = getResourceIcon(row.resourceLabel);
                      const rowPermissionIds = Object.values(row.actions).filter(Boolean).map(p => p.id);
                      const selectedRowPermissionCount = rowPermissionIds.filter(id => selectedSet.has(id)).length;
                      
                      const isRowAllSelected = rowPermissionIds.length > 0 && selectedRowPermissionCount === rowPermissionIds.length;
                      const isRowIndeterminate = selectedRowPermissionCount > 0 && selectedRowPermissionCount < rowPermissionIds.length;
                      
                      return (
                        <tr 
                          key={row.id} 
                          className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/30 transition-colors duration-500 ease-out group"
                        >
                          {/* Resource Column */}
                          <td 
                            className="px-5  py-2.5 sticky left-0 z-10 bg-white/95 dark:bg-zinc-955/95 border-r border-(--color-border-subtle) dark:border-zinc-800/50 group-hover:bg-zinc-50/95 dark:group-hover:bg-zinc-900/95 transition-colors duration-500 ease-out"
                            style={{ borderRightColor: "var(--color-border-subtle)" }}
                          >
                            <div className="flex items-center gap-3">
                              {/* Resource Icon */}
                              <div className="flex shrink-0 items-center justify-center w-7 h-7 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm transition-colors duration-500 ease-out">
                                <ResourceIcon className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-[12px] font-bold text-zinc-850 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors duration-500 ease-out">
                                {row.resourceLabel}
                              </span>
                            </div>
                          </td>
                          
                          {/* Full Access Toggle (AppCheckbox style) */}
                          <td 
                            className="px-3 module-table-section py-2.5 text-center border-r border-(--color-border-subtle) dark:border-zinc-800/50"
                            style={{ borderRightColor: "var(--color-border-subtle)" }}
                          >
                            <div className="flex w-full items-center justify-center">
                              <AppCheckbox
                                name={`row-full-${row.id}`}
                                isSelected={isRowAllSelected}
                                isIndeterminate={isRowIndeterminate}
                                disabled={readOnly}
                                onChange={() => onToggleRow?.(row)}
                              />
                            </div>
                          </td>
                          
                          {/* Permissions Checkboxes */}
                          {columns.map(col => {
                            const perm = row.actions[col.key];
                            return (
                              <td 
                                key={col.key} 
                                className="px-3 module-table-section py-2.5 text-center relative group/cell hover:bg-zinc-100/40 dark:hover:bg-zinc-800/40 transition-colors duration-500 ease-out"
                              >
                                {perm ? (
                                  <div className="flex w-full items-center justify-center">
                                    <AppCheckbox
                                      name={perm.id}
                                      isSelected={selectedSet.has(perm.id)}
                                      onChange={() => onTogglePermission?.(perm.id)}
                                      disabled={readOnly}
                                    />
                                  </div>
                                ) : (
                                  <span className="text-zinc-300 dark:text-zinc-700 font-bold">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}