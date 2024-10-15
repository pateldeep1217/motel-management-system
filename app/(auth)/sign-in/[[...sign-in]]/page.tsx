import React from "react";
import Logo from "@/components/svg/Logo";

import FeatureShowcase from "@/components/FeatureShowcase";
import SignIn from "@/features/auth/components/SignIn";

function SignInPage() {
  return (
    <div className="mt-10">
      <SignIn />
    </div>
  );
}

export default SignInPage;
