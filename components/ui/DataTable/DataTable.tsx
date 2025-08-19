"use client";

import type React from "react";
import { ChevronUp, ChevronDown, ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (value: T[keyof T], item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<
  T extends Record<string, any> = Record<string, any>
> {
  data: T[];
  columns: TableColumn<T>[];
  sortField?: keyof T;
  sortDirection?: SortDirection;
  onSort?: (field: keyof T) => void;
  onRowClick?: (item: T, index: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  theme?: "light" | "dark";
}

export const DataTable = <T extends Record<string, any> = Record<string, any>>({
  data,
  columns,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
  className,
  rowClassName,
  theme = "dark",
}: DataTableProps<T>) => {
  const getSortIcon = (field: keyof T) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3 h-3 ml-1 text-[#F77A0E]" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1 text-[#F77A0E]" />
    );
  };

  const getAlignmentClass = (align: string = "left") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const themeClasses = {
    light: {
      table: "bg-white",
      header: "bg-gray-50",
      headerText: "text-gray-600",
      row: "hover:bg-gray-50",
      text: "text-gray-900",
    },
    dark: {
      table: "bg-gray-900/50",
      header: "bg-white/5",
      headerText: "text-gray-400",
      row: "hover:bg-[#F77A0E]/10 hover:border-l-4 hover:border-l-[#F77A0E]",
      text: "text-white",
    },
  };

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-white/10",
        className
      )}
    >
      <table className="w-full">
        <thead className={themeClasses[theme].header}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={cn(
                  "px-6 py-4 text-xs font-medium uppercase tracking-wider",
                  getAlignmentClass(column.align),
                  themeClasses[theme].headerText,
                  column.sortable && onSort
                    ? "cursor-pointer transition-colors hover:text-[#F77A0E]"
                    : "",
                  column.className
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div
                  className={cn(
                    "flex items-center",
                    column.align === "right"
                      ? "justify-end"
                      : column.align === "center"
                      ? "justify-center"
                      : "justify-start"
                  )}
                >
                  {column.label}
                  {column.sortable && onSort && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-24 mx-auto"></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className={themeClasses[theme].headerText}>
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-lg font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  "transition-all duration-200 group",
                  themeClasses[theme].row,
                  onRowClick ? "cursor-pointer" : "",
                  typeof rowClassName === "function"
                    ? rowClassName(item, index)
                    : rowClassName
                )}
                onClick={() => onRowClick?.(item, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className={cn(
                      "px-6 py-4 whitespace-nowrap",
                      getAlignmentClass(column.align),
                      themeClasses[theme].text
                    )}
                  >
                    {column.render
                      ? column.render(item[column.key], item, index)
                      : String(item[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
