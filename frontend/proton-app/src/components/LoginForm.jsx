import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        
        const fakeToken = "123456789";
        login(fakeToken);
    }

    return (
        <div className="bg-white rounded-lg p-8 shadow max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Login</h2>
            <div className="space-y-6">
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

                <button
                    type="button"
                    onClick={() => window.location.href = '/register'}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors text-lg border border-gray-300"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}
