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
      <div className="container">
        <div>
          <AddCourse />
          <div className="container mt-5">
            <Table>
              <TableCaption>Daftar kelas terdaftar.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses &&
                  courses.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.className}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Image
                          src={getImageUrl(item.image)}
                          width={69}
                          height={69}
                          alt="class_img"
                          className="rounded-full shadow-sm w=12 h=12"
                        />
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <EditCourse course={item}/>
                          <DeleteCourse id={item.id} />
                          <ViewCourse course={item}/>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
}