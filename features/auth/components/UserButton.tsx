"use client";

import { useCallback } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserButtonProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  avatarOnly?: boolean;
}

const UserButton = ({ user, avatarOnly = false }: UserButtonProps) => {
  const { name, email, image } = user;

  const getInitials = useCallback((name: string) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="flex-shrink-0">
            {image ? (
              <div className="h-8 w-8 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <span className="text-sm font-medium text-zinc-100">
                  {name ? getInitials(name) : "?"}
                </span>
              </div>
            )}
          </div>
          {!avatarOnly && (
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {email}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
