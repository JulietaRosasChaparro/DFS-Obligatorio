import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { toggleSidebar } from "../slices/mobileSlice";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile, mobileFeatures } = useSelector((state) => state.mobile);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleNavClick = () => {
    if (isMobile) {
      dispatch(toggleSidebar());
    }
  };

  // Estilos - Mantenemos todo igual para desktop
  const layoutStyle = {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    flexDirection: isMobile ? "column" : "row"
  };

  const sidebarStyle = {
    width: isMobile ? (mobileFeatures.sidebarOpen ? "280px" : "100%") : 220,
    height: isMobile ? (mobileFeatures.sidebarOpen ? "100vh" : "70px") : "100%",
    padding: isMobile ? (mobileFeatures.sidebarOpen ? "25px 20px" : "15px 20px") : "20px",
    borderRight: isMobile ? "none" : "1px solid #ddd",
    borderBottom: isMobile ? "1px solid #ddd" : "none",
    backgroundColor: isMobile ? (mobileFeatures.sidebarOpen ? "#2c3e50" : "#f8f9fa") : "#f8f9fa",
    color: isMobile && mobileFeatures.sidebarOpen ? "white" : "#333",
    position: isMobile ? (mobileFeatures.sidebarOpen ? "fixed" : "relative") : "relative",
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: isMobile && mobileFeatures.sidebarOpen ? "0 0 20px rgba(0,0,0,0.3)" : "none",
    transition: "all 0.3s ease",
    overflow: "hidden"
  };

  const mainStyle = {
    flex: 1,
    padding: isMobile ? "15px" : "25px",
    backgroundColor: "#fff",
    overflow: "auto",
    position: "relative"
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    display: isMobile && mobileFeatures.sidebarOpen ? "block" : "none"
  };

  return (
    <div style={layoutStyle}>
      {/* Overlay para cerrar el sidebar al hacer click fuera (solo móvil) */}
      {isMobile && (
        <div 
          style={overlayStyle}
          onClick={handleToggleSidebar}
        />
      )}
      
      <aside style={sidebarStyle}>
        {/* Header del sidebar */}
        {isMobile ? (
          // Header para móviles
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: mobileFeatures.sidebarOpen ? "30px" : "0"
          }}>
            <button
              onClick={handleToggleSidebar}
              style={{
                background: "none",
                border: "none",
                color: mobileFeatures.sidebarOpen ? "white" : "#333",
                fontSize: "20px",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "40px",
                minHeight: "40px",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = mobileFeatures.sidebarOpen ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
            >
              {mobileFeatures.sidebarOpen ? "✕" : "☰"}
            </button>
            
            <h3 style={{ 
              margin: 0, 
              color: mobileFeatures.sidebarOpen ? "white" : "#333",
              fontSize: "18px",
              fontWeight: "600"
            }}>
              {mobileFeatures.sidebarOpen ? "Mi App" : "Mi App"}
            </h3>

            {/* Espacio para mantener la alineación */}
            <div style={{ width: "40px" }}></div>
          </div>
        ) : (
          // Header para desktop
          <>
            <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Mi App</h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/dashboard" style={linkStyleDesktop}>
                🏠 Inicio
              </Link>
            </nav>
          </>
        )}

        {/* Contenido del sidebar */}
        {(isMobile ? mobileFeatures.sidebarOpen : true) && (
          <div style={{
            opacity: isMobile && !mobileFeatures.sidebarOpen ? 0 : 1,
            transition: "opacity 0.3s ease"
          }}>
            {/* Para móviles mostramos el menú completo cuando está abierto */}
            {isMobile && mobileFeatures.sidebarOpen && (
              <>
                <nav style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "8px",
                  marginBottom: "25px"
                }}>
                  <Link 
                    to="/dashboard" 
                    style={linkStyleMobile}
                    onClick={handleNavClick}
                  >
                    <span style={{ marginRight: "10px" }}>🏠</span>
                    Inicio
                  </Link>
                </nav>

                <button
                  onClick={handleLogout}
                  style={{ 
                    padding: "12px 16px",
                    background: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    marginTop: "20px"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#d9363e"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#ff4d4f"}
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {/* Para desktop mostramos el contenido normal */}
            {!isMobile && (
              <>
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
                    fontSize: 14,
                    fontWeight: "600"
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        )}
      </aside>
      
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}

// Estilos separados para desktop y mobile
const linkStyleDesktop = {
  padding: "10px 15px",
  borderRadius: 8,
  textDecoration: "none",
  color: "#333",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  transition: "all 0.3s ease",
  fontSize: 14,
  fontWeight: "500",
  display: "block"
};

const linkStyleMobile = {
  padding: "12px 16px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "white",
  backgroundColor: "rgba(255,255,255,0.1)",
  border: "none",
  transition: "all 0.3s ease",
  fontSize: "14px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  cursor: "pointer"
};