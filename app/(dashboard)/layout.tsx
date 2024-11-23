"use client";

import { AlertCircle, Building2, Menu, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Headless from "@headlessui/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/Sidebar/Sidebar";
import UserButton from "@/features/auth/components/UserButton";
import { useGetUserMotels } from "@/features/motels/api/use-get-user-motels";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const { data, isLoading, error } = useGetUserMotels();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isCreateMotelPage = pathname === "/create-motel";
  const currentMotel = data?.[0]?.motels?.name;

  const renderHeader = () => {
    if (isLoading) {
      return <Skeleton className="h-8 w-48" />;
    }

    if (error) {
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
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold">
            {currentMotel.charAt(0).toUpperCase() + currentMotel.slice(1)}
          </h1>
        </div>
      );
    }

    if (!isCreateMotelPage) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
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
    <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Sidebar on desktop */}
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
        <Sidebar mobileOpen={false} toggleMobileOpen={() => {}} />
      </div>

      {/* Sidebar on mobile */}

      <Sidebar
        mobileOpen={mobileOpen}
        toggleMobileOpen={() => setMobileOpen(false)}
      />

      {/* Navbar on mobile */}
      <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div className="min-w-0 flex-1">{renderHeader()}</div>
        <div className="ml-auto">
          <UserButton
            user={session?.user || { name: null, email: null, image: null }}
            avatarOnly={true}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
        <div className="grow p-6 lg:rounded-lg bg-background lg:ml-2 lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 0 dark:lg:ring-white/10">
          <div className="mx-auto max-w-6xl">
            {/* Desktop header */}
            <div className="mb-6 hidden lg:block">{renderHeader()}</div>

            {/* Main content */}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full max-w-md" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              (currentMotel || isCreateMotelPage) && (
                <div className="min-h-[calc(100vh-10rem)]">{children}</div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
