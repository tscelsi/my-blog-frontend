import clsx from "clsx";
import { motion, MotionProps } from "framer-motion";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    variant?: "default" | "destructive";
    isSelected?: boolean;
  };

const getStyle = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "destructive":
      return "text-error";
    default:
      return "";
  }
};

const getSelectedStyle = (
  variant: ButtonProps["variant"],
  isSelected: boolean
) => {
  if (isSelected) {
    switch (variant) {
      case "destructive":
        return "bg-error bg-opacity-20";
      default:
        return "bg-light-grey text-bg";
    }
  }
  return "";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "default", isSelected = false, ...props }, ref) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      ref={ref}
      {...props}
      className={clsx(
        "hover:opacity-80 cursor-pointer",
        getStyle(variant),
        getSelectedStyle(variant, isSelected)
      )}
    >
      {children}
    </motion.button>
  )
);

Button.displayName = "Button";
