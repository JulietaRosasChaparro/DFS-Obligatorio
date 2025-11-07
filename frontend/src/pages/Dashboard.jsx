import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FormularioReceta from "../componentes/FormularioReceta";
import ListaRecetas from "../componentes/ListaRecetas";
import InformeUso from "../componentes/InformeUso";
import ActualizarPlan from "../componentes/ActualizarPlan";
import GraficoEstadisticas from "../componentes/GraficoEstadisticas";
import { traducirError, textosCarga } from "../utils/traducciones";

import { API_ENDPOINTS } from '../config/api';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Cargar recetas del usuario al montar el componente
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
        const errorTraducido = traducirError(errorData.error);
        setError(errorTraducido);
      }
    } catch (error) {
      const errorTraducido = traducirError(error.message);
      console.error("Error cargando recetas:", errorTraducido);
      setError(errorTraducido);
    } finally {
      setCargando(false);
    }
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
          <p style={{ color: "#666", fontSize: 16 }}>{textosCarga.cargando}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <div style={{ 
        marginBottom: 30,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        border: "1px solid #ddd"
      }}>
        <h1 style={{ margin: 0, color: "#333", fontSize: 28, fontWeight: "600" }}>
          Mi libro de recetas
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: 16 }}>
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
            fontSize: 12,
            fontWeight: "500"
          }}>
            Plan: {user?.plan?.toUpperCase() || "PLUS"}
          </span>
          <span style={{
            padding: "6px 12px",
            backgroundColor: "#6c757d",
            color: "#fff",
            borderRadius: 20,
            fontSize: 12,
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
          alignItems: "center"
        }}>
          <span>{error}</span>
          <button
            onClick={recargarRecetas}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Grid Principal */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: 20,
        marginBottom: 30 
      }}>
        {/* Columna izquierda */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FormularioReceta 
            onRecetaAdded={manejarRecetaAgregada}
            currentRecetaCount={recetas.length}
            userPlan={user?.plan || "plus"}
          />
          
          <InformeUso 
            recetas={recetas}
            userPlan={user?.plan || "plus"}
          />
        </div>

        {/* Columna derecha */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ActualizarPlan currentPlan={user?.plan || "plus"} />
          <GraficoEstadisticas recetas={recetas} />
        </div>
      </div>

      {/* Lista de recetas */}
      <div style={{
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        border: "1px solid #ddd"
      }}>
        <ListaRecetas 
          recetas={recetas}
          onRecetaDeleted={manejarRecetaEliminada}
          onRecetaUpdated={manejarRecetaActualizada}
        />
      </div>

      {/* Footer informativo */}
      <div style={{ 
        marginTop: 30,
        padding: 15,
        backgroundColor: "#e9ecef",
        borderRadius: 8,
        textAlign: "center"
      }}>
        <p style={{ margin: 0, color: "#6c757d", fontSize: 12 }}>
          💡 <strong>Tip:</strong> {user?.plan === "plus" 
            ? "Actualiza a Premium para recetas ilimitadas y más funcionalidades" 
            : "Disfruta de todos los beneficios Premium con recetas ilimitadas"
          }
        </p>
      </div>
    </div>
  );
}