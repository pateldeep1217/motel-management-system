import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Room statuses
        available:
          "bg-green-500/20 text-green-700 border-green-500/25 dark:bg-green-500/10 dark:text-green-400",
        occupied:
          "bg-red-500/20 text-red-700 border-red-500/25 dark:bg-red-500/10 dark:text-red-400",
        maintenance:
          "bg-amber-400/20 text-amber-700 border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-400",
        cleaning:
          "bg-amber-400/20 text-amber-700 border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-400",

        // Booking statuses
        confirmed:
          "bg-blue-500/20 text-blue-700 border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400",
        "checked-in":
          "bg-green-500/20 text-green-700 border-green-500/25 dark:bg-green-500/10 dark:text-green-400",
        "checked-out":
          "bg-gray-500/20 text-gray-700 border-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400",
        cancelled:
          "bg-red-500/20 text-red-700 border-red-500/25 dark:bg-red-500/10 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "available",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
