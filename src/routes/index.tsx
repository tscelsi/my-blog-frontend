import { createFileRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
            <motion.img
              drag
              dragMomentum={false}
              dragConstraints={constraintsRef}
              className="object-none absolute top-1/2 left-1/3 w-1/5 h-40 rounded-xl z-2"
              src="/sunset.png"
            ></motion.img>
            <motion.img
              drag
              dragMomentum={false}
              dragConstraints={constraintsRef}
              className="object-none absolute top-1/2 left-1/2 w-1/5 h-40 rounded-xl z-2"
              src="/sunrise.png"
            ></motion.img>
          </motion.div>
        </QueryClientProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;
