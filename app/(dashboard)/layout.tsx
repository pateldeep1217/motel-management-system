import Sidebar from "@/components/Sidebar/Sidebar";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="bg-[#18181C] w-full h-screen">{children}</main>
    </div>
  );
}

export default DashboardLayout;
