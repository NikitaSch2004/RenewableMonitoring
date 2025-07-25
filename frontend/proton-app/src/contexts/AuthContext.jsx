import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider(props) {
  const [user, setUser] = useState(() => {
    // При инициализации читаем токен из localStorage
    const storedToken = localStorage.getItem("authToken");
    return storedToken ? { token: storedToken } : null;
  });

  function login(token) {
    localStorage.setItem("authToken", token);
    setUser({ token });
  }

  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}