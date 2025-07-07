import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import UnAuthRoute from "./UnAuthRoute";
import Monitoring from "../pages/Monitoring";
import User from "../pages/User";


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
            {/* <Route
                path="/user"
                element={
                    <UnAuthRoute>
                        <User />
                    </UnAuthRoute>
                }
            /> */}
            <Route path="/user" element={<User/>} />
        </Routes>
    );
}
