"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserRowActions } from "./users-row-actions"
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const checkIsActive = (isActive: boolean) => {
  if (isActive) {
    return (
      <div className="flex items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>{" "}
        Active
      </div>
    );
  } else {
    return (
      <div className="flex items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>{" "}
        Inactive
      </div>
    );
  }
};

type User = {
  id: string
  created_at: EpochTimeStamp
  metadata: {
    name: string
  }
  email: string
  isActive: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Account Creation Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className="flex items-center">
          {date.toLocaleDateString("id-ID")} {date.toLocaleTimeString("en-US")}
        </div>
      );
    },
  },
  {
    accessorKey: "metadata.name",
    header: "Nama Akun",
  },
  {
    accessorKey: "email",
    header: "Email Akun",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => checkIsActive(row.original.isActive),
  },
  {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: ({ row }) => <UserRowActions row={row} />,
  },
];
