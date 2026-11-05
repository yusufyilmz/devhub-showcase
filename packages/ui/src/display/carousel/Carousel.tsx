"use client";

import * as React from "react";

import { cn } from "cn";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "../../buttons/button/Button";
import { carouselStyles } from "./styles";
import type { CarouselApi, CarouselContextProps, CarouselOptions2 } from "./types";

type CarouselControlProps = React.ComponentProps<typeof Button> & {
  placement?: "floating" | "inline";
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: CarouselOptions2) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.defaultPrevented ||
        (event.target instanceof Element &&
          event.target.closest("input, select, textarea, [contenteditable]"))
      )
        return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        api: api,
        canScrollNext,
        canScrollPrev,
        carouselRef,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollNext,
        scrollPrev,
      }}
    >
      <section
        aria-label="carousel"
        className={cn(carouselStyles.carousel, className)}
        data-slot="carousel"
        onKeyDownCapture={handleKeyDown}
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div className={carouselStyles.element1} data-slot="carousel-content" ref={carouselRef}>
      <div
        className={cn(
          carouselStyles.carouselContent,
          orientation === "horizontal"
            ? carouselStyles.carouselContent2
            : carouselStyles.carouselContent3,
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      className={cn(
        carouselStyles.carouselItem,
        orientation === "horizontal" ? carouselStyles.carouselItem2 : carouselStyles.carouselItem3,
        className,
      )}
      data-slot="carousel-item"
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  placement = "floating",
  ...props
}: CarouselControlProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      className={cn(
        placement === "floating" && carouselStyles.carouselPrevious,
        placement === "floating" &&
          (orientation === "horizontal"
            ? carouselStyles.carouselPrevious2
            : carouselStyles.carouselPrevious3),
        className,
      )}
      data-slot="carousel-previous"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      size={size}
      variant={variant}
      {...props}
    >
      <ArrowLeft />
      <span className={carouselStyles.element2}>Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  placement = "floating",
  ...props
}: CarouselControlProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      className={cn(
        placement === "floating" && carouselStyles.carouselNext,
        placement === "floating" &&
          (orientation === "horizontal"
            ? carouselStyles.carouselNext2
            : carouselStyles.carouselNext3),
        className,
      )}
      data-slot="carousel-next"
      disabled={!canScrollNext}
      onClick={scrollNext}
      size={size}
      variant={variant}
      {...props}
    >
      <ArrowRight />
      <span className={carouselStyles.element3}>Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};
