import { forwardRef, InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const inputVariants = cva(
  "w-full rounded-xl border bg-white/70 dark:bg-gray-800/70 border-white/40 dark:border-gray-700/40 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2",
  {
    variants: {
      uiSize: {
        sm: "h-9 text-[var(--text-fluid-1)]",
        md: "h-10 text-[var(--text-fluid-2)]",
        lg: "h-12 text-[var(--text-fluid-3)]",
      },
    },
    defaultVariants: {
      uiSize: "md",
    },
  }
);

/**
 * ویژگی‌های کامپوننت ورودی همراه با واریانت‌های اندازه
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

/**
 * فیلد ورودی با اندازه‌های قابل تنظیم و سازگار با تم تاریک/روشن
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, uiSize, ...props }, ref) => (
  <input ref={ref} className={clsx(inputVariants({ uiSize }), className)} {...props} />
));

Input.displayName = "Input";

export default Input;
