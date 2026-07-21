import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "Account Preview",
};

const demoCustomer = {
  id: "demo-customer",
  name: "ZEDX Preview Customer",
  email: "preview@zedx.local",
  phone: "+971 50 000 0000",
};

export default function AccountPage() {
  return <AccountDashboard customer={demoCustomer} />;
}
