import { Loader2 } from "lucide-react";

import React from "react";
import Logo from "@/components/svg/Logo";

import FeatureShowcase from "@/components/FeatureShowcase";
import SignUp from "@/features/auth/components/SignUp";

function SignUpPage() {
  return (
    <div className="mt-10">
      <SignUp />
    </div>
  );
}

export default SignUpPage;
