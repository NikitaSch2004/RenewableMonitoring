import Sidebar from "../components/Sidebar/Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex">
      {user && <Sidebar />}
      <div className="flex-grow">{children}</div>
    </div>
  );
}
