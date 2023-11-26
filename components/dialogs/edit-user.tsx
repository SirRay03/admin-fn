import { z } from "zod";
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
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

type EditProps = {
  user: User;
};

const editSchema = z.object({
    id: z.string(),
    email: z
    .string()
    .min(1, { message: "Email is Required" })
    .email({ message: "Must be a valid Email" }),
  metadata: z.object({
    name: z.string().min(1, { message: "Full Name Required" }),
    age: z.coerce.number(),
    phoneNumber: z.string().min(1, { message: "Phone Number Required" }),
    medicalHistory: z.string().optional(),
  }),
  isActive: z.boolean(),
  activeUntil: z.string().nullable(),
});

export default function EditDialog({ user }: EditProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  const form = useForm<User>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: user.id,
      email: user.email ?? '',
      metadata: {
        name: user.metadata.name,
        age: user.metadata.age,
        phoneNumber: user.metadata.phoneNumber,
        medicalHistory: user.metadata.medicalHistory ?? '',
      },
      isActive: user.isActive,
      activeUntil: user.activeUntil ?? '',
    },
  });

  async function onSubmit(values: User) {
    console.log(values);
    const name = values.metadata.name;
    const age = values.metadata.age;
    const phoneNumber = values.metadata.phoneNumber;
    const medicalHistory = values.metadata.medicalHistory;
    const { error } = await supabase.from("users").update({metadata:{
      name: name,
      age: age,
      phoneNumber: phoneNumber,
      medicalHistory: medicalHistory,}
    }).eq('id', values.id);
    if (error) {
      toast.error(error.message, { theme: "colored" });
      return;
    }
    toast.success("User Updated", { theme: "colored" });
    router.refresh();
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Edit User Details</DialogTitle>
      </DialogHeader>
      <div class_name="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} class_name="grid gap-3">
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
              name="metadata.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Include other form fields as per the User schema */}
            {/* Ensure the names used in FormField match the structure in User */}
            <Button type="submit" class_name="mt-2 w-full">
              Update Details
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
