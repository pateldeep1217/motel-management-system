"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useGetUserMotels } from "@/features/motels/api/use-get-user-motels";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const { data, isLoading, error, isError } = useGetUserMotels();
  const pathname = usePathname();
  const isCreateMotelPage = pathname === "/create-motel";

  const currentMotel = data?.[0]?.motels?.name;

  const renderHeader = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading motels...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load motels:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      );
    }

    if (currentMotel) {
      return (
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentMotel.charAt(0).toUpperCase() + currentMotel.slice(1)}
        </h1>
      );
    }

    if (!isCreateMotelPage) {
      return (
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
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-grow p-6 lg:p-10 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/5 mt-2 mb-2 mr-2">
        <header className="mb-6">{renderHeader()}</header>
        {(currentMotel || isCreateMotelPage) && (
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
