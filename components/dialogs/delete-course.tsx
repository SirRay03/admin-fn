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
        const {error:notifError} = await supabase.rpc('notify_class_deletion', {deleted_class_id: id})
        const {error} = await supabase.from("kelas_latihan").delete().eq('id', id);
        if(error) {
            toast.error(error.message, { theme: "colored" });
            return;
        }
        router.refresh()
        toast.error("Kelas telah dihapus!", { theme: "colored" });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='bg-red-800'><Trash2 /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Course</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Are you sure you want to delete this course? This action cannot be undone
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-800' onClick={deleteCourse}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
  