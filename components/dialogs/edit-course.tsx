"use client";
import {
  Dialog,
  DialogContent,
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
    quota: number;
    category: string;
    instructor: string;
    date: Date;
    duration: number;
    price: number;
    image: File;
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, generateRandomNumber } from "@/lib/utils";
import Env from "@/config/Env";
import { useState } from "react";
import { Input } from "../ui/input";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const editSchema = z.object({
  id: z.coerce.number(),
  className: z.string().min(1, { message: "Class Name Required" }),
  quota: z.coerce.number(),
  category: z.string().min(1, { message: "Category Required" }),
  instructor: z.string().min(1, { message: "Instructor Required" }),
  date: z.date(),
  duration: z.coerce.number(),
  price: z.coerce.number(),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

function addSevenHours(date: Date) {
  date.setHours(date.getHours() + 7);
  return date;
}

export default function ViewCourse({ course }: { course: Course }) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const form = useForm<Course>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            id: course.id,
            className: course.className,
            quota: course.quota,
            category: course.category,
            instructor: course.instructor,
            date: new Date(course.date),
            duration: course.duration,
            price: course.price,
            image: course.image,
        },
    });

    async function onSubmit(data: Course) {
        console.log(data);
        const uniquePath = Date.now() + "_" + generateRandomNumber();
        const { data: imgData, error: imgErr } = await supabase.storage
          .from(Env.S3_BUCKET)
          .upload(uniquePath, selectedImage!);
        if (imgErr) {
          toast.error(imgErr.message, { theme: "colored" });
          return;
        }
        if (data.date.getTime != course.date.getTime) {
            data.date = addSevenHours(data.date);
        }
        const { error } = await supabase.from("kelas_latihan").update({
            className: data.className,
            quota: data.quota,
            category: data.category,
            instructor: data.instructor,
            date: data.date,
            duration: data.duration,
            price: data.price,
            image: imgData?.path,
        
        }).match({ id: data.id });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Class Updated");
        }
        router.refresh();
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quota</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              type="button">
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Select Date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
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
                        <Input type="number" {...field} />
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
                      <FormLabel>Price (in Rupiahs)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Button
                          size="lg"
                          type="button"
                          variant="outline"
                          className="w-full">
                          <input
                            type="file"
                            className="hidden"
                            id="fileInput"
                            onBlur={field.onBlur}
                            name={field.name}
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              setSelectedImage(e.target.files?.[0] || null);
                            }}
                            ref={field.ref}
                          />
                          <label htmlFor="fileInput">
                            <span className="whitespace-nowrap">
                              Choose your image
                            </span>
                          </label>
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-red-800 w-full mt-5">
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
}