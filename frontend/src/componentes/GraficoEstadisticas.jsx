import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function GraficoEstadisticas({ recetas = [] }) {
  const { isMobile } = useSelector((state) => state.mobile);
  const { t } = useTranslation();
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
      <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: isMobile ? 16 : 18 }}>
        Estadísticas de recetas
      </h3>
      
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

          {mesesConDatos.length > 0 && (
            <div style={{ 
              padding: isMobile ? 15 : 20, 
              backgroundColor: "#f8f9fa", 
              borderRadius: 8,
              border: "1px solid #e9ecef"
            }}>
              <p style={{ 
                margin: "0 0 15px 0", 
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
                height: isMobile ? 120 : 150,
                gap: isMobile ? 8 : 12,
                padding: "0 5px",
                position: "relative"
              }}>

                {[0, 1, 2, 3, 4].map((line) => (
                  <div 
                    key={line}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: `${(line / 4) * 100}%`,
                      height: "1px",
                      backgroundColor: "#e0e0e0",
                      zIndex: 0
                    }}
                  />
                ))}
                
                {mesesConDatos.slice(-6).map((mes, index) => {
                  const [año, mesNum] = mes.split('-');
                  const cantidad = estadisticasPorMes[mes];
                  const altura = (cantidad / maxRecetas) * (isMobile ? 80 : 100);
                  const color = `hsl(${210 + index * 20}, 70%, 50%)`;
                  
                  return (
                    <div key={mes} style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      flex: 1,
                      gap: 8,
                      zIndex: 1
                    }}>
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center",
                        justifyContent: "end",
                        height: isMobile ? 80 : 100,
                        width: "100%"
                      }}>
                        <div
                          style={{
                            height: `${altura}px`,
                            backgroundColor: color,
                            width: isMobile ? "70%" : "80%",
                            borderRadius: "4px 4px 0 0",
                            minHeight: "8px",
                            transition: "height 0.3s ease",
                            position: "relative",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                          }}
                        >
                          <div style={{
                            position: "absolute",
                            top: -25,
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#495057",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontSize: isMobile ? 10 : 11,
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                          }}>
                            {cantidad}
                          </div>
                        </div>
                      </div>

                      <span style={{ 
                        fontSize: isMobile ? 11 : 12, 
                        color: "#495057", 
                        fontWeight: "600",
                        textAlign: "center"
                      }}>
                        {nombresMeses[parseInt(mesNum)]}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div style={{
                height: "1px",
                backgroundColor: "#adb5bd",
                marginTop: "10px",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: -15,
                  fontSize: isMobile ? 9 : 10,
                  color: "#6c757d"
                }}>
                  Meses →
                </div>
              </div>
            </div>
          )}

          <div style={{ 
            padding: isMobile ? 12 : 15, 
            backgroundColor: "#fff3cd", 
            borderRadius: 8,
            border: "1px solid #ffeaa7",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <span style={{ fontSize: isMobile ? 16 : 18 }}>📊</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: isMobile ? 12 : 13, color: "#856404", fontWeight: "500" }}>
                Promedio mensual
              </p>
              <p style={{ margin: 0, fontSize: isMobile ? 14 : 16, color: "#997404", fontWeight: "bold" }}>
                {mesesConDatos.length > 0 
                  ? `${(recetasData.length / mesesConDatos.length).toFixed(1)} recetas por mes`
                  : "Sin datos suficientes"
                }
              </p>
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