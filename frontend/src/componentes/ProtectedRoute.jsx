import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { user } = useSelector((state) => state.auth);
    // Si no está autenticado → redirige a login
    if (!user) return <Navigate to="/login" replace />;

    // Si está autenticado → renderiza rutas hijas
    return <Outlet />;
};

export default ProtectedRoute;