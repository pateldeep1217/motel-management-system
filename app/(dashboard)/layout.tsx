import Sidebar from "@/components/Sidebar/Sidebar";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10 w-full h-screen">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
