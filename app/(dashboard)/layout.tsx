"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { ReactNode } from "react";
import { useGetUserMotels } from "@/features/motels/api/use-get-user-motels";
type Props = {
  children: ReactNode;
};

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function DashboardLayout({ children }: Props) {
  const { data, isLoading, error } = useGetUserMotels();
  const currentMotel = data?.[0]?.motel.name;
  const displayName = currentMotel
    ? capitalizeFirstLetter(currentMotel)
    : "My Motel";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-64 flex-shrink-0 ">
        <Sidebar />
      </div>
      <main className="flex-grow p-6 lg:p-10 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/5 mt-2 mb-2 mr-2">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLoading
              ? "Loading..."
              : error
              ? "Error loading motel"
              : displayName}
          </h1>
        </header>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
