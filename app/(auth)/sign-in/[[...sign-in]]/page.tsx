import React from "react";

import SignIn from "@/features/auth/components/SignIn";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import Link from "next/link";

function SignInPage() {
  return (
    <AuthLayout
      title="Sign in to account"
      subtitle={
        <>
          Don&apos;t have an account?
          <Link href="/sign-up" className="text-cyan-600 ml-2 mr-1.5">
            Sign up
          </Link>
          to create an account.
        </>
      }
    >
      <SignIn />
    </AuthLayout>
  );
}

export default SignInPage;
