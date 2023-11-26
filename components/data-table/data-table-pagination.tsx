import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div class_name="flex items-center justify-between px-2 space-y-4">
      <div class_name="flex-1 text-sm text-muted-foreground">
      </div>
      <div class_name="flex items-center space-x-6 lg:space-x-8">
        <div class_name="flex items-center space-x-2">
          <p class_name="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}>
            <SelectTrigger class_name="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div class_name="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div class_name="flex items-center space-x-2">
          <Button
            variant="outline"
            class_name="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <span class_name="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon class_name="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class_name="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <span class_name="sr-only">Go to previous page</span>
            <ChevronLeftIcon class_name="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class_name="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <span class_name="sr-only">Go to next page</span>
            <ChevronRightIcon class_name="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            class_name="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            <span class_name="sr-only">Go to last page</span>
            <DoubleArrowRightIcon class_name="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}