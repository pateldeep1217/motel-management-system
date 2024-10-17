import React from "react";

import SignUp from "@/features/auth/components/SignUp";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import Link from "next/link";

function SignUpPage() {
  return (
    <AuthLayout
      title="Sign up for an account"
      subtitle={
        <>
          Already registered?
          <Link href="/sign-in" className="text-cyan-600 ml-2 mr-1.5">
            Sign in
          </Link>
          to your account.
        </>
      }
    >
      <SignUp />
    </AuthLayout>
  );
}

export default SignUpPage;
