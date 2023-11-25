// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'

// import type { NextRequest } from 'next/server'

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req, res })
//   await supabase.auth.getSession()
//   return res
// }

import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();

  if (data.user == null) {
    return NextResponse.redirect(new URL("/?error=Please login first to access this route.", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/kelas-latihan", "/dashboard/users", "/dashboard/payments"],
};
