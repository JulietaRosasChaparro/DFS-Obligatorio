export default function GraficoEstadisticas({ recetas = [] }) {
  const recetasData = recetas || [];

  // Calcular estadísticas por mes
  const estadisticasPorMes = recetasData.reduce((acc, receta) => {
    const fecha = new Date(receta.fechaCreacion || receta.createdAt);
    const mes = fecha.getMonth();
    const año = fecha.getFullYear();
    const clave = `${año}-${mes}`;
    
    if (!acc[clave]) {
      acc[clave] = 0;
    }
    acc[clave]++;
    return acc;
  }, {});

  const mesesConDatos = Object.keys(estadisticasPorMes);
  const maxRecetas = Math.max(...Object.values(estadisticasPorMes), 1);

  // Nombres de meses en español
  const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <div style={estiloContenedor}>
      <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>Estadísticas de recetas</h3>
      
      {recetasData.length === 0 ? (
        <div style={{ 
          padding: 30, 
          backgroundColor: "#f8f9fa", 
          borderRadius: 8,
          textAlign: "center",
          border: "1px solid #e9ecef"
        }}>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 10px 0" }}>
            🍳 No hay recetas aún
          </p>
          <p style={{ color: "#999", fontSize: 12, margin: 0 }}>
            Crea tu primera receta para ver las estadísticas
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Tarjetas de resumen */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 10
          }}>
            <div style={{ 
              textAlign: "center", 
              padding: 15, 
              backgroundColor: "#e7f3ff", 
              borderRadius: 8,
              border: "1px solid #cfe2ff"
            }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#0d6efd" }}>
                {recetasData.length}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 5 }}>Total recetas</div>
            </div>
            
            <div style={{ 
              textAlign: "center", 
              padding: 15, 
              backgroundColor: "#e6f7ed", 
              borderRadius: 8,
              border: "1px solid #d1e7dd"
            }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#198754" }}>
                {mesesConDatos.length}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 5 }}>Meses activos</div>
            </div>
          </div>

          {/* Gráfico de barras mejorado */}
          {mesesConDatos.length > 0 && (
            <div style={{ 
              padding: 15, 
              backgroundColor: "#f8f9fa", 
              borderRadius: 8,
              border: "1px solid #e9ecef"
            }}>
              <p style={{ 
                margin: "0 0 15px 0", 
                color: "#495057", 
                fontSize: 14, 
                fontWeight: "600",
                textAlign: "center"
              }}>
                Actividad por mes
              </p>
              
              <div style={{ 
                display: "flex", 
                alignItems: "end", 
                justifyContent: "space-between",
                height: 120,
                gap: 8,
                padding: "0 10px"
              }}>
                {mesesConDatos.slice(-6).map((mes, index) => {
                  const [año, mesNum] = mes.split('-');
                  const cantidad = estadisticasPorMes[mes];
                  const altura = (cantidad / maxRecetas) * 80;
                  const color = `hsl(${210 + index * 30}, 70%, 45%)`; // Azules progresivos
                  
                  return (
                    <div key={mes} style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      flex: 1,
                      gap: 5
                    }}>
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        justifyContent: "end",
                        height: 80
                      }}>
                        <div
                          style={{
                            height: `${altura}px`,
                            backgroundColor: color,
                            width: "70%",
                            borderRadius: "4px 4px 0 0",
                            minHeight: "3px",
                            transition: "height 0.3s ease",
                            position: "relative"
                          }}
                        >
                          {/* Etiqueta con cantidad */}
                          <div style={{
                            position: "absolute",
                            top: -25,
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#495057",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: "bold",
                            whiteSpace: "nowrap"
                          }}>
                            {cantidad}
                          </div>
                        </div>
                      </div>
                      
                      {/* Etiqueta del mes */}
                      <span style={{ 
                        fontSize: 11, 
                        color: "#6c757d", 
                        fontWeight: "500",
                        textAlign: "center"
                      }}>
                        {nombresMeses[parseInt(mesNum)]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div style={{ 
            padding: 15, 
            backgroundColor: "#fff3cd", 
            borderRadius: 8,
            border: "1px solid #ffeaa7"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>📊</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#856404", fontWeight: "500" }}>
                  Promedio mensual
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#997404" }}>
                  {mesesConDatos.length > 0 
                    ? `${(recetasData.length / mesesConDatos.length).toFixed(1)} recetas por mes`
                    : "Sin datos suficientes"
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
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