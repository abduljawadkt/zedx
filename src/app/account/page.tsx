import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { CUSTOMER_SESSION_COOKIE, getCustomerSessionFromToken } from "@/lib/backend/session";
import { safeCustomer } from "@/lib/backend/customer";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const session = await getCustomerSessionFromToken(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value);
  const customer = safeCustomer(session?.customer ?? null);

  if (!customer) redirect("/login");

  return <AccountDashboard customer={customer} />;
}
