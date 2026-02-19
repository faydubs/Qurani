import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
}

export function ShinyButton({ children, className, variant = "primary", ...props }: ShinyButtonProps) {
  const baseStyles = "relative px-8 py-3 rounded-xl font-body font-bold text-lg transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40",
    outline: "bg-transparent border-2 border-primary/50 text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-foreground hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {children}
      </span>
      
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
}
