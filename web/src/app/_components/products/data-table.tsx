"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchInput } from "./search-input"
import { ActiveFilters } from "./active-filters"
import { CategoryFilterIndicator } from "./category-filter-indicator"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Server-side pagination props
  pageCount?: number
  currentPage?: number
  totalPages?: number
  hasNext?: boolean
  hasPrev?: boolean
  total?: number
  onPageChange?: (page: number) => void
  onSearchChange?: (search: string) => void
  isLoading?: boolean
  isCategoryFilterPending?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 0,
  currentPage = 1,
  totalPages = 0,
  hasNext = false,
  hasPrev = false,
  total = 0,
  onPageChange,
  onSearchChange,
  isLoading = false,
  isCategoryFilterPending = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: currentPage - 1,
    pageSize: 10,
  })
  
  // Local state for search value to display in active filters
  const [searchValue, setSearchValue] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // Server-side pagination
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
  })

  // Handle page changes
  const handlePreviousPage = React.useCallback(() => {
    if (hasPrev && onPageChange) {
      onPageChange(currentPage - 1)
    }
  }, [hasPrev, onPageChange, currentPage])

  const handleNextPage = React.useCallback(() => {
    if (hasNext && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }, [hasNext, onPageChange, currentPage])

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center py-4">
        <SearchInput
          onSearchChange={onSearchChange || (() => {})}
          onSearchValueChange={setSearchValue}
          isLoading={isLoading}
        />
        
        <CategoryFilterIndicator isCategoryFilterPending={isCategoryFilterPending} />
        
        <ActiveFilters 
          searchValue={searchValue}
          isCategoryFilterPending={isCategoryFilterPending}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" disabled={isLoading}>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "name" && "Name"}
                    {column.id === "description" && "Description"}
                    {column.id === "price" && "Price"}
                    {column.id === "categoryIds" && "Categories"}
                    {column.id === "actions" && "Actions"}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500">No products found.</p>
                    {isCategoryFilterPending && (
                      <p className="text-sm text-blue-600">Applying category filters...</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({total} total products)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!hasPrev || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasNext || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 