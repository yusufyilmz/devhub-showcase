import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: any;
    height: any;
    chatHeight: any;
  }>({
    chatHeight: undefined,
    height: undefined,
    width: undefined,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;

    const update = () => {
      const headerHeight =
        (document.getElementById("header")?.getBoundingClientRect().height as number | undefined) ||
        0;

      setWindowSize((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const chatHeight = height - headerHeight;

        // Avoid unnecessary state updates if values are unchanged
        if (prev.width === width && prev.height === height && prev.chatHeight === chatHeight) {
          return prev;
        }

        return { chatHeight, height, width };
      });

      rafId = 0;
    };

    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    // Initialize immediately
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return windowSize;
};
