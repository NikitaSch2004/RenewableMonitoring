import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const backendHost = `${window.location.hostname}:8000`;
            const response = await api.post(`/login/`, {
                email,
                password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200 && response.data.token) {
                login(response.data.token); // сохраняем токен
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            if (err.response) {
                // Сервер ответил с ошибкой (4xx, 5xx)
                setError(err.response.data.message || "Login failed");
            } else {
                // Ошибка сети или другие проблемы
                setError("Network error. Try again later.");
            }
        }
    }

    return (
        <div className="bg-white rounded-lg p-8 shadow max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Login</h2>
            <div className="space-y-6">
                {error && <div className="text-red-500 text-center">{error}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 border border-yellow-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 border border-yellow-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
