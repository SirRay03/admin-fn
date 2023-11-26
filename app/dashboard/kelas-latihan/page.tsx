import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AddCourse } from "@/components/dialogs/add-course";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import Image from 'next/image'
import { getImageUrl } from "@/lib/utils";
import DeleteCourse from "@/components/dialogs/delete-course";
import EditCourse from "@/components/dialogs/edit-course";
import ViewCourse from "@/components/dialogs/view-course";


export default async function KelasLatihan(){
    const supabase = createServerComponentClient({cookies})
    const { data:courses,error } = await supabase.from('kelas_latihan').select()
    return (
      <div class_name="container mx-auto py-10">
        <h1 class_name="text-7xl font-bold text-center">Class Dashboard</h1>
  
        <div class_name="flex justify-end mt-5">
          <h1 class_name="text-2xl font-bold">Jumlah Kelas: xxx</h1>
        </div>
        <div class_name="mt-5">
          <Table class_name="w-full">
            <TableHeader>
              <TableRow>
                <TableHead class_name="w-1/4">Class Name</TableHead>
                <TableHead class_name="w-1/6">Date</TableHead>
                <TableHead class_name="w-1/6">Image</TableHead>
                <TableHead class_name="w-1/6">Price</TableHead>
                <TableHead class_name="w-1/6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses &&
                courses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell class_name="w-1/4">{item.class_name}</TableCell>
                    <TableCell class_name="w-1/6">{item.date}</TableCell>
                    <TableCell class_name="w-1/6">
                      <Image
                        src={getImageUrl(item.image)}
                        width={69}
                        height={69}
                        alt="class_img"
                        class_name="rounded-md shadow-sm"
                      />
                    </TableCell>
                    <TableCell class_name="w-1/6">IDR {item.price}</TableCell>
                    <TableCell class_name="w-1/6">
                      <div class_name="flex items-center space-x-2">
                        <EditCourse course={item} />
                        <DeleteCourse id={item.id} />
                        <ViewCourse course={item} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div class_name="flex justify-end mt-5">
          <AddCourse />
        </div>
      </div>
    );
  }