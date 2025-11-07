// Sistema completo de traducciones para la aplicación
export const traducirError = (mensajeError) => {
  if (!mensajeError) return "Error desconocido";
  
  const mensaje = mensajeError.toLowerCase();
  
  // ===== ERRORES DE AUTENTICACIÓN =====
  if (mensaje.includes('invalid credentials') || mensaje.includes('invalid password')) {
    return "Usuario o contraseña incorrectos";
  }
  
  if (mensaje.includes('user not found') || mensaje.includes('usuario no encontrado')) {
    return "Usuario no encontrado";
  }
  
  if (mensaje.includes('incorrect password')) {
    return "Contraseña incorrecta";
  }
  
  if (mensaje.includes('token') && mensaje.includes('invalid')) {
    return "Sesión inválida. Por favor, inicia sesión nuevamente";
  }
  
  if (mensaje.includes('token') && mensaje.includes('expired')) {
    return "Sesión expirada. Por favor, inicia sesión nuevamente";
  }
  
  if (mensaje.includes('unauthorized') || mensaje.includes('no autorizado')) {
    return "No autorizado. Por favor, inicia sesión";
  }
  
  if (mensaje.includes('authentication failed')) {
    return "Error de autenticación";
  }

  // ===== ERRORES DE REGISTRO =====
  if (mensaje.includes('username already exists') || mensaje.includes('usuario ya existe')) {
    return "El nombre de usuario ya está en uso";
  }
  
  if (mensaje.includes('email already exists') || mensaje.includes('email ya existe')) {
    return "El email ya está registrado";
  }
  
  if (mensaje.includes('username is required') || mensaje.includes('username required')) {
    return "El nombre de usuario es requerido";
  }
  
  if (mensaje.includes('email is required') || mensaje.includes('email required')) {
    return "El email es requerido";
  }
  
  if (mensaje.includes('password is required') || mensaje.includes('password required')) {
    return "La contraseña es requerida";
  }
  
  if (mensaje.includes('invalid email') || mensaje.includes('email inválido')) {
    return "El formato del email es inválido";
  }
  
  if (mensaje.includes('password too short') || mensaje.includes('contraseña muy corta')) {
    return "La contraseña debe tener al menos 6 caracteres";
  }

  // ===== ERRORES DE RECETAS =====
  if (mensaje.includes('límite') && mensaje.includes('recetas')) {
    return "Has alcanzado el límite de recetas para tu plan. Actualiza a Premium para recetas ilimitadas.";
  }
  
  if (mensaje.includes('recipe not found') || mensaje.includes('receta no encontrada')) {
    return "Receta no encontrada";
  }
  
  if (mensaje.includes('not authorized') || mensaje.includes('no autorizado')) {
    return "No tienes permisos para realizar esta acción";
  }
  
  if (mensaje.includes('title is required') || mensaje.includes('título requerido')) {
    return "El título de la receta es requerido";
  }
  
  if (mensaje.includes('ingredients are required') || mensaje.includes('ingredientes requeridos')) {
    return "Los ingredientes son requeridos";
  }
  
  if (mensaje.includes('steps are required') || mensaje.includes('pasos requeridos')) {
    return "Los pasos de preparación son requeridos";
  }

  // ===== ERRORES DE PLANES =====
  if (mensaje.includes('solo se puede cambiar de plan plus a premium')) {
    return "Solo puedes cambiar de plan Plus a Premium";
  }
  
  if (mensaje.includes('ya tienes plan premium')) {
    return "Ya tienes plan Premium";
  }
  
  if (mensaje.includes('plan upgrade not allowed')) {
    return "No puedes cambiar de plan en este momento";
  }

  // ===== ERRORES DE VALIDACIÓN =====
  if (mensaje.includes('validation failed')) {
    return "Error de validación en los datos enviados";
  }
  
  if (mensaje.includes('required field')) {
    return "Campo requerido faltante";
  }
  
  if (mensaje.includes('invalid input')) {
    return "Datos de entrada inválidos";
  }

  // ===== ERRORES DE CONEXIÓN/SERVIDOR =====
  if (mensaje.includes('network') || mensaje.includes('failed to fetch')) {
    return "Error de conexión. Verifica tu internet e intenta nuevamente.";
  }
  
  if (mensaje.includes('timeout') || mensaje.includes('timed out')) {
    return "El servidor tardó demasiado en responder. Intenta nuevamente.";
  }
  
  if (mensaje.includes('internal server error')) {
    return "Error interno del servidor. Por favor, intenta más tarde.";
  }
  
  if (mensaje.includes('service unavailable')) {
    return "Servicio no disponible temporalmente";
  }
  
  if (mensaje.includes('bad request')) {
    return "Solicitud incorrecta. Verifica los datos enviados.";
  }
  
  if (mensaje.includes('not found') || mensaje.includes('404')) {
    return "Recurso no encontrado";
  }
  
  if (mensaje.includes('forbidden') || mensaje.includes('403')) {
    return "Acceso denegado";
  }

  // ===== ERRORES DE BASE DE DATOS =====
  if (mensaje.includes('database') || mensaje.includes('mongodb')) {
    return "Error de base de datos. Por favor, intenta más tarde.";
  }
  
  if (mensaje.includes('duplicate key')) {
    return "Ya existe un registro con esos datos";
  }

  // ===== ERRORES GENÉRICOS =====
  if (mensaje.includes('something went wrong')) {
    return "Algo salió mal. Por favor, intenta nuevamente.";
  }
  
  if (mensaje.includes('unexpected error')) {
    return "Error inesperado. Por favor, contacta al soporte.";
  }

  // Si no coincide con ningún patrón conocido, devolver el mensaje original pero capitalizado
  return capitalizarPrimeraLetra(mensajeError);
};

// Función helper para capitalizar la primera letra
const capitalizarPrimeraLetra = (texto) => {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

// Traducciones para estados de carga
export const textosCarga = {
  cargando: "Cargando...",
  procesando: "Procesando...",
  creando: "Creando...",
  guardando: "Guardando...",
  eliminando: "Eliminando...",
  actualizando: "Actualizando...",
  registrando: "Registrando...",
  ingresando: "Ingresando...",
  subiendo: "Subiendo...",
  descargando: "Descargando..."
};

// Traducciones para mensajes de éxito
export const textosExito = {
  registro: "¡Registro exitoso! Redirigiendo...",
  login: "¡Inicio de sesión exitoso!",
  recetaCreada: "¡Receta creada exitosamente!",
  recetaActualizada: "¡Receta actualizada exitosamente!",
  recetaEliminada: "Receta eliminada exitosamente",
  planActualizado: "¡Plan actualizado a Premium exitosamente!",
  cambiosGuardados: "Cambios guardados exitosamente",
  accionCompletada: "Acción completada exitosamente",
  perfilActualizado: "Perfil actualizado exitosamente"
};

// Traducciones para mensajes de validación
export const textosValidacion = {
  campoRequerido: "Este campo es requerido",
  emailInvalido: "El formato del email es inválido",
  passwordCorta: "La contraseña debe tener al menos 6 caracteres",
  passwordsNoCoinciden: "Las contraseñas no coinciden",
  usuarioRequerido: "El nombre de usuario es requerido",
  tituloRequerido: "El título es requerido",
  ingredientesRequeridos: "Los ingredientes son requeridos",
  pasosRequeridos: "Los pasos de preparación son requeridos"
};

// Traducciones para textos de interfaz
export const textosInterfaz = {
  bienvenido: "Bienvenido",
  cerrarSesion: "Cerrar sesión",
  miPerfil: "Mi perfil",
  configuracion: "Configuración",
  buscar: "Buscar...",
  filtrar: "Filtrar",
  ordenar: "Ordenar",
  verTodo: "Ver todo",
  verMas: "Ver más",
  verMenos: "Ver menos",
  aceptar: "Aceptar",
  cancelar: "Cancelar",
  confirmar: "Confirmar",
  continuar: "Continuar",
  atras: "Atrás",
  siguiente: "Siguiente",
  finalizar: "Finalizar"
};

// Traducciones para confirmaciones
export const textosConfirmacion = {
  eliminarReceta: "¿Estás seguro de que quieres eliminar esta receta?",
  eliminarCuenta: "¿Estás seguro de que quieres eliminar tu cuenta?",
  cambiarPlan: "¿Estás seguro de que quieres cambiar a plan Premium?",
  salirSinGuardar: "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
};