import Sidebar from "../components/Sidebar/Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex w-full h-screen max-w-full overflow-hidden">
      {/* user && */ (
        <div className="hidden md:block flex-shrink-0">
          <Sidebar />
        </div>
      )}
      <div className="flex-grow min-w-0 overflow-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
}
