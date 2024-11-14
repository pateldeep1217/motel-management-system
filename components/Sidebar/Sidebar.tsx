"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
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
  const { data: session } = useSession();

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
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileOpen}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col w-64 bg-[#111111] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex items-center h-16 px-4">
          <Logo className="h-8 w-8" />
          <span className="font-semibold text-lg ml-2 text-white">
            StaySync
          </span>
        </div>

        <nav className="flex-1 flex flex-col py-6 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleMobileOpen();
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center p-4">
          <UserButton
            user={
              session?.user || {
                name: null,
                email: null,
                image: null,
              }
            }
          />
        </div>
      </aside>
    </>
  );
}
