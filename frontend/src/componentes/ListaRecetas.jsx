import { useState } from "react";
import { traducirError, textosCarga, textosConfirmacion } from "../utils/traducciones";

export default function ListaRecetas({ recetas, onRecetaDeleted, onRecetaUpdated }) {
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
      
      const res = await fetch(`http://localhost:3000/v1/recetas/${recetaId}`, {
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

      const res = await fetch(`http://localhost:3000/v1/recetas/${recetaId}`, {
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
        marginBottom: 20 
      }}>
        <h3 style={{ margin: 0, color: "#333" }}>
          Mis recetas ({recetasFiltradas.length})
        </h3>
        
        <select 
          value={filtro} 
          onChange={(e) => setFiltro(e.target.value)}
          style={estiloSelect}
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
          padding: 40,
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f8f9fa"
        }}>
          No hay recetas {filtro !== "all" ? "en este período" : "aún"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {recetasFiltradas.map(receta => (
            <div key={receta._id} style={estiloItemReceta}>
              {editandoId === receta._id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input
                    value={editandoTitulo}
                    onChange={(e) => setEditandoTitulo(e.target.value)}
                    style={estiloInput}
                    placeholder="Título"
                  />
                  <textarea
                    value={editandoDescripcion}
                    onChange={(e) => setEditandoDescripcion(e.target.value)}
                    style={{ ...estiloInput, minHeight: 60 }}
                    placeholder="Descripción"
                  />
                  <textarea
                    value={editandoIngredientes}
                    onChange={(e) => setEditandoIngredientes(e.target.value)}
                    style={{ ...estiloInput, minHeight: 40 }}
                    placeholder="Ingredientes (separados por comas)"
                  />
                  <textarea
                    value={editandoPasos}
                    onChange={(e) => setEditandoPasos(e.target.value)}
                    style={{ ...estiloInput, minHeight: 80 }}
                    placeholder="Pasos (uno por línea)"
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => guardarEdicion(receta._id)}
                      style={estiloBoton("#28a745")}
                    >
                      {textosCarga.guardando}
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      style={estiloBoton("#6c757d")}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{receta.titulo}</h4>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => comenzarEdicion(receta)}
                        style={estiloBotonPequeno("#ffc107", "#000")}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => manejarEliminar(receta._id)}
                        style={estiloBotonPequeno("#dc3545")}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {receta.descripcion && (
                    <p style={{ margin: "0 0 10px 0", color: "#666", lineHeight: 1.5 }}>
                      {receta.descripcion}
                    </p>
                  )}

                  {receta.ingredientes && receta.ingredientes.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <strong style={{ fontSize: 14, color: "#333" }}>Ingredientes:</strong>
                      <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: 14 }}>
                        {receta.ingredientes.map(ing => ing.nombre).join(', ')}
                      </p>
                    </div>
                  )}

                  {receta.pasos && receta.pasos.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <strong style={{ fontSize: 14, color: "#333" }}>Pasos:</strong>
                      <ol style={{ margin: "5px 0 0 0", paddingLeft: 20, color: "#666", fontSize: 14 }}>
                        {receta.pasos.map((paso, index) => (
                          <li key={index}>{paso}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
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

const estiloItemReceta = {
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 8,
  backgroundColor: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
};

const estiloSelect = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
  backgroundColor: "#fff"
};

const estiloInput = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
  fontFamily: "inherit"
};

const estiloBoton = (colorFondo, color = "#fff") => ({
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  backgroundColor: colorFondo,
  color,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "500"
});

const estiloBotonPequeno = (colorFondo, color = "#fff") => ({
  padding: "6px 12px",
  border: "none",
  borderRadius: 4,
  backgroundColor: colorFondo,
  color,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: "500"
});