import { motion } from "framer-motion";
import { cn } from "./Button"; // Reusing cn utility

export function Card({ className, children, hoverEffect = true, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
      className={cn(
        "bg-white/80 backdrop-blur-md border border-surface-200 rounded-2xl p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
