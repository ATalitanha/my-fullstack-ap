import { HTMLAttributes } from "react";
import clsx from "clsx";

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  /**
   * کارت عمومی با پس‌زمینه شیشه‌ای و استایل ثابت برای یکنواختی UI
   */
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-white/40 dark:border-gray-700/40 shadow-[var(--shadow-soft)]",
        className
      )}
      {...props}
    />
  );
}
