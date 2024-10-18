import React, { useState } from "react";
import Link from "next/link";
import Logo from "../svg/Logo";
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
import UserButton from "@/features/auth/components/UserButton";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboardIcon size={18} /> },
  { name: "Rooms", path: "/rooms", icon: <HomeIcon size={18} /> },
  { name: "Guests", path: "/guests", icon: <UserIcon size={18} /> },
  { name: "Bookings", path: "/bookings", icon: <BookOpenIcon size={18} /> },
  {
    name: "Housekeeping",
    path: "/housekeeping",
    icon: <DoorOpenIcon size={18} />,
  },
  { name: "Reports", path: "/reports", icon: <BarChartIcon size={18} /> },
  { name: "Settings", path: "/settings", icon: <SettingsIcon size={18} /> },
];

function SidebarContent() {
  const [activeItem, setActiveItem] = useState(menuItems[0].name);

  return (
    <div className="lg:w-64 bg-neutral-900  min-h-screen flex flex-col justify-between">
      <div className="">
        <div className="flex items-center gap-2 ml-5 h-14 w-64">
          <Logo className="h-5" />
          <h3 className="text-lg">StaySync</h3>
        </div>
        <hr className="border-t border-zinc-950/15 dark:border-white/15" />
        <div className="relative">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.name}>
              <div
                className={`relative flex items-center gap-2 px-4 py-2 text-base font-medium text-zinc-950 dark:text-white cursor-pointer hover:bg-zinc-800 my-2`}
                onClick={() => setActiveItem(item.name)}
              >
                {/* Only show the motion indicator for the active item */}
                {activeItem === item.name && (
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
                {item.icon}
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="m-2">
        <UserButton />
      </div>
    </div>
  );
}

export default SidebarContent;
