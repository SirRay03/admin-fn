import { z } from "zod";

export const userSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3).max(50),
    phoneNumber: z.string().min(10).max(13),
    medicalHistory: z.string().max(50),
    age: z.number(),
    email: z.string().email(),
    isActive: z.boolean(),
});
export type UserType = z.infer<typeof userSchema>;
