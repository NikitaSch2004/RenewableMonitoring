import { BrowserRouter as Router } from "react-router-dom";
<<<<<<< Updated upstream
import { AuthProvider } from "./context/AuthContext";
=======
import { useEffect } from "react";
import axios from "axios";
import { AuthProvider } from "./contexts/AuthContext";
>>>>>>> Stashed changes
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
    useEffect(() => {
    const pingServer = () => {
      axios.post("http://localhost:8000/api/populate/facility-data/").catch((err) =>
        console.error("Ping failed:", err)
      );
    };

    pingServer(); // сразу пингуем при запуске
    const interval = setInterval(pingServer, 30 * 60 * 1000); //Каждые 30 минут

    return () => clearInterval(interval); //Очистка
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}
