"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { PenSquare,CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Course {
    id: string;
    className: string;
    category: string;
    instructor: string;
    date: Date;
    duration: number;
    price: number;
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const editSchema = z.object({
    id: z.coerce.number(),
    className: z.string().min(1, { message: "Class Name Required" }),
    category: z.string().min(1, { message: "Category Required" }),
    instructor: z.string().min(1, { message: "Instructor Required" }),
    date: z.date(),
    duration: z.coerce.number(),
    price: z.coerce.number(),
});

export default function ViewCourse({ course }: { course: Course }) {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const form = useForm<Course>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            id: course.id,
            className: course.className,
            category: course.category,
            instructor: course.instructor,
            date: course.date,
            duration: course.duration,
            price: course.price,
        },
    });

    async function onSubmit(data: Course) {
        console.log(data);
        const { error } = await supabase.from("kelas_latihan").update(data).match({ id: data.id });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Class Updated");
            router.refresh();
        }
    }

    return (
      <Dialog>
        <DialogTrigger>
          <Button className="bg-blue-500">
            <PenSquare />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit Class Details</DialogTitle>
          <div className="grid grid-cols-2 gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-3">
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name</FormLabel>
                      <FormControl>
                        <input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={course.category}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={course.category} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="pilates">Pilates</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="cycling">Cycling</SelectItem>
                          <SelectItem value="bootcamp">Bootcamp</SelectItem>
                          <SelectItem value="zumba">Zumba</SelectItem>
                          <SelectItem value="kickboxing">Kickboxing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor</FormLabel>
                      <FormControl>
                        <input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* DATE */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reselect Date</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger>
                            <Button type="button">
                                <CalendarIcon />
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="bg-green-500">
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    );
}