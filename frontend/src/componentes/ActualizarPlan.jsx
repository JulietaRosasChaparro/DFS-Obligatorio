import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../slices/authSlice";
import { traducirError, textosCarga, textosExito, textosConfirmacion } from "../utils/traducciones";

import { API_ENDPOINTS } from "../config/api";

export default function ActualizarPlan({ currentPlan }) {
  const { isMobile } = useSelector((state) => state.mobile);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const dispatch = useDispatch();

  const manejarActualizacion = async () => {
    if (currentPlan === "premium") {
      setMensaje("Ya tienes plan Premium");
      return;
    }

    if (currentPlan !== "plus") {
      setMensaje("Solo se puede cambiar de plan plus a premium");
      return;
    }

    if (!window.confirm(textosConfirmacion.cambiarPlan)) {
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(API_ENDPOINTS.UPDATE_PLAN, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar el plan");
      }

      const usuarioAlmacenado = JSON.parse(localStorage.getItem("user"));
      const usuarioActualizado = { 
        ...usuarioAlmacenado,
        plan: "premium"
      };
      
      localStorage.setItem("user", JSON.stringify(usuarioActualizado));
      dispatch(loginSuccess({ user: usuarioActualizado, token }));
      
      setMensaje(textosExito.planActualizado);
      
    } catch (error) {
      const errorTraducido = traducirError(error.message);
      setMensaje(errorTraducido);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estiloContenedor(isMobile)}>
      <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: isMobile ? 16 : 18 }}>
        Plan actual: {currentPlan?.toUpperCase() || "PLUS"}
      </h3>
      
      {currentPlan === "plus" ? (
        <>
          <div style={{ marginBottom: 15 }}>
            <p style={{ fontSize: isMobile ? 13 : 14, color: "#666", margin: "0 0 8px 0" }}>
              <strong>Plan Plus:</strong> Hasta 10 recetas
            </p>
            <p style={{ fontSize: isMobile ? 13 : 14, color: "#666", margin: 0 }}>
              <strong>Plan Premium:</strong> Recetas ilimitadas
            </p>
          </div>

          <p style={{ marginBottom: 12, fontSize: isMobile ? 13 : 14, color: "#666" }}>
            Beneficios Premium:
          </p>
          <ul style={{ 
            marginBottom: 15, 
            paddingLeft: 20, 
            fontSize: isMobile ? 13 : 14, 
            color: "#666",
            lineHeight: 1.5
          }}>
            <li>📈 Recetas ilimitadas</li>
            <li>📊 Métricas avanzadas</li>
            <li>🔍 Búsqueda por ingredientes</li>
            <li>⭐ Soporte prioritario</li>
          </ul>
          
          <button
            onClick={manejarActualizacion}
            disabled={cargando}
            style={{
              padding: isMobile ? "14px" : "12px 20px",
              border: "none",
              borderRadius: 8,
              backgroundColor: cargando ? "#6c757d" : "#28a745",
              color: "#fff",
              cursor: cargando ? "not-allowed" : "pointer",
              fontWeight: "600",
              width: "100%",
              fontSize: isMobile ? 14 : 14,
              transition: "all 0.3s ease",
              minHeight: "44px"
            }}
          >
            {cargando ? textosCarga.procesando : "🎯 Actualizar a Premium"}
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#28a745", fontWeight: "500", fontSize: isMobile ? 15 : 16, margin: "0 0 10px 0" }}>
            ✅ ¡Ya eres Premium!
          </p>
          <p style={{ fontSize: isMobile ? 13 : 14, color: "#666", margin: 0, lineHeight: 1.4 }}>
            Disfruta de recetas ilimitadas y todas las funcionalidades
          </p>
        </div>
      )}

      {mensaje && (
        <p style={{ 
          marginTop: 15, 
          padding: isMobile ? 10 : 10, 
          borderRadius: 6,
          backgroundColor: mensaje.includes("éxito") || mensaje.includes("¡") ? "#d4edda" : "#f8d7da",
          color: mensaje.includes("éxito") || mensaje.includes("¡") ? "#155724" : "#721c24",
          border: `1px solid ${mensaje.includes("éxito") || mensaje.includes("¡") ? "#c3e6cb" : "#f5c6cb"}`,
          fontSize: isMobile ? 13 : 14,
          textAlign: "center"
        }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

const estiloContenedor = (isMobile) => ({
  padding: isMobile ? 15 : 20,
  border: "1px solid #ddd",
  borderRadius: 12,
  backgroundColor: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
});