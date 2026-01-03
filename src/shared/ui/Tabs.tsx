"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={clsx("flex gap-2", className)} {...props} />
);
export const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={clsx(
      "px-3 py-2 rounded-xl text-sm bg-white/70 dark:bg-gray-800/70 border border-white/40 dark:border-gray-700/40 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
      className
    )}
    {...props}
  />
);
export const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={clsx("mt-3", className)} {...props} />
);

