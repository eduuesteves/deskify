import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute() {
    const token = localStorage.getItem("@deskify:token");

    if(token) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}