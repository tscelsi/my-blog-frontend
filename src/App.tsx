import { useRef } from "react";
import Container from "./container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "motion/react";
import { AudioProvider } from "./hooks/useAudio";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

function App() {
  const constraintsRef = useRef(null);

  return (
    <AuthProvider>
      <AudioProvider>
        <QueryClientProvider client={queryClient}>
          <motion.div className="relative w-full h-full" ref={constraintsRef}>
            <Container />
          </motion.div>
        </QueryClientProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;
