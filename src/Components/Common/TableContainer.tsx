import React, { Fragment, useEffect, useRef, useState } from "react";
import { Row, Table, Button, Col } from "reactstrap";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";
import { Tooltip } from "react-tooltip";

// ----------------------
// Debounced Input
// ----------------------
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number;
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);
  const firstRun = useRef(true);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      onChange(String(value));
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return <input {...props} value={value} onChange={e => setValue(e.target.value)} />;
};

// ----------------------
// Props
// ----------------------
export interface TableContainerProps<T> {
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;

  columns: ColumnDef<T, any>[];
  data: T[];

  isRowClickable?: boolean;
  onRowClick?: (row: T) => void;

  isServerSidePagination?: boolean;
  onServerChange?: (query: any) => void;

  serverSideTotalRecords?: number;
  serverSideCurrentPage?: number;
  serverSidePageSize?: number;
  serverSideTotalPages?: number;
  serverSideSearchTerm?: string;

  isGlobalFilter?: boolean;
  isPagination?: boolean;
  isCustomPageSize?: boolean;

  buttonName?: string;
  buttonClass?: string;
  isAddButton?: boolean;
  handleUserClick?: () => void;

  // Custom center element (e.g. Projected Hours Badge)
  customCenterHeader?: React.ReactNode;
  // Custom right element (e.g. Status Filter)
  customRightHeader?: React.ReactNode;

  // CSS class customization
  tableClass?: string;
  theadClass?: string;
  paginationWrapper?: string;
  pagination?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

// ----------------------
// Component
// ----------------------
const TableContainer = <T,>({
  headerStyle,
  rowStyle,

  columns,
  data,

  isRowClickable = false,
  onRowClick,

  isServerSidePagination = false,
  onServerChange,

  serverSideTotalRecords = 0,
  serverSideCurrentPage = 1,
  serverSidePageSize = 10,
  serverSideTotalPages = 0,
  serverSideSearchTerm = "",

  isGlobalFilter = true,
  isPagination = true,
  isCustomPageSize = true,

  buttonName,
  buttonClass,
  isAddButton,
  handleUserClick,

  customCenterHeader,
  customRightHeader,

  tableClass = "",
  theadClass = "table-light",
  paginationWrapper = "",
  pagination = "pagination justify-content-end pagination-sm",
  searchPlaceholder = "Search...",
  isLoading = false,
  emptyMessage = "No data available",
}: TableContainerProps<T>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // local page state
  const [localPage, setLocalPage] = useState(serverSideCurrentPage);

  // Default Fonts for Header and Row
  const defaultHeaderStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 700,
  };

  const defaultRowStyle: React.CSSProperties = {
    fontSize: "13px",
  };

  const mergedHeaderStyle = {
    ...defaultHeaderStyle,
    ...headerStyle,
  };

  const mergedRowStyle = {
    ...defaultRowStyle,
    ...rowStyle,
  };

  useEffect(() => {
    setLocalPage(serverSideCurrentPage);
  }, [serverSideCurrentPage]);

  // Sync search term from parent when it changes
  useEffect(() => {
    setGlobalFilter(serverSideSearchTerm);
  }, [serverSideSearchTerm]);

  // ----------------------
  // Fuzzy Filter
  // ----------------------
  const fuzzyFilter = (row: any, columnId: string, value: string, addMeta: any) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  // ----------------------
  // Build Server Query
  // ----------------------
  const buildQuery = (override: any = {}) => ({
    page: localPage,
    pageSize: serverSidePageSize,
    search: globalFilter,
    filters: columnFilters,
    sorting,
    ...override,
  });

  // ----------------------
  // Table
  // ----------------------
  const table = useReactTable({
    columns,
    data,

    state: {
      columnFilters,
      globalFilter,
      sorting,
      ...(isServerSidePagination && {
        pagination: {
          pageIndex: localPage - 1,
          pageSize: serverSidePageSize,
        },
      }),
    },

    manualPagination: isServerSidePagination,
    manualFiltering: isServerSidePagination,
    manualSorting: isServerSidePagination,

    pageCount: isServerSidePagination ? serverSideTotalPages : undefined,

    onColumnFiltersChange: filters => {
      setColumnFilters(filters);
      if (isServerSidePagination) {
        setLocalPage(1);
        onServerChange?.(buildQuery({ filters, page: 1 }));
      }
    },

    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: sort => {
      setSorting(sort);
      if (isServerSidePagination) {
        setLocalPage(1);
        onServerChange?.(buildQuery({ sorting: sort, page: 1 }));
      }
    },

    globalFilterFn: isServerSidePagination ? undefined : fuzzyFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: isServerSidePagination ? undefined : getFilteredRowModel(),
    getPaginationRowModel: isServerSidePagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: isServerSidePagination ? undefined : getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getState,
    setPageIndex,
    nextPage,
    previousPage,
    getCanNextPage,
    getCanPreviousPage,
    getPageOptions,
  } = table;

  // ----------------------
  // Page Size Change
  // ----------------------
  const handlePageSizeChange = (size: number) => {
    if (isServerSidePagination) {
      setLocalPage(1);
      onServerChange?.(buildQuery({ page: 1, pageSize: size }));
    } else {
      table.setPageSize(size);
    }
  };

  // ----------------------
  // Visible Pages (max 5)
  // ----------------------
  const getVisiblePages = () => {
    const current = isServerSidePagination ? localPage : getState().pagination.pageIndex + 1;
    const total = isServerSidePagination ? (serverSideTotalPages || 1) : (getPageOptions().length || 1);

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // ----------------------
  // Render
  // ----------------------
  return (
    <Fragment>
      {/* Top Add Button Row */}
      {isAddButton && (
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Button
            className={buttonClass || "btn btn-primary"}
            onClick={handleUserClick}
            data-tooltip-id="addbtn"
          >
            {buttonName || "+ Add New"}
          </Button>
          <Tooltip id="addbtn" content={buttonName || "+ Add New"} />
        </div>
      )}

      {/* Header - Search, Center Component (Projected Hours), Filter */}
      {(isGlobalFilter || customCenterHeader || customRightHeader) && (
        <div className="task-controls-row mb-3">
          {/* Search Input - Left */}
          <div className="task-controls-left">
            {isGlobalFilter && (
              <div className="task-search-wrapper">
                <label htmlFor="tableSearchInput">
                  Search:
                </label>
                <DebouncedInput
                  id="tableSearchInput"
                  value={globalFilter}
                  onChange={val => {
                    setGlobalFilter(val);

                    if (isServerSidePagination) {
                      setLocalPage(1);
                      onServerChange?.(buildQuery({ search: val, page: 1 }));
                    }
                  }}
                  className="task-search-input"
                  placeholder={searchPlaceholder}
                />
              </div>
            )}
          </div>

          {/* Custom Center Element (e.g., Red Projected Hours Badge) */}
          <div className="task-controls-center">
            {customCenterHeader}
          </div>

          {/* Custom Right Element (e.g., Status Filter dropdown) */}
          <div className="task-controls-right">
            {customRightHeader}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="tracker-task-table-wrap table-responsive" style={{ overflowY: "visible" }}>
        <Table hover className={`tracker-task-table ${tableClass}`}>
          <thead>
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className={theadClass}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} style={mergedHeaderStyle}>
                    <div onClick={header.column.getToggleSortingHandler()} style={{ cursor: "pointer" }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>

                    {!isServerSidePagination && header.column.getCanFilter() && (
                      <input
                        className="form-control form-control-sm mt-1"
                        value={(header.column.getFilterValue() ?? "") as string}
                        onChange={e => header.column.setFilterValue(e.target.value)}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={table.getAllLeafColumns().length} className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary me-2" />
                  <span className="text-muted">Loading data...</span>
                </td>
              </tr>
            ) : getRowModel().rows.length > 0 ? (
              getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  onClick={e => {
                    if (!isRowClickable) return;
                    const target = e.target as HTMLElement;
                    if (target.closest("button, a, input, select, textarea")) return;
                    onRowClick?.(row.original);
                  }}
                  style={{
                    cursor: isRowClickable ? "pointer" : "default",
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={mergedRowStyle}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllLeafColumns().length} className="text-center py-4 text-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {isPagination && (
        <Row className="mt-2 align-items-center">
          {/* Left: Entries Info */}
          <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
            {(serverSideTotalRecords > 0 || data.length > 0) && (
              <small className="text-muted">
                {isServerSidePagination ? (
                  <>
                    Showing{" "}
                    {Math.min(
                      (serverSideCurrentPage - 1) * serverSidePageSize + 1,
                      serverSideTotalRecords
                    )}{" "}
                    to{" "}
                    {Math.min(
                      serverSideCurrentPage * serverSidePageSize,
                      serverSideTotalRecords
                    )}{" "}
                    of {serverSideTotalRecords} entries
                  </>
                ) : (
                  <>
                    Showing{" "}
                    {Math.min(
                      getState().pagination.pageIndex * getState().pagination.pageSize + 1,
                      data.length
                    )}{" "}
                    to{" "}
                    {Math.min(
                      (getState().pagination.pageIndex + 1) * getState().pagination.pageSize,
                      data.length
                    )}{" "}
                    of {data.length} entries
                  </>
                )}
              </small>
            )}
          </Col>

          {/* Middle: Rows selector */}
          {isCustomPageSize && (
            <Col xs={12} md={4} className="text-center justify-content-center mb-2 mb-md-0">
              <div className="d-inline-flex align-items-center gap-2">
                <span className="small text-muted">Rows:</span>
                <select
                  value={isServerSidePagination ? serverSidePageSize : getState().pagination.pageSize}
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                  className="form-select form-select-sm"
                  style={{ width: "100px" }}
                >
                  {[10, 20, 30, 50, 100].map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          )}

          {/* Right: Pagination */}
          <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
            <div className={paginationWrapper}>
              <ul className={`pagination mb-0 ${pagination}`}>
                {/* Prev */}
                <li className={`page-item ${isServerSidePagination ? (localPage <= 1 ? "disabled" : "") : (!getCanPreviousPage() ? "disabled" : "")}`}>
                  <button
                    className="page-link"
                    disabled={isServerSidePagination ? localPage <= 1 : !getCanPreviousPage()}
                    onClick={() => {
                      if (isServerSidePagination) {
                        const prev = localPage - 1;
                        setLocalPage(prev);
                        onServerChange?.(buildQuery({ page: prev }));
                      } else {
                        previousPage();
                      }
                    }}
                  >
                    &laquo;
                  </button>
                </li>

                {/* Pages */}
                {getVisiblePages().map(page => {
                  const current = isServerSidePagination ? localPage : getState().pagination.pageIndex + 1;

                  return (
                    <li key={page} className={`page-item ${current === page ? "active" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => {
                          if (isServerSidePagination) {
                            setLocalPage(page);
                            onServerChange?.(buildQuery({ page }));
                          } else {
                            setPageIndex(page - 1);
                          }
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}

                {/* Next */}
                <li className={`page-item ${isServerSidePagination ? (localPage >= (serverSideTotalPages || 1) ? "disabled" : "") : (!getCanNextPage() ? "disabled" : "")}`}>
                  <button
                    className="page-link"
                    disabled={
                      isServerSidePagination
                        ? localPage >= (serverSideTotalPages || 1)
                        : !getCanNextPage()
                    }
                    onClick={() => {
                      if (isServerSidePagination) {
                        const next = localPage + 1;
                        setLocalPage(next);
                        onServerChange?.(buildQuery({ page: next }));
                      } else {
                        nextPage();
                      }
                    }}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default TableContainer;
