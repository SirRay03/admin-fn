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
      <div className="container mx-auto py-10">
        <h1 className="text-7xl font-bold text-center">Class Dashboard</h1>
  
        <div className="flex justify-end mt-5">
          <h1 className="text-2xl font-bold">Jumlah Kelas: xxx</h1>
        </div>
        <div className="mt-5">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Class Name</TableHead>
                <TableHead className="w-1/6">Date</TableHead>
                <TableHead className="w-1/6">Image</TableHead>
                <TableHead className="w-1/6">Price</TableHead>
                <TableHead className="w-1/6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses &&
                courses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-1/4">{item.className}</TableCell>
                    <TableCell className="w-1/6">{item.date}</TableCell>
                    <TableCell className="w-1/6">
                      <Image
                        src={getImageUrl(item.image)}
                        width={69}
                        height={69}
                        alt="class_img"
                        className="rounded-md shadow-sm"
                      />
                    </TableCell>
                    <TableCell className="w-1/6">IDR {item.price}</TableCell>
                    <TableCell className="w-1/6">
                      <div className="flex items-center space-x-2">
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
        <div className="flex justify-end mt-5">
          <AddCourse />
        </div>
      </div>
    );
  }