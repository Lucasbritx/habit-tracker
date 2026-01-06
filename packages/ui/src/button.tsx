"use client";

import { ReactNode } from "react";
import { Pressable, Text, View, PressableProps } from "react-native";
import { cssInterop } from "nativewind";

// Enable className on Pressable if needed, though usually it works out of the box with Babel plugin
// cssInterop(Pressable, { className: "style" });

interface ButtonProps extends PressableProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export const Button = ({ children, className = "", variant = "primary", ...props }: ButtonProps) => {
  const baseStyles = "py-3 px-6 rounded-xl flex-row items-center justify-center active:opacity-80";
  
  const variants = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    outline: "border-2 border-primary bg-transparent",
  };

  const textStyles = {
    primary: "text-white font-bold text-base",
    secondary: "text-white font-bold text-base",
    outline: "text-primary font-bold text-base",
  };

  return (
    <Pressable className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {typeof children === "string" ? (
        <Text className={textStyles[variant]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
