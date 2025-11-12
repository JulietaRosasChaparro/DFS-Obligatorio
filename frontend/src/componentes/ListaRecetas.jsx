import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../config/api";

export default function ListaRecetas({ recetas, onRecetaDeleted, onRecetaUpdated }) {
  const { isMobile } = useSelector((state) => state.mobile);
  const [filtro, setFiltro] = useState("all");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoTitulo, setEditandoTitulo] = useState("");
  const [editandoDescripcion, setEditandoDescripcion] = useState("");
  const [editandoIngredientes, setEditandoIngredientes] = useState("");
  const [editandoPasos, setEditandoPasos] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(null);
  const { t } = useTranslation();

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

  const mostrarMensaje = (texto, tipo = "error") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 5000);
  };

  const manejarEliminar = async (recetaId) => {
    setConfirmandoEliminar(recetaId);
  };

  const confirmarEliminar = async (recetaId, confirmar) => {
    if (!confirmar) {
      setConfirmandoEliminar(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(API_ENDPOINTS.RECETA_BY_ID(recetaId), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        onRecetaDeleted(recetaId);
        mostrarMensaje(t("success.recipeDeleted"), "success");
      } else {
        const text = await res.text();
        if (text) {
          const errorData = JSON.parse(text);
          const errorTraducido = t(`errors.${obtenerClaveError(errorData.error)}`, errorData.error);
          mostrarMensaje(errorTraducido);
        } else {
          mostrarMensaje(t("errors.generic.somethingWrong"));
        }
      }
    } catch (error) {
      const errorTraducido = t(`errors.${obtenerClaveError(error.message)}`, error.message);
      mostrarMensaje(errorTraducido);
    } finally {
      setConfirmandoEliminar(null);
    }
  };

  const obtenerClaveError = (mensajeError) => {
    if (!mensajeError) return "generic.somethingWrong";
    
    const mensaje = mensajeError.toLowerCase();
    
    if (mensaje.includes("recipe not found") || mensaje.includes("receta no encontrada")) {
      return "recipes.notFound";
    }
    if (mensaje.includes("not authorized") || mensaje.includes("no autorizado")) {
      return "auth.unauthorized";
    }
    
    return "generic.somethingWrong";
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
    if (guardando) return;
    
    setGuardando(true);
    setMensaje("");
    
    try {
      const token = localStorage.getItem("token");
      
      const datosActualizados = {
        titulo: editandoTitulo,
        descripcion: editandoDescripcion,
        ingredientes: editandoIngredientes.split(',').map(ing => ing.trim()).filter(ing => ing).map(nombre => ({ nombre })),
        pasos: editandoPasos.split('\n').filter(paso => paso.trim())
      };

      const res = await fetch(API_ENDPOINTS.RECETA_BY_ID(recetaId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosActualizados)
      });

      const responseText = await res.text();

      if (!responseText) {
        if (res.ok) {
          const recetaOriginal = recetas.find(r => r._id === recetaId);
          const recetaActualizada = {
            ...recetaOriginal,
            ...datosActualizados,
            fechaActualizacion: new Date().toISOString()
          };
          onRecetaUpdated(recetaActualizada);
          setEditandoId(null);
          mostrarMensaje(t("success.recipeUpdated"), "success");
          return;
        } else {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Error en la respuesta del servidor");
      }

      if (res.ok) {
        const recetaActualizada = data.data || data;
        onRecetaUpdated(recetaActualizada);
        setEditandoId(null);
        mostrarMensaje(t("success.recipeUpdated"), "success");
      } else {
        const errorMsg = data.error || `Error ${res.status}`;
        const errorTraducido = t(`errors.${obtenerClaveError(errorMsg)}`, errorMsg);
        mostrarMensaje(errorTraducido);
      }

    } catch (error) {
      const errorTraducido = t(`errors.${obtenerClaveError(error.message)}`, error.message);
      mostrarMensaje(errorTraducido || t("errors.generic.somethingWrong"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      {mensaje && (
        <div style={{
          padding: isMobile ? "12px 16px" : "14px 20px",
          marginBottom: isMobile ? 15 : 20,
          borderRadius: 8,
          backgroundColor: tipoMensaje === "success" ? "#d4edda" : "#f8d7da",
          border: `1px solid ${tipoMensaje === "success" ? "#c3e6cb" : "#f5c6cb"}`,
          color: tipoMensaje === "success" ? "#155724" : "#721c24",
          fontSize: isMobile ? 13 : 14,
          fontWeight: "500"
        }}>
          {mensaje}
        </div>
      )}

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: isMobile ? 15 : 20,
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 10 : 0
      }}>
        <h3 style={{ margin: 0, color: "#333", fontSize: isMobile ? 16 : 18 }}>
          {t("ui.myRecipes", "Mis recetas")} ({recetasFiltradas.length})
        </h3>
        
        <select 
          value={filtro} 
          onChange={(e) => setFiltro(e.target.value)}
          style={estiloSelect(isMobile)}
        >
          <option value="all">{t("ui.all", "Todo")}</option>
          <option value="week">{t("ui.lastWeek", "Última semana")}</option>
          <option value="month">{t("ui.lastMonth", "Último mes")}</option>
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
          {t("ui.noRecipes", "No hay recetas")} {filtro !== "all" ? t("ui.inThisPeriod", "en este período") : t("ui.yet", "aún")}
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
                    placeholder={t("ui.title", "Título")}
                  />
                  <textarea
                    value={editandoDescripcion}
                    onChange={(e) => setEditandoDescripcion(e.target.value)}
                    style={{ ...estiloInput(isMobile), minHeight: isMobile ? 50 : 60 }}
                    placeholder={t("ui.description", "Descripción")}
                  />
                  <textarea
                    value={editandoIngredientes}
                    onChange={(e) => setEditandoIngredientes(e.target.value)}
                    style={{ ...estiloInput(isMobile), minHeight: isMobile ? 40 : 40 }}
                    placeholder={t("ui.ingredientsPlaceholder", "Ingredientes (separados por comas)")}
                  />
                  <textarea
                    value={editandoPasos}
                    onChange={(e) => setEditandoPasos(e.target.value)}
                    style={{ ...estiloInput(isMobile), minHeight: isMobile ? 60 : 80 }}
                    placeholder={t("ui.stepsPlaceholder", "Pasos (uno por línea)")}
                  />
                  <div style={{ display: "flex", gap: isMobile ? 8 : 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => guardarEdicion(receta._id)}
                      disabled={guardando}
                      style={{
                        ...estiloBoton("#28a745", isMobile),
                        opacity: guardando ? 0.6 : 1
                      }}
                    >
                      {guardando ? t("loading.saving") : t("ui.save", "Guardar")}
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      disabled={guardando}
                      style={estiloBoton("#6c757d", isMobile)}
                    >
                      {t("ui.cancel", "Cancelar")}
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
                        {t("ui.edit", "Editar")}
                      </button>
                      <button
                        onClick={() => manejarEliminar(receta._id)}
                        style={estiloBotonPequeno("#dc3545", "#fff", isMobile)}
                      >
                        {t("ui.delete", "Eliminar")}
                      </button>
                    </div>
                  </div>
                  
                  {confirmandoEliminar === receta._id && (
                    <div style={{
                      padding: isMobile ? 12 : 15,
                      backgroundColor: "#fff3cd",
                      border: "1px solid #ffeaa7",
                      borderRadius: 6,
                      marginBottom: 10
                    }}>
                      <p style={{ 
                        margin: "0 0 10px 0", 
                        color: "#856404",
                        fontSize: isMobile ? 13 : 14
                      }}>
                        {t("confirmation.deleteRecipe")}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => confirmarEliminar(receta._id, true)}
                          style={{
                            ...estiloBotonPequeno("#dc3545", "#fff", isMobile),
                            fontSize: isMobile ? 12 : 12
                          }}
                        >
                          {t("ui.yesDelete", "Sí, eliminar")}
                        </button>
                        <button
                          onClick={() => confirmarEliminar(receta._id, false)}
                          style={{
                            ...estiloBotonPequeno("#6c757d", "#fff", isMobile),
                            fontSize: isMobile ? 12 : 12
                          }}
                        >
                          {t("ui.cancel", "Cancelar")}
                        </button>
                      </div>
                    </div>
                  )}
                  
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
                      <strong style={{ fontSize: isMobile ? 13 : 14, color: "#333" }}>{t("ui.ingredients", "Ingredientes")}:</strong>
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
                      <strong style={{ fontSize: isMobile ? 13 : 14, color: "#333" }}>{t("ui.steps", "Pasos")}:</strong>
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
                    {t("ui.created", "Creada")}: {new Date(receta.fechaCreacion || receta.createdAt).toLocaleDateString()}
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