import * as React from "react";
import { Card } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Assuming a utility function to handle classnames

// Define distinct styles for each stat category based on your dashboard's theme colors
const statCardVariants = cva("relative overflow-hidden p-6 transition-all", {
  variants: {
    intent: {
      dark: "bg-muted/10 border-muted text-muted-foreground",
    },
    size: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    intent: "dark",
    size: "md",
  },
});

interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  intent,
  size,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(statCardVariants({ intent, size }), className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {trend && (
            <p
              className={`text-xs font-medium ${
                trend.value >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
              {trend.label}
            </p>
          )}
        </div>
        <div className="rounded-full p-2 bg-background/10">
          {" "}
          <Icon className=" w-6 h-6" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-background/50 to-background/10" />
    </Card>
  );
}

export default StatCard;
