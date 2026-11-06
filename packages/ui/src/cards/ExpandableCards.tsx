"use client";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useState, type ReactNode } from "react";

export type Card = {
  id: number;
  content: ReactNode;
  className?: string;
  thumbnail: string;
};

export type ExpandableCardsProps = {
  cards: Card[];
  className?: string;
};

export const ExpandableCards = ({ cards, className }: ExpandableCardsProps) => {
  const [active, setActive] = useState<Card | null>(null);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
            onClick={() => setActive(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <motion.button
              key={`button-${active.id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}`}
              className="flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-white sm:rounded-3xl md:h-fit md:max-h-[90%] dark:bg-neutral-900"
            >
              <motion.div layoutId={`image-${active.id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.thumbnail}
                  alt={`Card ${active.id}`}
                  className="h-80 w-full object-cover object-top sm:rounded-tl-lg sm:rounded-tr-lg lg:h-80"
                />
              </motion.div>

              <div>
                <div className="flex items-start justify-between p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.id}`}
                      className="font-medium text-base text-neutral-700 dark:text-neutral-200"
                    >
                      Card {active.id}
                    </motion.h3>
                  </div>
                </div>
                <div className="relative px-4 pt-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-neutral-600 text-xs [-ms-overflow-style:none] [-webkit-scrollbar:none] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400"
                  >
                    {active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className={clsx("mx-auto w-full max-w-2xl gap-4", className)}>
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.id}`}
            key={card.id}
            onClick={() => setActive(card)}
            className="flex cursor-pointer flex-col items-center justify-between rounded-xl p-4 hover:bg-neutral-50 md:flex-row dark:hover:bg-neutral-800"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <motion.div layoutId={`image-${card.id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.thumbnail}
                  alt={`Card ${card.id}`}
                  className="h-40 w-40 rounded-lg object-cover object-top md:h-14 md:w-14"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.id}`}
                  className="text-center font-medium text-neutral-800 md:text-left dark:text-neutral-200"
                >
                  Card {card.id}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.id}`}
                  className="text-center text-neutral-600 md:text-left dark:text-neutral-400"
                >
                  Click to expand and see more details
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.id}`}
              className="mt-4 rounded-full bg-gray-100 px-4 py-2 font-bold text-black text-sm hover:bg-green-500 hover:text-white md:mt-0"
            >
              View
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
};

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="m0 0h24v24H0z" fill="none" />
      <path d="m18 6l-12 12" />
      <path d="m6 6l12 12" />
    </motion.svg>
  );
};
