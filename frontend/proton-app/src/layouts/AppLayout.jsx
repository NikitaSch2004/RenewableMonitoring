import Sidebar from "../components/Sidebar/Sidebar";
import MobileNavMenu from '../components/MobileNavMenu/MobileNavMenu';
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function AppLayout({ children }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex w-full h-screen max-w-full overflow-y-auto bg-gray-50">
      {user && (
        <div className="hidden lg:block flex-shrink-0">
          <Sidebar />
        </div>
      )}

      <div className="flex-grow">
        {user && (
          <div className="lg:hidden">
          <MobileNavMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        </div>
        )}
        <main className="pt-24 pb-16 lg:pt-0 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
