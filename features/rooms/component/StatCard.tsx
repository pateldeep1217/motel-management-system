import * as React from "react";
import { Card } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const statCardVariants = cva("relative overflow-hidden p-4 transition-all", {
  variants: {
    variant: {
      default: "border-primary/20 bg-primary/10 text-primary",
      secondary: "border-secondary/20 bg-secondary/10 text-secondary",
      blue: "border-blue-500/20 bg-blue-500/10 text-blue-500",
      purple: "border-purple-500/20 bg-purple-500/10 text-purple-500",
      green: "border-green-500/20 bg-green-500/10 text-green-500",
      amber: "border-amber-500/20 bg-amber-500/10 text-amber-500",
      red: "border-red-500/20 bg-red-500/10 text-red-500",
    },
  },
  defaultVariants: {
    variant: "default",
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
  variant,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={statCardVariants({ variant, className })} {...props}>
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
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-background/50 to-background/10`}
      />
    </Card>
  );
}

export default StatCard;
