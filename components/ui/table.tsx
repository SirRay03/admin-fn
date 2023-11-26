import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ class_name, ...props }, ref) => (
  <div class_name="relative w-full overflow-auto">
    <table
      ref={ref}
      class_name={cn("w-full caption-bottom text-sm", class_name)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ class_name, ...props }, ref) => (
  <thead ref={ref} class_name={cn("[&_tr]:border-b", class_name)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ class_name, ...props }, ref) => (
  <tbody
    ref={ref}
    class_name={cn("[&_tr:last-child]:border-0", class_name)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ class_name, ...props }, ref) => (
  <tfoot
    ref={ref}
    class_name={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      class_name
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ class_name, ...props }, ref) => (
  <tr
    ref={ref}
    class_name={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      class_name
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ class_name, ...props }, ref) => (
  <th
    ref={ref}
    class_name={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      class_name
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ class_name, ...props }, ref) => (
  <td
    ref={ref}
    class_name={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", class_name)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ class_name, ...props }, ref) => (
  <caption
    ref={ref}
    class_name={cn("mt-4 text-sm text-muted-foreground", class_name)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
