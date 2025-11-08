import { useSelector } from "react-redux";

export default function GraficoEstadisticas({ recetas = [] }) {
  const { isMobile } = useSelector((state) => state.mobile);
  const recetasData = recetas || [];

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

  const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <div style={estiloContenedor(isMobile)}>
      <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: isMobile ? 16 : 18 }}>Estadísticas de recetas</h3>
      
      {recetasData.length === 0 ? (
        <div style={{ 
          padding: isMobile ? 20 : 30, 
          backgroundColor: "#f8f9fa", 
          borderRadius: 8,
          textAlign: "center",
          border: "1px solid #e9ecef"
        }}>
          <p style={{ color: "#666", fontSize: isMobile ? 13 : 14, margin: "0 0 10px 0" }}>
            🍳 No hay recetas aún
          </p>
          <p style={{ color: "#999", fontSize: isMobile ? 12 : 12, margin: 0 }}>
            Crea tu primera receta para ver las estadísticas
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 15 : 20 }}>
          
          {/* Tarjetas de resumen */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: isMobile ? 8 : 10
          }}>
            <div style={{ 
              textAlign: "center", 
              padding: isMobile ? 12 : 15, 
              backgroundColor: "#e7f3ff", 
              borderRadius: 8,
              border: "1px solid #cfe2ff"
            }}>
              <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: "bold", color: "#0d6efd" }}>
                {recetasData.length}
              </div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: "#666", marginTop: 5 }}>Total recetas</div>
            </div>
            
            <div style={{ 
              textAlign: "center", 
              padding: isMobile ? 12 : 15, 
              backgroundColor: "#e6f7ed", 
              borderRadius: 8,
              border: "1px solid #d1e7dd"
            }}>
              <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: "bold", color: "#198754" }}>
                {mesesConDatos.length}
              </div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: "#666", marginTop: 5 }}>Meses activos</div>
            </div>
          </div>

          {/* Gráfico de barras mejorado */}
          {mesesConDatos.length > 0 && (
            <div style={{ 
              padding: isMobile ? 12 : 15, 
              backgroundColor: "#f8f9fa", 
              borderRadius: 8,
              border: "1px solid #e9ecef"
            }}>
              <p style={{ 
                margin: "0 0 12px 0", 
                color: "#495057", 
                fontSize: isMobile ? 13 : 14, 
                fontWeight: "600",
                textAlign: "center"
              }}>
                Actividad por mes
              </p>
              
              <div style={{ 
                display: "flex", 
                alignItems: "end", 
                justifyContent: "space-between",
                height: isMobile ? 100 : 120,
                gap: isMobile ? 6 : 8,
                padding: "0 5px"
              }}>
                {mesesConDatos.slice(-6).map((mes, index) => {
                  const [año, mesNum] = mes.split('-');
                  const cantidad = estadisticasPorMes[mes];
                  const altura = (cantidad / maxRecetas) * (isMobile ? 60 : 80);
                  const color = `hsl(${210 + index * 30}, 70%, 45%)`;
                  
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
                        height: isMobile ? 60 : 80
                      }}>
                        <div
                          style={{
                            height: `${altura}px`,
                            backgroundColor: color,
                            width: isMobile ? "60%" : "70%",
                            borderRadius: "4px 4px 0 0",
                            minHeight: "3px",
                            transition: "height 0.3s ease",
                            position: "relative"
                          }}
                        >
                          {/* Etiqueta con cantidad */}
                          <div style={{
                            position: "absolute",
                            top: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#495057",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: isMobile ? 9 : 10,
                            fontWeight: "bold",
                            whiteSpace: "nowrap"
                          }}>
                            {cantidad}
                          </div>
                        </div>
                      </div>
                      
                      {/* Etiqueta del mes */}
                      <span style={{ 
                        fontSize: isMobile ? 10 : 11, 
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
            padding: isMobile ? 12 : 15, 
            backgroundColor: "#fff3cd", 
            borderRadius: 8,
            border: "1px solid #ffeaa7"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: isMobile ? 14 : 16 }}>📊</span>
              <div>
                <p style={{ margin: 0, fontSize: isMobile ? 12 : 12, color: "#856404", fontWeight: "500" }}>
                  Promedio mensual
                </p>
                <p style={{ margin: 0, fontSize: isMobile ? 11 : 11, color: "#997404" }}>
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

const estiloContenedor = (isMobile) => ({
  padding: isMobile ? 15 : 20,
  border: "1px solid #ddd",
  borderRadius: 12,
  backgroundColor: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
});