import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <aside style={{ 
        width: 220, 
        padding: 20, 
        borderRight: "1px solid #ddd",
        backgroundColor: "#f8f9fa"
      }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Mi App</h3>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link 
            to="/dashboard" 
            style={linkStyle}
          >
            🏠 Inicio
          </Link>
        </nav>
        
        <button
          onClick={handleLogout}
          style={{ 
            marginTop: 20, 
            padding: 10, 
            background: "#ff4d4f", 
            color: "#fff", 
            border: "none", 
            borderRadius: 8, 
            cursor: "pointer",
            width: "100%",
            fontSize: 14
          }}
        >
          Cerrar sesión
        </button>
      </aside>
      
      <main style={{ flex: 1, padding: 25, backgroundColor: "#fff", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = {
  padding: "10px 15px",
  borderRadius: 8,
  textDecoration: "none",
  color: "#333",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  transition: "all 0.3s ease",
  fontSize: 14,
  fontWeight: "500"
};