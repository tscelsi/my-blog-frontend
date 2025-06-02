const SMALL_SCREEN_BREAKPOINT = 640;

export const isSmallScreen = () => {
  return typeof window !== "undefined"
    ? window.innerWidth < SMALL_SCREEN_BREAKPOINT
    : false;
};
