import { cn } from "@/lib/utils";
import * as React from "react";

// Define all possible status types
type BookingStatus =
  | "confirmed"
  | "checked-in"
  | "checked-out"
  | "cancelled"
  | "no-show"
  | "reserved";
export type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning";
type StatusVariant = BookingStatus | RoomStatus;

// Define the base styles and variants
const baseStyles =
  "inline-flex items-center rounded-full border px-2 py-0.5 sm:px-1.5 text-xs sm:text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap";
const variantStyles: { [key in StatusVariant]: string } = {
  available:
    "bg-green-500/20 text-green-700 border-green-500/25 dark:bg-green-500/10 dark:text-green-400",
  occupied:
    "bg-red-500/20 text-red-700 border-red-500/25 dark:bg-red-500/10 dark:text-red-400",
  maintenance:
    "bg-amber-400/20 text-amber-700 border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-400",
  cleaning:
    "bg-amber-400/20 text-amber-700 border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-400",
  confirmed:
    "bg-blue-500/20 text-blue-700 border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400",
  "checked-in":
    "bg-green-500/20 text-green-700 border-green-500/25 dark:bg-green-500/10 dark:text-green-400",
  "checked-out":
    "bg-gray-500/20 text-gray-700 border-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400",
  cancelled:
    "bg-red-500/20 text-red-700 border-red-500/25 dark:bg-red-500/10 dark:text-red-400",
  "no-show":
    "bg-gray-500/20 text-gray-700 border-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400",
  reserved:
    "bg-blue-500/20 text-blue-700 border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: StatusVariant;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}
export default Badge;
