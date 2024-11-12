"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HomeIcon,
  LayoutDashboardIcon,
  UserIcon,
  BookOpenIcon,
  BarChartIcon,
  SettingsIcon,
  DoorOpenIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Logo from "../svg/Logo";
import UserButton from "@/features/auth/components/UserButton";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboardIcon },
  { name: "Rooms", path: "/rooms", icon: HomeIcon },
  { name: "Guests", path: "/guests", icon: UserIcon },
  { name: "Bookings", path: "/bookings", icon: BookOpenIcon },
  { name: "Housekeeping", path: "/housekeeping", icon: DoorOpenIcon },
  { name: "Reports", path: "/reports", icon: BarChartIcon },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

function SidebarContent() {
  const pathname = usePathname();
  const session = useSession();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-grow">
        <div className="flex items-center gap-2 m-2 h-14 justify-center">
          <Logo className="h-5" />
          <h3 className="text-lg">StaySync</h3>
        </div>
        <hr className="border-t border-zinc-950/5 dark:border-white/5 w-full" />
        <nav className="mt-4">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/" && pathname?.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link href={item.path} key={item.name}>
                <div
                  className={`relative flex items-center gap-2 px-4 py-2 text-base font-medium cursor-pointer 
                    ${
                      isActive
                        ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-white"
                        : "hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white"
                    } my-2`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="current-indicator"
                      className="absolute inset-y-0 left-0 w-1 bg-zinc-950 dark:bg-white"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon size={18} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="w-full mt-auto">
        <UserButton
          user={session.data?.user ?? { name: null, email: null, image: null }}
        />
      </div>
    </div>
  );
}

export default SidebarContent;
