"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { logoutUser } from "../actions/LogoutUser";

function LogoutUser() {
  return (
    <Button
      onClick={async () => {
        await logoutUser();
      }}
    >
      Logout
    </Button>
  );
}

export default LogoutUser;
