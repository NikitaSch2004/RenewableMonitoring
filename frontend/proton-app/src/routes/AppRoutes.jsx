import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Monitoring from "../pages/Monitoring";
import User from "../pages/User";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                     <PrivateRoute>
                        <Monitoring />
                     </PrivateRoute>
                }
            />

            <Route
                path="/user"
                element={
                    <PrivateRoute>
                        <User />
                    </PrivateRoute>
                }
            />

            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
        </Routes>
    );
}
