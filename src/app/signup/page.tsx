import type { Metadata } from "next";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
