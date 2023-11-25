"use client";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
  
  type DeleteProps = {
    id: string;
    isOpen: boolean;
    showActionToggle: (open: boolean) => void;
  };
  
  export default function DeleteUser({
    id,
    isOpen,
    showActionToggle,
  }: DeleteProps) {
    const router = useRouter()
    const supabase = createClientComponentClient();
    const deleteUser = async () => {
        const {error} = await supabase.from("users").delete().eq('id', id);
        if(error) {
            toast.error(error.message, { theme: "colored" });
            return;
        }
        router.refresh()
        showActionToggle(false)
        toast.error('Pengguna berhasil dihapus', { theme: "colored" })
    }

    return (
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin ingin menghapus pengguna ini?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batalkan</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={() => {
                deleteUser();
              }}
            >
              Hapus Pengguna
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }