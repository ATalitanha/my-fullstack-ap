"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <DialogPrimitive.Content className="fixed inset-0 m-auto max-w-lg w-[90%] rounded-2xl bg-white dark:bg-gray-900 border border-white/40 dark:border-gray-800/40 p-6 shadow-[var(--shadow-strong)]">
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

