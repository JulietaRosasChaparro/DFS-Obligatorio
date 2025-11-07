import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { textosInterfaz } from "../utils/traducciones";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 15px",
        backgroundColor: "#ff4d4f",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
        transition: "background 0.3s",
      }}
      onMouseOver={(e) => (e.target.style.background = "#d9363e")}
      onMouseOut={(e) => (e.target.style.background = "#ff4d4f")}
    >
      {textosInterfaz.cerrarSesion}
    </button>
  );
}