import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./user-columns";

export default async function Users(){
    const supabase = createServerComponentClient({cookies})
    const { data } = await supabase.from('users').select()
        
    const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

    return (
        <div>
            <div className="container mx-auto py-10">
            <h1 className="text-7xl font-bold text-center">User Dashboard</h1>
            </div>
            <div className="container mx-auto pb-5">
                <h1 className="text-2xl font-bold text-right">Jumlah Pengguna: {count}</h1>
            </div>
            <div className="container mx-auto">
                <DataTable columns={columns} data={data ?? []} />
            </div>
        </div>
    )
}