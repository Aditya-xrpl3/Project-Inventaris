import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30",
  secondary: "bg-white text-surface-900 border border-surface-200 hover:bg-surface-50 shadow-sm",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
  ghost: "bg-transparent hover:bg-surface-100 text-surface-900",
};

export function Button({ className, variant = "primary", size = "md", children, ...props }) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
