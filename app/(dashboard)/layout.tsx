"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { ReactNode } from "react";
import { useGetUserMotels } from "@/features/motels/api/use-get-user-motels";
import { usePathname } from "next/navigation";

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  const { data, isLoading, error } = useGetUserMotels();
  const currentMotel = data?.[0]?.motels.name;
  const pathname = usePathname();

  // If we're on the create-motel page, don't show the empty state
  const isCreateMotelPage = pathname === "/create-motel";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-grow p-6 lg:p-10 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/5 mt-2 mb-2 mr-2">
        <header className="mb-6">
          {isLoading ? (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Loading...
            </h1>
          ) : error ? (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Error loading motel
            </h1>
          ) : currentMotel ? (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentMotel.charAt(0).toUpperCase() + currentMotel.slice(1)}
            </h1>
          ) : (
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Motel Found
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by creating your first motel
              </p>
              <Button asChild>
                <Link
                  href="/create-motel"
                  className="inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Motel
                </Link>
              </Button>
            </div>
          )}
        </header>
        {(currentMotel || isCreateMotelPage) && children}
      </main>
    </div>
  );
}

export default DashboardLayout;
