export const validarImagen = (archivo) => {
  const tiposValidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const tamañoMaximo = 5 * 1024 * 1024; // 5MB

  if (!tiposValidos.includes(archivo.type)) {
    throw new Error('Formato de imagen no válido. Use JPEG, PNG, GIF o WebP');
  }

  if (archivo.size > tamañoMaximo) {
    throw new Error('La imagen no puede ser mayor a 5MB');
  }

  return true;
};

export const comprimirImagen = (archivo, calidad = 0.8) => {
  return new Promise((resolve) => {
    const lector = new FileReader();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    lector.onload = (evento) => {
      const img = new Image();
      img.onload = () => {
        const ANCHO_MAXIMO = 1200;
        const ALTO_MAXIMO = 1200;
        let { width, height } = img;

        if (width > height) {
          if (width > ANCHO_MAXIMO) {
            height *= ANCHO_MAXIMO / width;
            width = ANCHO_MAXIMO;
          }
        } else {
          if (height > ALTO_MAXIMO) {
            width *= ALTO_MAXIMO / height;
            height = ALTO_MAXIMO;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/jpeg',
          calidad
        );
      };
      img.src = evento.target.result;
    };

    lector.readAsDataURL(archivo);
  });
};

export const crearUrlImagen = (archivo) => {
  return URL.createObjectURL(archivo);
};