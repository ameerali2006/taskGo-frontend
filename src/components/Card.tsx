import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animateHover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  animateHover = false,
  onClick,
}) => {
  const baseStyle =
    "bg-white border border-slate-100 rounded-[16px] p-6 shadow-xl shadow-slate-100/50 transition-shadow duration-300";

  return (
    <motion.div
      onClick={onClick}
      whileHover={animateHover ? { y: -4, boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05)" } : {}}
      className={`${baseStyle} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
};
