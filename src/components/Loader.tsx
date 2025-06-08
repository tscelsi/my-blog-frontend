import { useEffect, useState } from "react";

export const Loader = () => {
  const [showUnderscore, setShowUnderscore] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowUnderscore((prev) => !prev);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="opacity-40">
        <p>
          {"<loading>"}
          <span className={showUnderscore ? "" : "invisible"}>_</span>
        </p>
      </div>
    </div>
  );
};
