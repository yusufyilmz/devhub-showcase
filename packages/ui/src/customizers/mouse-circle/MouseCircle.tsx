"use client";

import { useEffect, useState } from "react";

import { mouseCircleInlineStyle1, mouseCircleStyles } from "./styles";

export const MouseCircle = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={mouseCircleStyles.element1}
      style={mouseCircleInlineStyle1(position.x, position.y)}
    ></div>
  );
};
