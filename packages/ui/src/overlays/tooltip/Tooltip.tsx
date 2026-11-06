"use client";

import { type ReactNode, useCallback, useRef, useState } from "react";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipVariant = "default" | "dark" | "light" | "minimal";

export interface TooltipProps {
  children: ReactNode;
  title: ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  arrow?: boolean;
  delay?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

export const Tooltip = ({
  children,
  title,
  placement = "top",
  variant = "default",
  arrow = true,
  delay = 0,
  disabled = false,
  className,
  contentClassName,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (disabled || !title) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [disabled, title, delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  // Variant styles
  const variantStyles = {
    dark: "bg-[var(--gray-900)] text-[var(--gray-100)] border border-[var(--gray-800)]",
    default:
      "bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)] shadow-[var(--shadow-lg)]",
    light:
      "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] shadow-[var(--shadow-lg)]",
    minimal: "bg-[var(--muted)]/90 text-[var(--muted-foreground)] border-0 backdrop-blur-sm",
  };

  // Placement styles
  const placementStyles = {
    bottom: "top-full left-1/2 -translate-x-1/2 mt-[var(--spacing-s)]",
    left: "right-full top-1/2 -translate-y-1/2 mr-[var(--spacing-s)]",
    right: "left-full top-1/2 -translate-y-1/2 ml-[var(--spacing-s)]",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-[var(--spacing-s)]",
  };

  // Arrow styles
  const arrowStyles = {
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-current",
    left: "left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-current",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-current",
    top: "top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-current",
  };

  // Animation variants
  const tooltipVariants = {
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.15,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: placement === "left" ? 10 : placement === "right" ? -10 : 0,
      y: placement === "top" ? 10 : placement === "bottom" ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        damping: 20,
        stiffness: 260,
        type: "spring",
      },
      x: 0,
      y: 0,
    },
  };

  if (!title) {
    return <>{children}</>;
  }

  return (
    <div
      className={clsx("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="tooltip"
    >
      {children}

      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            className={clsx(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-[var(--radius-m)] px-[var(--spacing-sm)] py-[var(--spacing-s)] font-medium text-sm",
              placementStyles[placement],
              variantStyles[variant],
              contentClassName,
            )}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {title}

            {/* Arrow */}
            {arrow && (
              <div
                className={clsx("absolute h-0 w-0", arrowStyles[placement])}
                style={{ color: variant === "light" ? "#1f2937" : "#374151" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Keep the original TooltipList for backward compatibility

import { useMotionValue, useSpring, useTransform } from "framer-motion";

export const TooltipList = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { damping: 15, stiffness: 100 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const target = event.target as HTMLElement;
      const halfWidth = target.offsetWidth / 2;
      x.set((event.nativeEvent as MouseEvent).offsetX - halfWidth);
    });
  };

  return (
    <>
      {items.map((item) => (
        <Column
          className="group -mr-4 relative"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    damping: 10,
                    stiffness: 260,
                    type: "spring",
                  },
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.6, y: 20 }}
                style={{
                  rotate: rotate,
                  translateX: translateX,
                  whiteSpace: "nowrap",
                }}
                className="-top-16 -translate-x-1/2 absolute left-1/2 z-50 flex flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="-bottom-px absolute inset-x-10 z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="-bottom-px absolute left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 font-bold text-base text-white">{item.name}</div>
                <div className="text-white text-xs">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={100 as any}
            width={100 as any}
            src={item.image as string}
            alt={item.name}
            className="!m-0 !p-0 relative h-14 w-14 rounded-full border-2 border-white object-cover object-top transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </Column>
      ))}
    </>
  );
};
