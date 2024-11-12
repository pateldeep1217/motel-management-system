"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Logo from "../svg/Logo";
import UserButton from "@/features/auth/components/UserButton";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Rooms", href: "/rooms", icon: Building2 },
  { name: "Guests", href: "/guests", icon: Users },
  { name: "Bookings", href: "/bookings", icon: CalendarDays },
];

interface SidebarProps {
  mobileOpen: boolean;
  toggleMobileOpen: () => void;
}

export default function Sidebar({
  mobileOpen,
  toggleMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  // Inside your Sidebar component
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        toggleMobileOpen();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen, toggleMobileOpen]);

  return (
    <div>
      {/* Backdrop for mobile view */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-secondary/50 z-40 lg:hidden"
          onClick={toggleMobileOpen}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full flex flex-col w-64 transform  transition-transform duration-200 ease-in-out lg:translate-x-0 lg:relative ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex items-center justify-between h-16  border-zinc-800 px-4">
          <div className="flex items-center">
            <Logo className="h-8 w-8 text-white" />
            <span className="text-white font-semibold text-lg ml-2">
              StaySync
            </span>
          </div>
          <button
            onClick={toggleMobileOpen}
            className="lg:hidden p-2 text-white"
            aria-label="Close Sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col py-6 px-4 space-y-1 relative">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-accent-foreground hover:text-accent-foreground hover:bg-accent/50"
                }`}
                onClick={toggleMobileOpen}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 h-full w-1 bg-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ left: 0 }}
                  />
                )}
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User and Settings */}
        <div className="mt-auto flex flex-col items-center p-4  border-zinc-800">
          <UserButton
            user={
              useSession().data?.user || {
                name: null,
                email: null,
                image: null,
              }
            }
          />
        </div>
      </aside>
    </div>
  );
}
