import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import DeleteUser from "@/components/dialogs/delete-user";
import ViewUser from "@/components/dialogs/view-user";
import EditUser from "@/components/dialogs/edit-user";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface User {
  id: string;
  created_at: string;
  email: string | null;
  metadata: {
    name: string;
    age: number;
    phoneNumber: string;
    medicalHistory: string;
  };
  isActive: boolean;
  activeUntil: string | null;
}

export function UserRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const user = row.original as User;
  const handleViewClick = () => {
    console.log(user)
    setDialogContent(<ViewUser user={user} />);
  };

   const handleEditClick = () => {
     setDialogContent(<EditUser user={user} />);
   };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class_name="h-8 w-8 p-0">
            <span class_name="sr-only">Open menu</span>
            <MoreHorizontal class_name="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild onClick={handleViewClick}>
            <DropdownMenuItem>
              {" "}
              <Icons.view class_name="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
           <DialogTrigger asChild onClick={handleEditClick}>
            <DropdownMenuItem>
              <Icons.edit class_name="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            class_name="text-red-600">
            <Icons.delete class_name="mr-2 h-4 w-4" />
            Delete Details
          </DropdownMenuItem> 
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteUser
        id={user.id}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />
    </Dialog>
  );
}