"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PlusCircle,
  AlertCircle,
  Loader2,
  Building2,
  Menu,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useGetUserMotels } from "@/features/motels/api/use-get-user-motels";
import { usePathname } from "next/navigation";
import UserButton from "@/features/auth/components/UserButton";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const user = useSession();
  const { data, isLoading, error, isError } = useGetUserMotels();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isCreateMotelPage = pathname === "/create-motel";
  const currentMotel = data?.[0]?.motels?.name;

  const renderHeader = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
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
        <div className="flex items-center gap-2 w-full">
          <div className=" flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">
              {currentMotel.charAt(0).toUpperCase() + currentMotel.slice(1)}
            </h1>
          </div>

          <div className="ml-auto lg:hidden">
            <UserButton
              user={user.data?.user || { name: null, email: null, image: null }}
              avatarOnly={true}
            />
          </div>
        </div>
      );
    }

    if (!isCreateMotelPage) {
      return (
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">No Motel Found</h1>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first motel
          </p>
          <Button asChild>
            <Link
              href="/create-motel"
              className="inline-flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Motel
            </Link>
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background ">
      <Sidebar
        mobileOpen={mobileOpen}
        toggleMobileOpen={() => setMobileOpen(!mobileOpen)}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-card dark:lg:ring-white/10 m-2">
          <header className="flex h-14 items-center max-w-full md:max-w-7xl mx-auto">
            <div className="container flex items-center gap-4 px-4 max-w-full">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white"
                aria-label="Toggle Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              {renderHeader()}
            </div>
          </header>
          <main className="container mx-auto px-4 py-6 max-w-full md:max-w-7xl">
            {(currentMotel || isCreateMotelPage) && (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {children}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
