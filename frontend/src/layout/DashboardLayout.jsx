import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout, actualizarPerfil } from "../slices/authSlice";
import { toggleSidebar } from "../slices/mobileSlice";
import SubirImagen from "../componentes/SubirImagen";
import { API_ENDPOINTS } from "../config/api";
import { useState } from "react";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile, mobileFeatures } = useSelector((state) => state.mobile);
  const { user, token } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const [mensaje, setMensaje] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleToggleSidebar = () => dispatch(toggleSidebar());
  const handleNavClick = () => isMobile && dispatch(toggleSidebar());

  const manejarSubidaImagen = async (urlImagen) => {
    try {
      setSubiendo(true);
      setMensaje("");

      const res = await fetch(API_ENDPOINTS.ACTUALIZAR_IMAGEN_PERFIL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagenUrl: urlImagen }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("errors.generic.somethingWrong"));

      dispatch(actualizarPerfil(data.user));
      setMensaje(t("success.imageUpdated"));
    } catch (error) {
      const errorTraducido = t(`errors.${obtenerClaveError(error.message)}`, error.message);
      setMensaje(errorTraducido);
    } finally {
      setSubiendo(false);
    }
  };

  const obtenerClaveError = (mensajeError) => {
    if (!mensajeError) return "generic.somethingWrong";
    
    const mensaje = mensajeError.toLowerCase();
    
    if (mensaje.includes("error al actualizar la imagen de perfil") || mensaje.includes("error updating profile image")) {
      return "images.updateError";
    }
    if (mensaje.includes("formato de imagen no válido") || mensaje.includes("invalid image format")) {
      return "images.invalidFormat";
    }
    if (mensaje.includes("la imagen no puede ser mayor a 5mb") || mensaje.includes("image too large")) {
      return "images.tooLarge";
    }
    if (mensaje.includes("unauthorized") || mensaje.includes("no autorizado")) {
      return "auth.unauthorized";
    }
    
    return "generic.somethingWrong";
  };

  const layoutStyle = {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    flexDirection: isMobile ? "column" : "row",
  };

  const sidebarStyle = {
    width: isMobile ? (mobileFeatures.sidebarOpen ? "280px" : "100%") : 220,
    height: isMobile ? (mobileFeatures.sidebarOpen ? "100vh" : "70px") : "100%",
    padding: isMobile
      ? mobileFeatures.sidebarOpen
        ? "25px 20px"
        : "15px 20px"
      : "20px",
    borderRight: isMobile ? "none" : "1px solid #ddd",
    borderBottom: isMobile ? "1px solid #ddd" : "none",
    backgroundColor: isMobile
      ? mobileFeatures.sidebarOpen
        ? "#2f2f2f"
        : "#f8f9fa"
      : "#f8f9fa",
    color: isMobile && mobileFeatures.sidebarOpen ? "#f2f2f2" : "#333",
    position: isMobile
      ? mobileFeatures.sidebarOpen
        ? "fixed"
        : "relative"
      : "relative",
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow:
      isMobile && mobileFeatures.sidebarOpen
        ? "0 0 20px rgba(0,0,0,0.3)"
        : "none",
    transition: "all 0.3s ease",
    overflow: "hidden",
  };

  const mainStyle = {
    flex: 1,
    padding: isMobile ? "15px" : "25px",
    backgroundColor: "#fff",
    overflow: "auto",
    position: "relative",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    display: isMobile && mobileFeatures.sidebarOpen ? "block" : "none",
  };

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
    display: "block",
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
    cursor: "pointer",
  };

  return (
    <div style={layoutStyle}>
      {isMobile && <div style={overlayStyle} onClick={handleToggleSidebar} />}

      <aside style={sidebarStyle}>
        {isMobile ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: mobileFeatures.sidebarOpen ? "30px" : "0",
            }}
          >
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
              }}
            >
              {mobileFeatures.sidebarOpen ? "✕" : "☰"}
            </button>

            <h3
              style={{
                margin: 0,
                color: mobileFeatures.sidebarOpen ? "white" : "#333",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Mi App
            </h3>

            <div style={{ width: "40px" }}></div>
          </div>
        ) : (
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Mi App</h3>
        )}

        {(isMobile ? mobileFeatures.sidebarOpen : true) && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <SubirImagen
              imagenActual={user?.imagenPerfil}
              onImagenSubida={manejarSubidaImagen}
            />

            {subiendo && (
              <p
                style={{
                  fontSize: 12,
                  color: isMobile ? "#ccc" : "#666",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {t("loading.uploadingImage")}
              </p>
            )}

            {mensaje && (
              <p
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: mensaje.includes("éxito") || mensaje.includes("success") ? "green" : "red",
                  marginTop: 8,
                }}
              >
                {mensaje}
              </p>
            )}

            <p
              style={{
                fontSize: 14,
                marginTop: 6,
                color: isMobile && mobileFeatures.sidebarOpen ? "#eee" : "#333",
                fontWeight: 500,
              }}
            >
              {user?.username || t("ui.user", "Usuario")}
            </p>
          </div>
        )}

        {(isMobile ? mobileFeatures.sidebarOpen : true) && (
          <>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Link
                to="/dashboard"
                style={isMobile ? linkStyleMobile : linkStyleDesktop}
                onClick={handleNavClick}
              >
                🏠 {t("ui.home", "Inicio")}
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
              }}
            >
              {t("ui.logout", "Cerrar sesión")}
            </button>
          </>
        )}
      </aside>

      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}