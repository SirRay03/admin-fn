import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function Pembayaran() {
    const supabase = createServerComponentClient({ cookies });
    const { data: payload, error: fetchError } = await supabase.from("transaction").select('*, users(email)');
    const { data, error } = await supabase.rpc("sum_current_month");
    const res = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "IDR",
    }).format(data);

    return (
        <div>
            <div class_name="container mx-auto py-10">
                <h1 class_name="text-7xl font-bold text-center">Payment Dashboard</h1>
            </div>
            <div class_name="container mx-auto pb-5">
                <h1 class_name="text-2xl font-bold text-right">Total Pemasukan: {res}</h1>
            </div>
            <div class_name="container mx-auto">
                <DataTable columns={columns} data={payload ?? []} />
            </div>
        </div>
    );
}