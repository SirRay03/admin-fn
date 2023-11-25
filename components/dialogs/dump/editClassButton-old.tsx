"use client";
import React, { useState, useEffect } from "react";
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
  FormDescription,
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
import { CalendarIcon, PenSquare } from "lucide-react";
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

export default function EditClassBtn({ item }: { item: ClassType }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const form = useForm<ClassType>({
    resolver: zodResolver(classSchema),
  });

  const onSubmit = async (values: ClassType) => {
    console.log(values);
    setLoading(true);
    const uniquePath = Date.now() + "_" + generateRandomNumber();
    if (selectedImage) {
      const { data: imgData, error: imgErr } = await supabase.storage
        .from(Env.S3_BUCKET)
        .upload(uniquePath, selectedImage);
      if (imgErr) {
        toast.error(imgErr.message, { theme: "colored" });
        setLoading(false);
        return;
      }
    }
    const { error } = await supabase
      .from("kelas_latihan")
      .update(values)
      .eq("id", values.id);
    if (error) {
      toast.error(error.message, { theme: "colored" });
      return;
    }
    setOpen(false);
    toast.success("Class updated successfully", { theme: "colored" });
    router.refresh();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button className="bg-blue-600" onClick={() => setOpen(true)}>
          <PenSquare />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle asChild>
            <div className="flex justify-between items-cener">
              <span>Manage Class</span>
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
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Id</FormLabel>
                        <FormControl>
                          <Input defaultValue={item.id} {...field} disabled />
                          {/* <input defaultValue={item.id} disabled /> */}
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
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input defaultValue={item.className} {...field} />
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
                          <Input defaultValue={item.quota} {...field} />
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
                          defaultValue={item.category}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue defaultValue={item.category} />
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
                          <Input defaultValue={item.instructor} {...field} />
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
                                  <span>{String(item.date)}</span>
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
                          <Input defaultValue={item.duration} {...field} />
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
                          <Input defaultValue={item.price} {...field} />
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
                                setSelectedImage(e.target.files?.[0] || null);
                              }}
                              ref={field.ref}
                            />
                            <label
                              htmlFor="fileInput"
                              className="hover:bg-gray-400 text-neutral-90  rounded-md cursor-pointer inline-flex items-center">
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
                </div>
                <div className="mt-5">
                  <Button className="bg-red-800 w-full mt-5" disabled={loading}>
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
}
