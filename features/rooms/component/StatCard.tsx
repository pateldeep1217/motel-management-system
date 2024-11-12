import * as React from "react";
import { Card } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const statCardVariants = cva("relative overflow-hidden p-6 transition-all", {
  variants: {
    intent: {
      primary: "bg-primary/10 border-primary/20 text-primary",
      secondary:
        "bg-secondary/10 border-secondary/20 text-secondary-foreground",
      info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
      success: "bg-green-500/10 border-green-500/20 text-green-500",
      warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
      danger: "bg-red-500/10 border-red-500/20 text-red-500",
    },
    size: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  intent,
  size,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={statCardVariants({ intent, size, className })} {...props}>
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
        <div className="rounded-full p-2 bg-background/10">{icon}</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-background/50 to-background/10" />
    </Card>
  );
}

export default StatCard;
