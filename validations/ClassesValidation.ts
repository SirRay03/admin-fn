import * as z from "zod";
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

export const classSchema = z.object({
  id: z.number().optional(),
  className: z.string().max(30),
  quota: z.coerce.number().max(100),
  category: z.string().max(20),
  instructor: z.string().max(30),
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

export type ClassType = z.infer<typeof classSchema>;