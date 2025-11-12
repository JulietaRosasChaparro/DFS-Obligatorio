import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { validarImagen, comprimirImagen, crearUrlImagen } from "../utils/imageUtils";
import { API_ENDPOINTS } from "../config/api";
import { CLOUDINARY } from "../config/api";

export default function SubirImagen({ imagenActual, onImagenSubida }) {
  const [vistaPrevia, setVistaPrevia] = useState(imagenActual || "");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const referenciaArchivo = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    setVistaPrevia(imagenActual || "");
  }, [imagenActual]);

  const manejarSeleccionArchivo = async (archivo) => {
    try {
      setError("");
      setCargando(true);

      validarImagen(archivo);

      let archivoProcesado = archivo;
      if (archivo.size > 1024 * 1024) {
        archivoProcesado = await comprimirImagen(archivo, 0.7);
      }

      const urlTemp = crearUrlImagen(archivoProcesado);
      setVistaPrevia(urlTemp);

      const cloudName = CLOUDINARY.CLOUD_NAME;
      const uploadPreset = CLOUDINARY.UPLOAD_PRESET;

      const formData = new FormData();
      formData.append("file", archivoProcesado);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploaded = await res.json();
      if (!uploaded.secure_url) throw new Error(t("errors.images.updateError"));

      const token = localStorage.getItem("token");
      const resBackend = await fetch(API_ENDPOINTS.ACTUALIZAR_IMAGEN_PERFIL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imagenUrl: uploaded.secure_url,
          public_id: uploaded.public_id,
        }),
      });

      const data = await resBackend.json();
      if (!resBackend.ok) throw new Error(data.error || t("errors.images.updateError"));

      setVistaPrevia(uploaded.secure_url);
      if (onImagenSubida) onImagenSubida(uploaded.secure_url);
    } catch (err) {
      console.error(err);
      setError(t(`errors.${obtenerClaveError(err.message)}`, err.message));
      setVistaPrevia(imagenActual || "");
    } finally {
      setCargando(false);
    }
  };

  const obtenerClaveError = (mensajeError) => {
    if (!mensajeError) return "generic.somethingWrong";
    
    const mensaje = mensajeError.toLowerCase();
    
    if (mensaje.includes("formato de imagen no válido") || mensaje.includes("invalid image format")) {
      return "images.invalidFormat";
    }
    if (mensaje.includes("la imagen no puede ser mayor a 5mb") || mensaje.includes("image too large")) {
      return "images.tooLarge";
    }
    if (mensaje.includes("error al actualizar la imagen de perfil") || mensaje.includes("error updating profile image")) {
      return "images.updateError";
    }
    if (mensaje.includes("imagen no encontrada") || mensaje.includes("image not found")) {
      return "images.notFound";
    }
    if (mensaje.includes("no se puede procesar la imagen") || mensaje.includes("cannot process image")) {
      return "images.processingError";
    }
    
    return "generic.somethingWrong";
  };

  const manejarCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) manejarSeleccionArchivo(archivo);
  };

  const abrirSelector = () => {
    if (!cargando) referenciaArchivo.current?.click();
  };

  return (
    <div style={contenedor}>
      <div
        style={contenedorAvatar}
        className="avatar-contenedor"
        onClick={abrirSelector}
        title={t("ui.changeImage", "Cambiar foto")}
      >
        <input
          ref={referenciaArchivo}
          type="file"
          accept="image/*"
          onChange={manejarCambioArchivo}
          style={{ display: "none" }}
        />

        {cargando ? (
          <div style={spinner}></div>
        ) : vistaPrevia ? (
          <img src={vistaPrevia} alt="Perfil" style={avatarImagen} />
        ) : (
          <div style={avatarPlaceholder}>📷</div>
        )}

        <div className="overlay">
          <span className="texto-overlay">{t("ui.change", "Cambiar")}</span>
        </div>
      </div>

      {error && <p style={errorTexto}>⚠️ {error}</p>}

      <style>
        {`
          .avatar-contenedor {
            position: relative;
            width: 90px;
            height: 90px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #dcdcdc;
            background-color: #f8f9fa;
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          .avatar-contenedor:hover {
            transform: scale(1.05);
          }

          .avatar-contenedor .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100%;
            background: rgba(0, 0, 0, 0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            opacity: 0;
            transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
            backdrop-filter: blur(4px);
          }

          .avatar-contenedor:hover .overlay {
            opacity: 1;
            backdrop-filter: blur(8px);
          }

          .texto-overlay {
            font-size: 14px;
            font-weight: 500;
            opacity: 0.9;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

const contenedor = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 15,
};

const contenedorAvatar = {
  border: "2px solid #dcdcdc",
  borderRadius: "50%",
};

const avatarImagen = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const avatarPlaceholder = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f0f0f0",
  color: "#888",
  fontSize: 28,
};

const spinner = {
  width: 30,
  height: 30,
  border: "3px solid #eee",
  borderTop: "3px solid #999",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "30px auto",
};

const errorTexto = {
  color: "#dc3545",
  fontSize: 13,
  marginTop: 6,
};