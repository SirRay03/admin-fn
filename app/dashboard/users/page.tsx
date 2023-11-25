import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./user-columns";

export default async function Users(){
    const supabase = createServerComponentClient({cookies})
    const { data } = await supabase.from('users').select()
    
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data ?? []} />
        </div>
    )
}