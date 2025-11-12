import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS } from '../config/api';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { isMobile } = useSelector((state) => state.mobile);
  const { t } = useTranslation();

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
      setErrorMsg(t("validation.required"));
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
        throw new Error(data.error || t("errors.generic.somethingWrong"));
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const errorTraducido = t(`errors.${obtenerClaveError(err.message)}`, err.message);
      dispatch(loginFailure(errorTraducido));
      setErrorMsg(errorTraducido);
    }
  };

  const obtenerClaveError = (mensajeError) => {
    if (!mensajeError) return "generic.somethingWrong";
    
    const mensaje = mensajeError.toLowerCase();
    
    if (mensaje.includes('invalid credentials') || mensaje.includes('invalid password')) {
      return "auth.invalidCredentials";
    }
    if (mensaje.includes('user not found') || mensaje.includes('usuario no encontrado')) {
      return "auth.userNotFound";
    }
    if (mensaje.includes('incorrect password')) {
      return "auth.incorrectPassword";
    }
    if (mensaje.includes('unauthorized') || mensaje.includes('no autorizado')) {
      return "auth.unauthorized";
    }
    
    return "generic.somethingWrong";
  };

  const disabled = !username || !password || loading;

  return (
    <div
      style={{
        maxWidth: isMobile ? "90%" : 400,
        margin: isMobile ? "40px auto" : "80px auto",
        padding: isMobile ? 20 : 30,
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: 25, 
        color: "#333",
        fontSize: isMobile ? 20 : 24
      }}>
        {t("ui.login", "Iniciar sesión")}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 15 }}>
        <input
          placeholder={t("ui.username", "Usuario")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle(isMobile)}
        />
        <input
          type="password"
          placeholder={t("ui.password", "Contraseña")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle(isMobile)}
        />

        <button
          type="submit"
          disabled={disabled}
          style={{
            padding: isMobile ? "14px" : 12,
            borderRadius: 8,
            border: "none",
            background: disabled ? "#ddd" : "#007bff",
            color: disabled ? "#aaa" : "#fff",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: isMobile ? 15 : 14,
            fontWeight: "600",
            transition: "all 0.3s ease",
            minHeight: "44px"
          }}
        >
          {loading ? t("loading.loggingIn") : t("ui.login", "Ingresar")}
        </button>
      </form>

      {errorMsg && (
        <p style={{ 
          color: "red", 
          fontSize: isMobile ? 13 : 14, 
          marginTop: 10, 
          textAlign: "center" 
        }}>
          {errorMsg}
        </p>
      )}

      <p style={{ 
        marginTop: 20, 
        textAlign: "center", 
        fontSize: isMobile ? 13 : 14 
      }}>
        {t("ui.noAccount", "¿No tenés cuenta?")} <Link to="/register" style={{ color: "#007bff" }}>{t("ui.register", "Registrarse")}</Link>
      </p>
    </div>
  );
}

const inputStyle = (isMobile) => ({
  padding: isMobile ? 14 : 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: isMobile ? 15 : 14,
  fontFamily: "inherit",
  transition: "border-color 0.3s ease",
  minHeight: "44px"
});