import Sidebar from "@/components/Sidebar/Sidebar";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-64 flex-shrink-0 ">
        <Sidebar />
      </div>
      <main className="flex-grow p-6 lg:p-10 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/5 mt-2 mb-2 mr-2">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
