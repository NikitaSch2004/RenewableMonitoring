import Sidebar from "../components/Sidebar/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AppLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex">
      {user && <Sidebar />}
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
}
