import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { traducirError, textosCarga, textosValidacion } from "../utils/traducciones";

import { API_ENDPOINTS } from '../config/api';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
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

    if (password !== repeatPassword) {
      setErrorMsg(textosValidacion.passwordsNoCoinciden);
      return;
    }

    if (password.length < 6) {
      setErrorMsg(textosValidacion.passwordCorta);
      return;
    }

    dispatch(loginStart());

    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error en el registro");
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

  const disabled = !username || !email || !password || !repeatPassword || password !== repeatPassword || loading;

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
        Registrarse
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          autoComplete="username"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          autoComplete="new-password"
          required
        />
        <input
          type="password"
          placeholder="Repetir contraseña"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          style={inputStyle}
          autoComplete="new-password"
          required
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
          {loading ? textosCarga.registrando : "Registrarse"}
        </button>
      </form>

      {errorMsg && (
        <p style={{ color: "red", fontSize: 14, marginTop: 10, textAlign: "center" }}>
          {errorMsg}
        </p>
      )}

      <p style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
        ¿Ya tenés cuenta? <Link to="/login" style={{ color: "#007bff" }}>Ingresar</Link>
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