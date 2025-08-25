import { useAuth } from "../contexts/AuthContext";
import UserView from "../components/UserView";
import UsersList from "../components/UsersList";

export default function User() {
  const { user, logout } = useAuth();
  const isAdmin = user.role === 'admin';

  return (
    <div className="flex flex-col justify-center min-h-screen space-y-8">
      <UserView user={user} logout={logout} />
      {isAdmin && <UsersList />}
    </div>
  );
}