"use client";

import * as React from "react";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "cn";

import { sliderStyles } from "./styles";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      className={cn(sliderStyles.slider, className)}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track className={cn(sliderStyles.slider2)} data-slot="slider-track">
        <SliderPrimitive.Range className={cn(sliderStyles.slider3)} data-slot="slider-range" />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          className={sliderStyles.element1}
          data-slot="slider-thumb"
          key={index}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
