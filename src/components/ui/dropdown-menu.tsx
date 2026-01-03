"use client";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <DropdownMenuPrimitive.Content className={`min-w-[180px] rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 shadow-xl p-2 ${className ?? ""}`}>{children}</DropdownMenuPrimitive.Content>
);
export const DropdownMenuItem = DropdownMenuPrimitive.Item;
export const DropdownMenuSeparator = ({ className }: { className?: string }) => (
  <div className={`h-px bg-gray-200 dark:bg-gray-700 my-2 ${className ?? ""}`} />
);

