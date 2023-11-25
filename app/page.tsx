"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginType, loginSchema } from '@/validations/LoginValidation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Login() {
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const onSubmit = async (payload:LoginType) => {
        setLoading(true);
        const {data, error} = await supabase.auth.signInWithPassword({
            email: payload.email,
            password: payload.password,
        });
        setLoading(false);
        if(error){
            toast.error(error.message,{theme: "colored"});
        } else if (data.user) {
            await supabase.auth.signInWithPassword({
                email: payload.email,
                password: payload.password,
            });
            toast.success("Logged in successfully", { theme: "colored" });
            router.push("/dashboard/users");
        }
    };

    return (
    <div className="container mx-auto py-8">
        <form className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center mb-4">
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={150}
                    height={150}
                    priority = {true}
                />
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
            </label>
            <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-800"
                type="email"
                id="email"
                placeholder="clara@gmail.com"
                {...register("email")}
            />
            <span className="text-red-400">{errors.email?.message}</span>
            </div>
            <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
            >
                Password
            </label>
            <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-800"
                type="password"
                id="password"
                placeholder="********"
                {...register("password")}
            />
            <span className="text-red-400">{errors.password?.message}</span>
            </div>
            <div className="flex items-center justify-between my-5">
            <div className="flex items-start">
                
            </div>
            </div>
            <button
                className="w-full bg-red-800 text-white text-sm font-bold py-3 px-4 rounded-md hover:bg-red-800 transition duration-300"
                type="submit"
                disabled={loading}>{loading ? "Processing" : "Login"}
            </button>
        </form>
    </div>
  );
}