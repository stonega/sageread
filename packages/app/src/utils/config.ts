import type { ViewSettings } from "@/types/book";

export const getMaxInlineSize = (viewSettings: ViewSettings) => {
  const isScrolled = viewSettings.scrolled!;
  const isVertical = viewSettings.vertical!;
  const maxColumnCount = viewSettings.maxColumnCount!;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (maxColumnCount === 1 && !isScrolled && !isVertical) {
    return Math.max(screenWidth, screenHeight, 5000);
  }

  return maxColumnCount === 1 || isScrolled || isVertical
    ? Math.max(screenWidth, screenHeight, 720)
    : viewSettings.maxInlineSize!;
};

export const getDefaultMaxInlineSize = () => {
  if (typeof window === "undefined") return 720;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  return screenWidth < screenHeight ? Math.max(screenWidth, 720) : 720;
};

export const getDefaultMaxBlockSize = () => {
  if (typeof window === "undefined") return 1440;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  return Math.max(screenWidth, screenHeight, 1440);
};
