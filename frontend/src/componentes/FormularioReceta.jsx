import { useState } from "react";
import { useSelector } from "react-redux";
import { traducirError, textosCarga, textosValidacion } from "../utils/traducciones";

import { API_BASE } from "../config";

export default function FormularioReceta({ onRecetaAdded, currentRecetaCount, userPlan }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [pasos, setPasos] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const getMaxRecetas = () => {
    switch(userPlan) {
      case "premium": return Infinity;
      case "plus": return 10;
      default: return 10;
    }
  };

  const puedeAgregarReceta = currentRecetaCount < getMaxRecetas();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!puedeAgregarReceta) {
      setError("Has alcanzado el límite de recetas para tu plan");
      return;
    }

    if (!titulo.trim()) {
      setError(textosValidacion.tituloRequerido);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      const datosReceta = {
        titulo: titulo,
        descripcion: descripcion,
        ingredientes: ingredientes.split(',').map(ing => ing.trim()).filter(ing => ing).map(nombre => ({ nombre })),
        pasos: pasos.split('\n').filter(paso => paso.trim()),
      };

      const res = await fetch(`${API_BASE}/recetas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosReceta)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error al crear receta");
      }

      onRecetaAdded(data);
      setTitulo("");
      setDescripcion("");
      setIngredientes("");
      setPasos("");
    } catch (err) {
      const errorTraducido = traducirError(err.message);
      setError(errorTraducido);
    } finally {
      setCargando(false);
    }
  };

  if (!puedeAgregarReceta) {
    return (
      <div style={estiloContenedor}>
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>Agregar Receta</h3>
        <p style={{ color: "#dc3545", margin: 0, fontSize: 14 }}>
          {userPlan === "plus" 
            ? "Límite alcanzado (10 recetas). Actualiza a Premium para recetas ilimitadas."
            : "No se pueden agregar más recetas."
          }
        </p>
      </div>
    );
  }

  const mostrarContador = userPlan === "plus" ? `${currentRecetaCount}/10 recetas` : `${currentRecetaCount} recetas`;

  return (
    <div style={estiloContenedor}>
      <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>Agregar nueva receta</h3>
      
      <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          type="text"
          placeholder="Título de la receta"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={estiloInput}
          required
        />
        
        <textarea
          placeholder="Descripción de la receta"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{ ...estiloInput, minHeight: 80, resize: "vertical" }}
        />

        <textarea
          placeholder="Ingredientes (separados por comas)"
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
          style={{ ...estiloInput, minHeight: 60, resize: "vertical" }}
        />

        <textarea
          placeholder="Pasos de preparación (uno por línea)"
          value={pasos}
          onChange={(e) => setPasos(e.target.value)}
          style={{ ...estiloInput, minHeight: 100, resize: "vertical" }}
        />

        {error && (
          <p style={{ color: "red", fontSize: 14, margin: 0 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando || !titulo.trim()}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: cargando || !titulo.trim() ? "#ddd" : "#28a745",
            color: cargando || !titulo.trim() ? "#aaa" : "#fff",
            cursor: cargando || !titulo.trim() ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
        >
          {cargando ? textosCarga.creando : "🍳 Crear Receta"}
        </button>

        <p style={{ fontSize: 12, color: "#666", margin: 0, textAlign: "center" }}>
          {mostrarContador} (Plan {userPlan})
          {userPlan === "plus" && currentRecetaCount >= 8 && (
            <span style={{ color: "#dc3545", display: "block", marginTop: 5 }}>
              ⚠️ Cerca del límite ({10 - currentRecetaCount} restantes)
            </span>
          )}
        </p>
      </form>
    </div>
  );
}

const estiloContenedor = {
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 12,
  backgroundColor: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const estiloInput = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
  fontFamily: "inherit",
  transition: "border-color 0.3s ease"
};