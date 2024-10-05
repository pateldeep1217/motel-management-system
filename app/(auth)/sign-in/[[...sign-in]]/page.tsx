import { Loader2 } from "lucide-react";
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

import React from "react";
import Logo from "@/components/svg/Logo";

import FeatureShowcase from "@/components/FeatureShowcase";

function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4 border-2">
        <div className="text-center pt-5 flex justify-center ">
          <Logo />
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <FeatureShowcase />
    </div>
  );
}

export default SignInPage;
