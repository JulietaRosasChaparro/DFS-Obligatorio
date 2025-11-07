import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { traducirError, textosCarga, textosValidacion } from "../utils/traducciones";

import { API_ENDPOINTS } from '../config/api';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Usuario y contraseña son requeridos");
      return;
    }

    dispatch(loginStart());

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const errorTraducido = traducirError(err.message);
      dispatch(loginFailure(errorTraducido));
      setErrorMsg(errorTraducido);
    }
  };

  const disabled = !username || !password || loading;

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 25, color: "#333" }}>
        Iniciar sesión
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={disabled}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: disabled ? "#ddd" : "#007bff",
            color: disabled ? "#aaa" : "#fff",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
        >
          {loading ? textosCarga.ingresando : "Ingresar"}
        </button>
      </form>

      {errorMsg && (
        <p style={{ color: "red", fontSize: 14, marginTop: 10, textAlign: "center" }}>
          {errorMsg}
        </p>
      )}

      <p style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
        ¿No tenés cuenta? <Link to="/register" style={{ color: "#007bff" }}>Registrarse</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
  fontFamily: "inherit",
  transition: "border-color 0.3s ease"
};