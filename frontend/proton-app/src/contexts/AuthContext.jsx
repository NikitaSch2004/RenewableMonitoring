import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api"; // твой axios instance

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // при монтировании проверяем токен и тянем профиль
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchProfile(token) {
    try {
      const response = await api.get("/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const profile = response.data; // { email, role, ... }
        setUser({ token, ...profile });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      logout(); // если токен невалидный
    } finally {
      setLoading(false);
    }
  }

  function login(token) {
    localStorage.setItem("authToken", token);
    fetchProfile(token); // сразу тянем профиль
  }

  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
