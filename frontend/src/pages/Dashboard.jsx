import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FormularioReceta from "../componentes/FormularioReceta";
import ListaRecetas from "../componentes/ListaRecetas";
import InformeUso from "../componentes/InformeUso";
import ActualizarPlan from "../componentes/ActualizarPlan";
import GraficoEstadisticas from "../componentes/GraficoEstadisticas";
import { API_ENDPOINTS } from '../config/api';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { isMobile } = useSelector((state) => state.mobile);
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    obtenerRecetasUsuario();
  }, []);

  const obtenerRecetasUsuario = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch(API_ENDPOINTS.RECETAS, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setRecetas(data);
      } else {
        const errorData = await res.json();
        const errorTraducido = t(`errors.${obtenerClaveError(errorData.error)}`, errorData.error);
        setError(errorTraducido);
      }
    } catch (error) {
      const errorTraducido = t(`errors.${obtenerClaveError(error.message)}`, error.message);
      console.error("Error cargando recetas:", errorTraducido);
      setError(errorTraducido);
    } finally {
      setCargando(false);
    }
  };

  const obtenerClaveError = (mensajeError) => {
    if (!mensajeError) return "generic.somethingWrong";
    
    const mensaje = mensajeError.toLowerCase();
    
    if (mensaje.includes("unauthorized") || mensaje.includes("no autorizado")) {
      return "auth.unauthorized";
    }
    if (mensaje.includes("not found") || mensaje.includes("no encontrado")) {
      return "connection.notFound";
    }
    if (mensaje.includes("network") || mensaje.includes("failed to fetch")) {
      return "connection.network";
    }
    
    return "generic.somethingWrong";
  };

  const manejarRecetaAgregada = (nuevaReceta) => {
    setRecetas(prev => [nuevaReceta, ...prev]);
    setError("");
  };

  const manejarRecetaEliminada = (recetaId) => {
    setRecetas(prev => prev.filter(receta => receta._id !== recetaId));
  };

  const manejarRecetaActualizada = (recetaActualizada) => {
    setRecetas(prev => prev.map(receta => 
      receta._id === recetaActualizada._id ? recetaActualizada : receta
    ));
  };

  const recargarRecetas = () => {
    obtenerRecetasUsuario();
  };

  if (cargando) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: isMobile ? 14 : 16 }}>{t("loading.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: isMobile ? 10 : 20, 
      minHeight: "100vh", 
      backgroundColor: "#f8f9fa" 
    }}>

      <div style={{ 
        marginBottom: isMobile ? 20 : 30,
        padding: isMobile ? 15 : 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        border: "1px solid #ddd"
      }}>
        <h1 style={{ 
          margin: 0, 
          color: "#333", 
          fontSize: isMobile ? 22 : 28, 
          fontWeight: "600" 
        }}>
          Mi libro de recetas
        </h1>
        <p style={{ 
          margin: "8px 0 0 0", 
          color: "#666", 
          fontSize: isMobile ? 14 : 16 
        }}>
          Bienvenido, <strong>{user?.username}</strong>!
        </p>
        <div style={{ 
          display: "flex", 
          gap: 15, 
          marginTop: 15,
          flexWrap: "wrap" 
        }}>
          <span style={{
            padding: "6px 12px",
            backgroundColor: user?.plan === "premium" ? "#28a745" : "#007bff",
            color: "#fff",
            borderRadius: 20,
            fontSize: isMobile ? 10 : 12,
            fontWeight: "500"
          }}>
            Plan: {user?.plan?.toUpperCase() || "PLUS"}
          </span>
          <span style={{
            padding: "6px 12px",
            backgroundColor: "#6c757d",
            color: "#fff",
            borderRadius: 20,
            fontSize: isMobile ? 10 : 12,
            fontWeight: "500"
          }}>
            Recetas: {recetas.length}
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          padding: 15,
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
          borderRadius: 8,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 10 : 0
        }}>
          <span style={{ fontSize: isMobile ? 13 : 14 }}>{error}</span>
          <button
            onClick={recargarRecetas}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: isMobile ? 11 : 12
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
        gap: isMobile ? 15 : 20,
        marginBottom: isMobile ? 20 : 30 
      }}>

        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 15 : 20 }}>
          <FormularioReceta 
            onRecetaAdded={manejarRecetaAgregada}
            currentRecetaCount={recetas.length}
            userPlan={user?.plan || "plus"}
            isMobile={isMobile}
          />
          
          <InformeUso 
            recetas={recetas}
            userPlan={user?.plan || "plus"}
            isMobile={isMobile}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 15 : 20 }}>
          <ActualizarPlan currentPlan={user?.plan || "plus"} isMobile={isMobile} />
          <GraficoEstadisticas recetas={recetas} isMobile={isMobile} />
        </div>
      </div>

      <div style={{
        padding: isMobile ? 15 : 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        border: "1px solid #ddd"
      }}>
        <ListaRecetas 
          recetas={recetas}
          onRecetaDeleted={manejarRecetaEliminada}
          onRecetaUpdated={manejarRecetaActualizada}
          isMobile={isMobile}
        />
      </div>

      <div style={{ 
        marginTop: isMobile ? 20 : 30,
        padding: 15,
        backgroundColor: "#e9ecef",
        borderRadius: 8,
        textAlign: "center"
      }}>
        <p style={{ 
          margin: 0, 
          color: "#6c757d", 
          fontSize: isMobile ? 11 : 12 
        }}>
          💡 <strong>Tip:</strong> {user?.plan === "plus" 
            ? "Actualiza a Premium para recetas ilimitadas y más funcionalidades" 
            : "Disfruta de todos los beneficios Premium con recetas ilimitadas"
          }
        </p>
      </div>
    </div>
  );
}