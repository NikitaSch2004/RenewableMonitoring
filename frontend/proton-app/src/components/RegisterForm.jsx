import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        
        // Basic validation
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.code === 200) {
                // Registration successful
                alert("Registration successful! You can now log in.");
                
                // Optionally, you can automatically log the user in after registration
                // For now, we'll just use the fake token as you had it
                const fakeToken = "1234567891234";
                login(fakeToken);
            } else {
                // Registration failed
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-lg p-8 shadow max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Register</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="space-y-4">
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-4 border border-yellow-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </div>
        </div>
    );
}