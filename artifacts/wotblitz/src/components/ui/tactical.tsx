import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TACTICAL BUTTON
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const TacButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 box-glow",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
      outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
      ghost: "bg-transparent text-foreground hover:bg-white/5",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10 flex items-center justify-center p-0",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variant !== "ghost" && variant !== "outline" && "clip-edges-sm",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);
TacButton.displayName = "TacButton";

// TACTICAL CARD
export const TacCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative bg-card border border-card-border overflow-hidden group transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
      {children}
    </div>
  )
);
TacCard.displayName = "TacCard";

// TACTICAL INPUT
export const TacInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full bg-input border border-border px-4 py-2 text-sm text-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 clip-edges-sm",
        className
      )}
      {...props}
    />
  )
);
TacInput.displayName = "TacInput";

// TACTICAL BADGE
export const TacBadge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "success" | "warning" | "danger" }) => {
  const variants = {
    default: "bg-secondary text-secondary-foreground border-border",
    success: "bg-tactical-green/20 text-tactical-green border-tactical-green/50",
    warning: "bg-tactical-yellow/20 text-tactical-yellow border-tactical-yellow/50",
    danger: "bg-tactical-red/20 text-tactical-red border-tactical-red/50",
  };
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-display font-bold uppercase tracking-wider border", variants[variant], className)}>
      {children}
    </span>
  );
};

// HUD STAT BOX
export const StatBox = ({ label, value, colorClass = "text-foreground", highlight }: { label: string, value: string | number, colorClass?: string, highlight?: boolean }) => (
  <div className={cn("flex flex-col p-3 bg-black/40 border border-white/5", highlight && "border-primary/30 bg-primary/5")}>
    <span className="text-[10px] text-muted-foreground uppercase font-display tracking-widest mb-1">{label}</span>
    <span className={cn("text-xl font-bold font-sans", colorClass)}>{value}</span>
  </div>
);

// ANIMATED WRAPPER
export const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);
