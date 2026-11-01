"use client";

import { type ReactNode, useCallback, useRef, useState } from "react";

import { clsx } from "clsx";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type TooltipVariant = "default" | "dark" | "light" | "gradient" | "minimal";

export interface AnimatedTooltipProps {
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  content: ReactNode;
  contentClassName?: string;
  delay?: number;
  disabled?: boolean;
  followCursor?: boolean;
  offset?: number;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
}

function tooltipShift(placement: TooltipPlacement, axis: "x" | "y") {
  if (axis === "x") {
    if (placement === "left") return 10;
    if (placement === "right") return -10;
    return 0;
  }
  if (placement === "top") return 10;
  if (placement === "bottom") return -10;
  return 0;
}

export const AnimatedTooltip = ({
  children,
  content,
  placement = "top",
  variant = "default",
  delay = 0,
  offset = 8,
  followCursor = false,
  disabled = false,
  className,
  contentClassName,
  arrow = true,
}: AnimatedTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for cursor following
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 100 };
  const translateX = useSpring(x, springConfig);
  const translateY = useSpring(y, springConfig);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [disabled, delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!followCursor || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;

      x.set(mouseX * 0.1);
      y.set(mouseY * 0.1);

      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [followCursor, x, y],
  );

  // Variant styles
  const variantStyles = {
    dark: "bg-black text-white border border-gray-800",
    default: "bg-gray-900 text-white border border-gray-700",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
    light: "bg-white text-gray-900 border border-gray-200 shadow-lg",
    minimal: "bg-gray-800/90 text-white border-0 backdrop-blur-sm",
  };

  // Placement styles
  const getPlacementStyles = (placement: TooltipPlacement) => {
    const baseOffset = offset + (arrow ? 8 : 0);

    switch (placement) {
      case "top":
        return {
          bottom: `calc(100% + ${baseOffset}px)`,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          left: "50%",
          top: `calc(100% + ${baseOffset}px)`,
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          right: `calc(100% + ${baseOffset}px)`,
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          left: `calc(100% + ${baseOffset}px)`,
          top: "50%",
          transform: "translateY(-50%)",
        };
      default:
        return {};
    }
  };

  // Arrow styles
  const getArrowStyles = (placement: TooltipPlacement) => {
    const arrowSize = 6;

    switch (placement) {
      case "top":
        return {
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid currentColor`,
          left: "50%",
          top: "100%",
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          borderBottom: `${arrowSize}px solid currentColor`,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid currentColor`,
          borderTop: `${arrowSize}px solid transparent`,
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid currentColor`,
          borderTop: `${arrowSize}px solid transparent`,
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
        };
      default:
        return {};
    }
  };

  // Animation variants
  const tooltipVariants = {
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.15,
      },
      x: tooltipShift(placement, "x"),
      y: tooltipShift(placement, "y"),
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: tooltipShift(placement, "x"),
      y: tooltipShift(placement, "y"),
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        damping: 20,
        stiffness: 260,
        type: "spring" as const,
      },
      x: 0,
      y: 0,
    },
  };

  return (
    <div
      className={clsx("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      role="tooltip"
    >
      {children}

      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            animate="visible"
            className={clsx(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg px-3 py-2 font-medium text-sm",
              variantStyles[variant],
              contentClassName,
            )}
            exit="exit"
            initial="hidden"
            style={
              followCursor
                ? {
                    left: mousePosition.x,
                    top: mousePosition.y - 40,
                    translateX: translateX,
                    translateY: translateY,
                  }
                : getPlacementStyles(placement)
            }
            variants={tooltipVariants}
          >
            {content}

            {/* Arrow */}
            {arrow && !followCursor && (
              <div
                className="absolute h-0 w-0"
                style={{
                  ...getArrowStyles(placement),
                  color: variant === "gradient" ? "#a855f7" : "currentColor",
                }}
              />
            )}

            {/* Gradient overlay for gradient variant */}
            {variant === "gradient" && (
              <>
                <div className="-bottom-px absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                <div className="-bottom-px absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-sm" />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Utility hook for tooltip state management
export const useTooltip = (initialVisible = false) => {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((prev) => !prev), []);

  const updatePosition = useCallback((x: number, y: number) => {
    setPosition({ x, y });
  }, []);

  return {
    hide,
    isVisible,
    position,
    show,
    toggle,
    updatePosition,
  };
};
