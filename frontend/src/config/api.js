const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "https://dfs-obligatorio1.vercel.app";
  }
  return "http://localhost:3000";
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/v1/auth/login`,
  REGISTER: `${API_BASE_URL}/v1/auth/register`,

  // Usuarios
  UPDATE_PLAN: `${API_BASE_URL}/v1/usuarios/plan`,
  ACTUALIZAR_IMAGEN_PERFIL: `${API_BASE_URL}/v1/usuarios/imagen-perfil-url`,

  // Recetas
  RECETAS: `${API_BASE_URL}/v1/recetas`,
  RECETA_BY_ID: (id) => `${API_BASE_URL}/v1/recetas/${id}`,
};

  //Cloudinary
export const CLOUDINARY = {
  CLOUD_NAME: "dryz0gi43",
  UPLOAD_PRESET: "default_upload",
};
