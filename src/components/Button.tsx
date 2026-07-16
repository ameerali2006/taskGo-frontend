import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  disabled,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "w-full h-[52px] rounded-xl px-6 font-semibold text-sm outline-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed select-none border border-transparent";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/10 focus:ring-4 focus:ring-blue-500/20 active:translate-y-0",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-slate-200/10 focus:ring-4 focus:ring-slate-100/20 active:translate-y-0",
    outline:
      "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm focus:ring-4 focus:ring-slate-100/20 active:translate-y-0 border-slate-200",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/10 focus:ring-4 focus:ring-red-500/20 active:translate-y-0",
    success:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/10 focus:ring-4 focus:ring-emerald-500/20 active:translate-y-0",
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.01, y: -1 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.99, y: 0 }}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
