import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    login("123435141351513");
  }

  function handleRegister() {
  }

  function handleLogout() {
    logout();
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-2xl font-semibold">Вы не вошли в систему</h2>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Войти
        </button>
        <button
          onClick={handleRegister}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Зарегистрироваться
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-2xl font-semibold">Добро пожаловать!</h2>
      <p className="text-gray-700">Ваш токен: <span className="font-mono break-all">{user.token}</span></p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Выйти
      </button>
    </div>
  );
}