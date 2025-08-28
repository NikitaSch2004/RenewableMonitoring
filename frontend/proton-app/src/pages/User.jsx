import { useAuth } from "../contexts/AuthContext";
import UserView from "../components/UserView";
import UsersList from "../components/UsersList";

export default function User() {
  const { user, logout } = useAuth();
  const isAdmin = user.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen justify-center space-y-8 pl-4 pr-4 pt-24 pb-24 lg:p-10">
      <UserView user={user} logout={logout} />
      {isAdmin && <UsersList />}
    </div>
  );
}