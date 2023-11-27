"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Transaction = {
  id: string
  nominal: number
  jenisBayar: "Membership" | "Class"
  users: {
    email: string
  }
  created_at: EpochTimeStamp
}

const checkTransaction = (jenisBayar:string) => {
  if (jenisBayar === "Membership") {
        return (
          <span className="px-2 inline-flex justify-center text-base p-2 w-full rounded-sm text-center leading-5 font-semibold bg-red-600 text-white">
            Membership
          </span>
        );

  } else {
    return (
      <span className="px-2 inline-flex justify-center text-base p-2 w-full rounded-sm text-center leading-5 font-semibold bg-black text-white">
        Class
      </span>
    );
  }
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Transaction Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        // date and time
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {date.toLocaleDateString("id-ID")}{" "}
          {date.toLocaleTimeString("id-ID")}
        </div>
      );
    }
  },
  {
    accessorKey: "id",
    header: "ID Pembayaran",
  },
  {
    accessorKey: "users.email",
    header: "Email Pembayar",
  },
  {
    accessorKey: "jenisBayar",
    header: "Jenis Pembayaran",
    cell: ({ row }) => checkTransaction(row.original.jenisBayar),
  },

  {
    accessorKey: "nominal",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("nominal"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
