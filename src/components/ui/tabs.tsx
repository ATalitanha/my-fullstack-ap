"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <TabsPrimitive.List className={`inline-flex gap-2 rounded-2xl bg-white/70 dark:bg-gray-800/70 p-1 border border-white/40 dark:border-gray-700/40 ${className ?? ""}`}>{children}</TabsPrimitive.List>
);
export const TabsTrigger = ({ children, className, value }: { children: React.ReactNode; className?: string; value: string }) => (
  <TabsPrimitive.Trigger value={value} className={`px-3 py-2 rounded-xl text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300 ${className ?? ""}`}>{children}</TabsPrimitive.Trigger>
);
export const TabsContent = TabsPrimitive.Content;

