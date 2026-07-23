"use client";

import React, { useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";

type ButtonState = "idle" | "loading" | "success" | "error";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  isSuccess,
  isError,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const [internalState, setInternalState] = useState<ButtonState>("idle");

  // Derive active state
  const state = isLoading ? "loading" : isSuccess ? "success" : isError ? "error" : internalState;

  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  const variants = {
    primary: "bg-[#2266ec] text-white hover:bg-[#1a4bb3] focus:ring-[#2266ec] shadow-[0_0_15px_rgba(34,102,236,0.3)] hover:shadow-[0_0_20px_rgba(34,102,236,0.5)]",
    secondary: "bg-[#262626] text-white hover:bg-[#333] border border-white/[0.05] focus:ring-[#333]",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 focus:ring-red-500",
    ghost: "bg-transparent text-[#a6a6a6] hover:text-white hover:bg-white/[0.05] focus:ring-white/[0.1]",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
    icon: "p-2",
  };

  const stateContent = {
    idle: children,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    success: <Check className="w-4 h-4 text-green-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-400" />,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || state !== "idle"}
      {...props}
    >
      <div className="relative flex items-center justify-center min-w-[20px]">
        <div className={`transition-all duration-300 ${state === 'idle' ? 'opacity-100 transform-none' : 'opacity-0 scale-75 absolute'}`}>
          {children}
        </div>
        <div className={`transition-all duration-300 ${state === 'loading' ? 'opacity-100 transform-none' : 'opacity-0 scale-75 absolute'}`}>
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
        <div className={`transition-all duration-300 ${state === 'success' ? 'opacity-100 transform-none' : 'opacity-0 scale-75 absolute'}`}>
          <Check className="w-4 h-4" />
        </div>
        <div className={`transition-all duration-300 ${state === 'error' ? 'opacity-100 transform-none' : 'opacity-0 scale-75 absolute'}`}>
          <AlertCircle className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}
