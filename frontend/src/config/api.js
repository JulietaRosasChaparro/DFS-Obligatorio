// Configuración de API URLs
const getApiBaseUrl = () => {
  // En producción, usa tu backend en Vercel
  if (import.meta.env.PROD) {
    return 'https://dfs-obligatorio1.vercel.app';
  }
  // En desarrollo, usa localhost
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/v1/auth/login`,
  REGISTER: `${API_BASE_URL}/v1/auth/register`,
  
  // Usuarios
  UPDATE_PLAN: `${API_BASE_URL}/v1/usuarios/plan`,
  
  // Recetas
  RECETAS: `${API_BASE_URL}/v1/recetas`,
  RECETA_BY_ID: (id) => `${API_BASE_URL}/v1/recetas/${id}`,
};

console.log('🔧 API Base URL:', API_BASE_URL);