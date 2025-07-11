import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserView() {
  const { user, logout} = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg p-8 shadow max-w-md w-full mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">Welcome</h2>

        <div className="space-y-4">
          <p className="text-gray-700 text-lg text-center">Your token:</p>
          <div className="bg-gray-100 rounded-lg p-4 border">
            <span className="font-mono text-sm text-gray-800 break-all">{user.token}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
        >
          Leave
        </button>
      </div>
    </div>
  );
}