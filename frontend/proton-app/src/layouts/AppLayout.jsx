// AppLayout.jsx
import Sidebar from "../components/Sidebar/Sidebar";
import MobileNavMenu from '../components/MobileNavMenu/MobileNavMenu';
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function AppLayout({ children }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden relative">
      {/* Mobile Navigation - overlay поверх контента */}
      {user && (
        <div className="lg:hidden">
          <MobileNavMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        </div>
      )}

      {/* Desktop Sidebar - только для десктопа */}
      {user && (
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}