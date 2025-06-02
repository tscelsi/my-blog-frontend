// Add this hook to a utils file or at the top of your file
import { useEffect, useState } from "react";
import { isSmallScreen } from "../utils/small_screen";

export function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(() => isSmallScreen());

  useEffect(() => {
    function handleResize() {
      setIsSmall(isSmallScreen());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmall;
}
