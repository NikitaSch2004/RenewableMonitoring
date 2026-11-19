import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
