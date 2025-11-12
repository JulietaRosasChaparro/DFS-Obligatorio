import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../config/api";

export default function FormularioReceta({ onRecetaAdded, currentRecetaCount, userPlan }) {
  const { isMobile } = useSelector((state) => state.mobile);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [pasos, setPasos] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const { t } = useTranslation();

  const getMaxRecetas = () => {
    switch(userPlan) {
      case "premium": return Infinity;
      case "plus": return 10;
      default: return 10;
    }
  };

  const puedeAgregarReceta = currentRecetaCount < getMaxRecetas();

  const mostrarMensaje = (texto, tipo = "error") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 5000);
  };

  const parsearIngredientes = (textoIngredientes) => {
    return textoIngredientes.split('\n')
      .map(linea => linea.trim())
      .filter(linea => linea)
      .map(linea => {
        const partes = linea.split(' ');
        if (partes.length >= 3) {
          const cantidad = parseFloat(partes[0]);
          const unidad = partes[1];
          const nombre = partes.slice(2).join(' ');
          
          if (!isNaN(cantidad) && unidad && nombre) {
            return { nombre, cantidad, unidad };
          }
        }
        return { 
          nombre: linea, 
          cantidad: 1, 
          unidad: "unidad" 
        };
      });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!puedeAgregarReceta) {
      mostrarMensaje(t("errors.recipes.limitReached"));
      return;
    }

    if (!titulo.trim()) {
      mostrarMensaje(t("validation.titleRequired"));
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const datosReceta = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        ingredientes: parsearIngredientes(ingredientes),
        pasos: pasos.split('\n').map(paso => paso.trim()).filter(paso => paso),
        tiempoPreparacion: 30,
        dificultad: "Fácil"
      };

      const res = await fetch(API_ENDPOINTS.RECETAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosReceta)
      });

      const responseText = await res.text();

      if (!responseText) {
        if (res.ok) {
          throw new Error("Respuesta vacía del servidor");
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
      
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      onRecetaAdded(data);
      setTitulo("");
      setDescripcion("");
      setIngredientes("");
      setPasos("");
      mostrarMensaje(t("success.recipeCreated"), "success");
      
    } catch (err) {
      const errorTraducido = t(`errors.${obtenerClaveError(err.message)}`, err.message);
      mostrarMensaje(errorTraducido);
    } finally {
      setCargando(false);
    }
  };

  const obtenerClaveError = (mensajeError) => {
    if (!mensajeError) return "generic.somethingWrong";
    
    const mensaje = mensajeError.toLowerCase();
    
    if (mensaje.includes("límite") && mensaje.includes("recetas")) {
      return "recipes.limitReached";
    }
    if (mensaje.includes("recipe not found") || mensaje.includes("receta no encontrada")) {
      return "recipes.notFound";
    }
    if (mensaje.includes("not authorized") || mensaje.includes("no autorizado")) {
      return "auth.unauthorized";
    }
    if (mensaje.includes("title is required") || mensaje.includes("título requerido")) {
      return "validation.titleRequired";
    }
    if (mensaje.includes("ingredients are required") || mensaje.includes("ingredientes requeridos")) {
      return "validation.ingredientsRequired";
    }
    if (mensaje.includes("steps are required") || mensaje.includes("pasos requeridos")) {
      return "validation.stepsRequired";
    }
    
    return "generic.somethingWrong";
  };

  if (!puedeAgregarReceta) {
    return (
      <div style={estiloContenedor(isMobile)}>
        <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: isMobile ? 16 : 18 }}>Agregar Receta</h3>
        <div style={{
          padding: isMobile ? "12px 16px" : "14px 20px",
          borderRadius: 8,
          backgroundColor: "#f8d7da",
          border: "1px solid #f5c6cb",
          color: "#721c24",
          fontSize: isMobile ? 13 : 14
        }}>
          {userPlan === "plus" 
            ? t("errors.recipes.limitReached")
            : "No se pueden agregar más recetas."
          }
        </div>
      </div>
    );
  }

  const mostrarContador = userPlan === "plus" ? `${currentRecetaCount}/10 ${t("ui.recipes", "recetas")}` : `${currentRecetaCount} ${t("ui.recipes", "recetas")}`;

  return (
    <div style={estiloContenedor(isMobile)}>
      <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: isMobile ? 16 : 18 }}>Agregar nueva receta</h3>
      
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

      <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 15 }}>
        <input
          type="text"
          placeholder={t("ui.recipeTitle", "Título de la receta")}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={estiloInput(isMobile)}
          required
        />
        
        <textarea
          placeholder={t("ui.recipeDescription", "Descripción de la receta")}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{ ...estiloInput(isMobile), minHeight: isMobile ? 60 : 80, resize: "vertical" }}
        />

        <div>
          <label style={{ fontSize: isMobile ? 13 : 14, color: "#666", marginBottom: 8, display: "block" }}>
            {t("ui.ingredientsLabel", "Ingredientes (uno por línea, formato: \"cantidad unidad nombre\")")}
          </label>
          <textarea
            placeholder={`200 g harina\n2 cucharadas azúcar\n3 unidades huevos\n1 taza leche`}
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            style={{ ...estiloInput(isMobile), minHeight: isMobile ? 100 : 120, resize: "vertical" }}
          />
          <p style={{ fontSize: isMobile ? 11 : 12, color: "#666", margin: "5px 0 0 0" }}>
            {t("ui.ingredientsExample", "Ejemplo: \"200 g harina\" o \"2 cucharadas azúcar\"")}
          </p>
        </div>

        <textarea
          placeholder={t("ui.preparationSteps", "Pasos de preparación (uno por línea)")}
          value={pasos}
          onChange={(e) => setPasos(e.target.value)}
          style={{ ...estiloInput(isMobile), minHeight: isMobile ? 80 : 100, resize: "vertical" }}
        />

        <button
          type="submit"
          disabled={cargando || !titulo.trim()}
          style={{
            padding: isMobile ? "14px" : "12px",
            borderRadius: 8,
            border: "none",
            background: cargando || !titulo.trim() ? "#ddd" : "#28a745",
            color: cargando || !titulo.trim() ? "#aaa" : "#fff",
            cursor: cargando || !titulo.trim() ? "not-allowed" : "pointer",
            fontSize: isMobile ? 14 : 14,
            fontWeight: "600",
            transition: "all 0.3s ease",
            minHeight: "44px"
          }}
        >
          {cargando ? t("loading.creating") : "🍳 " + t("ui.createRecipe", "Crear Receta")}
        </button>

        <p style={{ fontSize: isMobile ? 11 : 12, color: "#666", margin: 0, textAlign: "center" }}>
          {mostrarContador} ({t("ui.plan", "Plan")} {userPlan})
          {userPlan === "plus" && currentRecetaCount >= 8 && (
            <span style={{ color: "#dc3545", display: "block", marginTop: 5 }}>
              ⚠️ {t("info.nearLimit", "Cerca del límite")} ({10 - currentRecetaCount} {t("ui.remaining", "restantes")})
            </span>
          )}
        </p>
      </form>
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

const estiloInput = (isMobile) => ({
  padding: isMobile ? 12 : 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: isMobile ? 14 : 14,
  fontFamily: "inherit",
  transition: "border-color 0.3s ease"
});