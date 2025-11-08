import { useState } from "react";
import { useSelector } from "react-redux";
import { traducirError, textosCarga, textosConfirmacion } from "../utils/traducciones";

import { API_ENDPOINTS } from "../config/api";

export default function ListaRecetas({ recetas, onRecetaDeleted, onRecetaUpdated }) {
  const { isMobile } = useSelector((state) => state.mobile);
  const [filtro, setFiltro] = useState("all");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoTitulo, setEditandoTitulo] = useState("");
  const [editandoDescripcion, setEditandoDescripcion] = useState("");
  const [editandoIngredientes, setEditandoIngredientes] = useState("");
  const [editandoPasos, setEditandoPasos] = useState("");

  const recetasFiltradas = recetas.filter(receta => {
    if (filtro === "all") return true;
    
    const fechaReceta = new Date(receta.fechaCreacion || receta.createdAt);
    const ahora = new Date();
    
    if (filtro === "week") {
      const unaSemanaAtras = new Date(ahora.setDate(ahora.getDate() - 7));
      return fechaReceta >= unaSemanaAtras;
    }
    
    if (filtro === "month") {
      const unMesAtras = new Date(ahora.setMonth(ahora.getMonth() - 1));
      return fechaReceta >= unMesAtras;
    }
    
    return true;
  });

  const manejarEliminar = async (recetaId) => {
    if (!window.confirm(textosConfirmacion.eliminarReceta)) return;

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API_ENDPOINTS.RECETA_BY_ID}/${recetaId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        onRecetaDeleted(recetaId);
      } else {
        const errorData = await res.json();
        const errorTraducido = traducirError(errorData.error);
        alert(errorTraducido);
      }
    } catch (error) {
      const errorTraducido = traducirError(error.message);
      console.error("Error eliminando receta:", errorTraducido);
      alert(errorTraducido);
    }
  };

  const comenzarEdicion = (receta) => {
    setEditandoId(receta._id);
    setEditandoTitulo(receta.titulo);
    setEditandoDescripcion(receta.descripcion || "");
    setEditandoIngredientes(receta.ingredientes?.map(ing => ing.nombre).join(', ') || "");
    setEditandoPasos(receta.pasos?.join('\n') || "");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditandoTitulo("");
    setEditandoDescripcion("");
    setEditandoIngredientes("");
    setEditandoPasos("");
  };

  const guardarEdicion = async (recetaId) => {
    try {
      const token = localStorage.getItem("token");
      
      const datosActualizados = {
        titulo: editandoTitulo,
        descripcion: editandoDescripcion,
        ingredientes: editandoIngredientes.split(',').map(ing => ing.trim()).filter(ing => ing).map(nombre => ({ nombre })),
        pasos: editandoPasos.split('\n').filter(paso => paso.trim())
      };

      const res = await fetch(`${API_ENDPOINTS.RECETA_BY_ID}/${recetaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosActualizados)
      });

      const data = await res.json();
      if (res.ok) {
        onRecetaUpdated(data);
        setEditandoId(null);
      } else {
        const errorTraducido = traducirError(data.error);
        alert(errorTraducido);
      }
    } catch (error) {
      const errorTraducido = traducirError(error.message);
      console.error("Error actualizando receta:", errorTraducido);
      alert(errorTraducido);
    }
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: isMobile ? 15 : 20,
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 10 : 0
      }}>
        <h3 style={{ margin: 0, color: "#333", fontSize: isMobile ? 16 : 18 }}>
          Mis recetas ({recetasFiltradas.length})
        </h3>
        
        <select 
          value={filtro} 
          onChange={(e) => setFiltro(e.target.value)}
          style={estiloSelect(isMobile)}
        >
          <option value="all">Historial</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
        </select>
      </div>

      {recetasFiltradas.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          color: "#666", 
          padding: isMobile ? 30 : 40,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f8f9fa"
        }}>
          No hay recetas {filtro !== "all" ? "en este período" : "aún"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 15 }}>
          {recetasFiltradas.map(receta => (
            <div key={receta._id} style={estiloItemReceta(isMobile)}>
              {editandoId === receta._id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 8 : 10 }}>
                  <input
                    value={editandoTitulo}
                    onChange={(e) => setEditandoTitulo(e.target.value)}
                    style={estiloInput(isMobile)}
                    placeholder="Título"
                  />
                  <textarea
                    value={editandoDescripcion}
                    onChange={(e) => setEditandoDescripcion(e.target.value)}
                    style={{ ...estiloInput(isMobile), minHeight: isMobile ? 50 : 60 }}
                    placeholder="Descripción"
                  />
                  <textarea
                    value={editandoIngredientes}
                    onChange={(e) => setEditandoIngredientes(e.target.value)}
                    style={{ ...estiloInput(isMobile), minHeight: isMobile ? 40 : 40 }}
                    placeholder="Ingredientes (separados por comas)"
                  />
                  <textarea
                    value={editandoPasos}
                    onChange={(e) => setEditandoPasos(e.target.value)}
                    style={{ ...estiloInput(isMobile), minHeight: isMobile ? 60 : 80 }}
                    placeholder="Pasos (uno por línea)"
                  />
                  <div style={{ display: "flex", gap: isMobile ? 8 : 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => guardarEdicion(receta._id)}
                      style={estiloBoton("#28a745", isMobile)}
                    >
                      {textosCarga.guardando}
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      style={estiloBoton("#6c757d", isMobile)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-start",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 10 : 0,
                    marginBottom: isMobile ? 10 : 0
                  }}>
                    <h4 style={{ 
                      margin: "0 0 10px 0", 
                      color: "#333", 
                      fontSize: isMobile ? 15 : 16,
                      flex: 1 
                    }}>{receta.titulo}</h4>
                    <div style={{ 
                      display: "flex", 
                      gap: isMobile ? 8 : 10, 
                      flexWrap: isMobile ? "wrap" : "nowrap" 
                    }}>
                      <button
                        onClick={() => comenzarEdicion(receta)}
                        style={estiloBotonPequeno("#ffc107", "#000", isMobile)}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => manejarEliminar(receta._id)}
                        style={estiloBotonPequeno("#dc3545", "#fff", isMobile)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {receta.descripcion && (
                    <p style={{ 
                      margin: "0 0 10px 0", 
                      color: "#666", 
                      lineHeight: 1.5,
                      fontSize: isMobile ? 13 : 14 
                    }}>
                      {receta.descripcion}
                    </p>
                  )}

                  {receta.ingredientes && receta.ingredientes.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <strong style={{ fontSize: isMobile ? 13 : 14, color: "#333" }}>Ingredientes:</strong>
                      <p style={{ 
                        margin: "5px 0 0 0", 
                        color: "#666", 
                        fontSize: isMobile ? 13 : 14,
                        lineHeight: 1.4 
                      }}>
                        {receta.ingredientes.map(ing => ing.nombre).join(', ')}
                      </p>
                    </div>
                  )}

                  {receta.pasos && receta.pasos.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <strong style={{ fontSize: isMobile ? 13 : 14, color: "#333" }}>Pasos:</strong>
                      <ol style={{ 
                        margin: "5px 0 0 0", 
                        paddingLeft: 20, 
                        color: "#666", 
                        fontSize: isMobile ? 13 : 14,
                        lineHeight: 1.5 
                      }}>
                        {receta.pasos.map((paso, index) => (
                          <li key={index} style={{ marginBottom: 4 }}>{paso}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  <p style={{ 
                    fontSize: isMobile ? 11 : 12, 
                    color: "#999", 
                    margin: 0,
                    marginTop: isMobile ? 10 : 0
                  }}>
                    Creada: {new Date(receta.fechaCreacion || receta.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const estiloItemReceta = (isMobile) => ({
  padding: isMobile ? 15 : 20,
  border: "1px solid #ddd",
  borderRadius: 8,
  backgroundColor: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
});

const estiloSelect = (isMobile) => ({
  padding: isMobile ? "10px 12px" : "8px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: isMobile ? 14 : 14,
  backgroundColor: "#fff",
  minWidth: isMobile ? "100%" : "auto"
});

const estiloInput = (isMobile) => ({
  padding: isMobile ? 10 : 8,
  borderRadius: 6,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: isMobile ? 14 : 14,
  fontFamily: "inherit"
});

const estiloBoton = (colorFondo, isMobile) => ({
  padding: isMobile ? "10px 16px" : "8px 16px",
  border: "none",
  borderRadius: 6,
  backgroundColor: colorFondo,
  color: "#fff",
  cursor: "pointer",
  fontSize: isMobile ? 14 : 14,
  fontWeight: "500",
  minHeight: "44px",
  flex: isMobile ? 1 : "none"
});

const estiloBotonPequeno = (colorFondo, color, isMobile) => ({
  padding: isMobile ? "8px 12px" : "6px 12px",
  border: "none",
  borderRadius: 4,
  backgroundColor: colorFondo,
  color,
  cursor: "pointer",
  fontSize: isMobile ? 12 : 12,
  fontWeight: "500",
  minHeight: "36px"
});