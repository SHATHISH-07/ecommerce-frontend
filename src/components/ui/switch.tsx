import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";
import { Sun, Moon } from "lucide-react";

function Switch({
  className,
  theme,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  theme: "light" | "dark";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-[1.5rem] w-11 shrink-0 items-center rounded-full border border-transparent bg-input dark:bg-input/80 transition-all outline-none focus-visible:ring-[2px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "flex items-center justify-center p-0.5 bg-background dark:bg-foreground pointer-events-none size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[1.25rem] data-[state=unchecked]:translate-x-[0.1rem]"
        )}
      >
        {theme === "light" ? (
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-blue-400" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
