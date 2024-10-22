import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "relative block w-full h-10 appearance-none rounded-lg border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-[#242427] px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-500 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled]:border-zinc-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%] dark:[color-scheme:dark]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
