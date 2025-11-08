import { useSelector } from "react-redux";

export default function InformeUso({ recetas = [], userPlan }) {
  const { isMobile } = useSelector((state) => state.mobile);
  const recetasData = recetas || [];
  
  const totalRecetas = recetasData.length;
  const recetasEsteMes = recetasData.filter(receta => {
    const fechaReceta = new Date(receta.fechaCreacion || receta.createdAt);
    const now = new Date();
    return fechaReceta.getMonth() === now.getMonth() && fechaReceta.getFullYear() === now.getFullYear();
  }).length;

  const usoActual = userPlan === "plus" ? (totalRecetas / 10) * 100 : 100;

  return (
    <div style={estiloContenedor(isMobile)}>
      <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: isMobile ? 16 : 18 }}>Informe de uso</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 15 : 20 }}>
        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: isMobile ? 13 : 14, color: "#666" }}>
            Uso del plan {userPlan?.toUpperCase()}: {totalRecetas} {userPlan === "plus" ? `/ 10 recetas` : "recetas"}
          </h4>
          <div style={{ 
            background: "#e9ecef", 
            borderRadius: 10, 
            height: isMobile ? 16 : 20,
            overflow: "hidden"
          }}>
            <div 
              style={{ 
                background: userPlan === "premium" ? "#28a745" : "#007bff",
                height: "100%",
                width: `${userPlan === "premium" ? 100 : usoActual}%`,
                transition: "width 0.3s ease",
                borderRadius: 10
              }}
            />
          </div>
          <p style={{ fontSize: isMobile ? 11 : 12, color: "#666", margin: "5px 0 0 0" }}>
            {userPlan === "plus" 
              ? `${10 - totalRecetas} recetas disponibles`
              : "Recetas ilimitadas"
            }
          </p>
        </div>

        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: isMobile ? 13 : 14, color: "#666" }}>
            Actividad del mes
          </h4>
          <div style={{ 
            fontSize: isMobile ? 22 : 24, 
            fontWeight: "bold", 
            color: "#17a2b8",
            textAlign: "center"
          }}>
            {recetasEsteMes}
          </div>
          <p style={{ fontSize: isMobile ? 11 : 12, color: "#666", textAlign: "center", margin: "5px 0 0 0" }}>
            recetas creadas
          </p>
        </div>

        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: isMobile ? 13 : 14, color: "#666" }}>
            Estadísticas
          </h4>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: isMobile ? 11 : 12, 
            color: "#666" 
          }}>
            <span>Total: {totalRecetas}</span>
            <span>Este mes: {recetasEsteMes}</span>
          </div>
        </div>
      </div>
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