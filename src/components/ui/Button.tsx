import { ButtonProps } from '@/lib/type';
import clsx from 'clsx';

const variants = {
  primary: 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:opacity-90',
  secondary: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-700',
  danger: 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        'rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-950',
        'flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};