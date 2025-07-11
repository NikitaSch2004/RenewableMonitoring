import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
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
