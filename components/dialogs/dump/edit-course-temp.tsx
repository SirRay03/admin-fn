import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn, generateRandomNumber } from "@/lib/utils";
import Env from "@/config/Env";
import { CalendarIcon, PenSquare } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface Course {
  id: string;
  className: string;
  quota: number;
  category: string;
  instructor: string;
  date: Date;
  duration: number;
  price: number;
  image: any;
}

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

type EditProps = {
  course: Course;
};

const editSchema = z.object({
  id: z.string(),
  className: z.string().min(1, { message: "Class Name Required" }),
  quota: z.coerce.number(),
  category: z.string().min(1, { message: "Category Required" }),
  instructor: z.string().min(1, { message: "Instructor Required" }),
  date: z.string().min(1, { message: "Date Required" }),
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

export default function EditCourse({ course }: EditProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const form = useForm<Course>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: course.id,
      className: course.className,
      quota: course.quota,
      category: course.category,
      instructor: course.instructor,
      date: course.date,
      duration: course.duration,
      price: course.price,
      image: course.image,
    },
  });

  async function onSubmit(values: Course) {
    console.log(values);

    const className = values.className;
    const quota = values.quota;
    const category = values.category;
    const instructor = values.instructor;
    const date = values.date;
    const duration = values.duration;
    const price = values.price;
    const image = values.image;

    const uniquePath = Date.now() + "_" + generateRandomNumber();
    const { data: imgData, error: imgErr } = await supabase.storage
      .from(Env.S3_BUCKET)
      .upload(uniquePath, image);
    if (imgErr) {
      toast.error(imgErr.message, { theme: "colored" });
      return;
    }
    const { error } = await supabase
      .from("kelas_latihan")
      .update({
        className,
        quota,
        category,
        instructor,
        date,
        duration,
        price,
        image,
      })
      .eq("id", values.id);
    if (error) {
      toast.error(error.message, { theme: "colored" });
      return;
    }
    toast.success("Class updated successfully", { theme: "colored" });
    router.refresh();
  }

  return (
    <div>
      <DialogHeader>
        <DialogTrigger asChild>
          <Button className="bg-blue-600">
            <PenSquare />
          </Button>
        </DialogTrigger>
        <DialogTitle>Edit Course Details</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
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
                    <Input type="Number" {...field} />
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
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
                  <FormLabel>Duration (in minutes)</FormLabel>
                  <FormControl>
                    <Input type="Number" {...field} />
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
                  <FormLabel>Price (in rupiahs)</FormLabel>
                  <FormControl>
                    <Input type="Number" {...field} />
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
                      className="bg-gray-200 text-gray-500 w-full">
                      <input
                        type="file"
                        className="hidden"
                        id="fileInput"
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                        ref={field.ref}
                      />
                      <label
                        htmlFor="fileInput"
                        className="text-neutral-90  rounded-md cursor-pointer inline-flex items-center">
                        <span className="whitespace-nowrap">
                          Reupload your image
                        </span>
                      </label>
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2 w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
