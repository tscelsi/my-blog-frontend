import { createFileRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../App.css";
import { useRef } from "react";
import Container from "../container";
import { motion } from "motion/react";
import { AudioProvider } from "../hooks/useAudio";
import { AuthProvider } from "../hooks/useAuth";

export const Route = createFileRoute("/")({ component: App });

const queryClient = new QueryClient();

function App() {
  const constraintsRef = useRef(null);

  return (
    <AuthProvider>
      <AudioProvider>
        <QueryClientProvider client={queryClient}>
          <motion.div className="relative w-full h-full" ref={constraintsRef}>
            <Container />
            {/* <motion.img
            drag
            dragMomentum={false}
            dragConstraints={constraintsRef}
            className="object-none absolute top-1/2 left-1/3 w-3/5 max-w-200 h-52 rounded-xl z-1"
            src="/src/assets/sunset.png"
          ></motion.img> */}
            <motion.img
              drag
              dragMomentum={false}
              dragConstraints={constraintsRef}
              className="object-none absolute top-1/2 left-1/2 w-3/5 max-w-200 h-52 rounded-xl z-2"
              src="/src/assets/sunrise.png"
            ></motion.img>
          </motion.div>
        </QueryClientProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;
