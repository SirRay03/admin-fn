"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { classSchema, ClassType } from "@/validations/ClassesValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn, generateRandomNumber } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Env from "@/config/Env";
import { X } from "lucide-react";

export const AddCourse = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const form = useForm<ClassType>({
    resolver: zodResolver(classSchema),
  });

  function addSevenHours(date: Date) {
    date.setHours(date.getHours() + 7);
    return date;
  }

  const onSubmit = async (values: ClassType) => {
    console.log(values);
    setLoading(true);
    const uniquePath = Date.now() + "_" + generateRandomNumber();
    const { data: imgData, error: imgErr } = await supabase.storage
      .from(Env.S3_BUCKET)
      .upload(uniquePath, selectedImage!);
    if (imgErr) {
      toast.error(imgErr.message, { theme: "colored" });
      setLoading(false);
      return;
    }

    // * Store class
    const { error: homeErr } = await supabase.from("kelas_latihan").insert({
      class_name: values.class_name,
      quota: values.quota,
      category: values.category,
      instructor: values.instructor,
      date: addSevenHours(values.date),
      /* time: values.time, */
      duration: values.duration,
      price: values.price,
      image: imgData?.path,
    });

    if (homeErr) {
      toast.error(homeErr.message, { theme: "colored" });
      setLoading(false);
      return;
    }

    router.refresh();
    setOpen(false);
    toast.success("Class added successfully", { theme: "colored" });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <li
          className=" w-full hover:bg-red-800 rounded-md p-2 cursor-pointer border bg-red-700 text-white hover:text-white text-center"
          onClick={() => setOpen(true)}>
          Add New Course
        </li>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle asChild>
            <div className="flex justify-between items-cener">
              <span>Add Course</span>
              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="class_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Gerak Sehat Bersama"
                              {...field}
                            />
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
                            <Input placeholder="40" {...field} />
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
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the course category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yoga">Yoga</SelectItem>
                              <SelectItem value="pilates">Pilates</SelectItem>
                              <SelectItem value="hiit">HIIT</SelectItem>
                              <SelectItem value="cycling">Cycling</SelectItem>
                              <SelectItem value="bootcamp">Bootcamp</SelectItem>
                              <SelectItem value="zumba">Zumba</SelectItem>
                              <SelectItem value="kickboxing">
                                Kickboxing
                              </SelectItem>
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
                            <Input placeholder="Jeon Somi" {...field} />
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
                          <FormLabel>Course Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start">
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
                          <FormLabel>Duration (in minutes)</FormLabel>
                          <FormControl>
                            <Input placeholder="60" {...field} />
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
                            <Input placeholder="50000" {...field} />
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
                              className="w-full"
                              variant="outline">
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
                              <label
                                htmlFor="fileInput">
                                <span className="whitespace-nowrap">
                                  choose your image
                                </span>
                              </label>
                            </Button>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                </div>
                <div className="mt-5">
                  <Button className="bg-green-500 w-full mt-5" disabled={loading}>
                    {loading ? "loading" : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};