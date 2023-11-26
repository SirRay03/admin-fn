import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { ClassType } from "@/validations/ClassesValidation";


export default function ViewCourse({ course }: { course: ClassType }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button class_name="bg-teal-600">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Class Details</DialogTitle>
          <DialogDescription class_name="py-4">
            <Table class_name="border-2">
            <TableHeader class_name="bg-muted">
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{course.class_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>{course.category}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Instructor</TableCell>
                <TableCell>{course.instructor}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>{String(course.date)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Duration</TableCell>
                <TableCell>{course.duration}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quota</TableCell>
                <TableCell>{course.quota}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price</TableCell>
                <TableCell>{course.price}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}