import * as yup from "yup";

export const loginSchema = yup.object(
{
    email: yup.string().email("Email is invalid").required(),
    password: yup.string().min(6).max(30).required(),
}).required();

export type LoginType = yup.InferType<typeof loginSchema>;