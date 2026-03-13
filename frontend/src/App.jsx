import { useEffect } from "react";
import AppRouter from "./router/AppRouter";

function App() {

  useEffect(() => {

    const wakeBackend = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/ping`);
      } catch (error) {
        console.warn("Backend wake-up request failed");
      }
    };

    wakeBackend();

  }, []);

  return <AppRouter />;
}

export default App;