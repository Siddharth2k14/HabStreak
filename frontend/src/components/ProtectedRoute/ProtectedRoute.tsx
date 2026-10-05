import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;