"use client";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactNode, useState } from "react";

export type FocusCard = {
  title: string;
  src: string;
  content?: ReactNode;
};

export type FocusCardsProps = {
  cards: FocusCard[];
  className?: string;
};

export const FocusCards = ({ cards, className }: FocusCardsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={clsx(
        "mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-3 md:px-8",
        className,
      )}
    >
      {cards.map((card, index) => (
        <div
          key={card.title}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={clsx(
            "relative h-60 w-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 ease-out md:h-96 dark:bg-neutral-900",
            hovered !== null && hovered !== index && "scale-[0.98] blur-sm",
          )}
        >
          <Image
            src={card.src}
            alt={card.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className={clsx(
              "absolute inset-0 flex items-end bg-black/50 px-4 py-8 transition-opacity duration-300",
              hovered === index ? "opacity-100" : "opacity-0",
            )}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={hovered === index ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text font-medium text-transparent text-xl md:text-2xl"
            >
              {card.title}
            </motion.div>
          </div>
          {card.content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={hovered === index ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="max-w-sm rounded-lg bg-white/90 p-4 dark:bg-black/90">
                {card.content}
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};
