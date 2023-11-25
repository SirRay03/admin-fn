"use client";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserType } from "@/validations/UserValidation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function ViewDialog({ user }: { user: User }) {
  return (
    console.log(user),
    <DialogHeader>
      <DialogTitle>View User Details</DialogTitle>
      <DialogDescription className="py-4">
        <Table className="border-2">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          {/* Display the data and metadata according to UserType */}
            <TableBody>
                <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{user.metadata.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Age</TableCell>
                <TableCell>{user.metadata.age}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>{user.email}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Phone Number</TableCell>
                <TableCell>{user.metadata.phoneNumber}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Medical History</TableCell>
                <TableCell>{user.metadata.medicalHistory}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Active</TableCell>
                <TableCell>{user.isActive}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Active Until</TableCell>
                <TableCell>{user.activeUntil}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
      </DialogDescription>
    </DialogHeader>
  );
}
