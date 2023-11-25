"use client";
import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
  
export default function DeleteCourse({id}: {id:number}) {
    const router = useRouter()
    const supabase = createClientComponentClient();

    const deleteCourse = async () => {
        const {error} = await supabase.from("kelas_latihan").delete().eq('id', id);
        if(error) {
            toast.error(error.message, { theme: "colored" });
            return;
        }
        router.refresh()
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Apakah anda yakin ingin menghapus kelas ini?
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batalkan</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-800' onClick={deleteCourse}>Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
  