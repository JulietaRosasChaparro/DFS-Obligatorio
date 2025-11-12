import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { API_ENDPOINTS } from '../config/api';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
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

    if (password !== repeatPassword) {
      setErrorMsg(t("validation.passwordsDontMatch"));
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t("validation.shortPassword"));
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
    
    if (mensaje.includes('username already exists') || mensaje.includes('usuario ya existe')) {
      return "register.usernameExists";
    }
    if (mensaje.includes('email already exists') || mensaje.includes('email ya existe')) {
      return "register.emailExists";
    }
    if (mensaje.includes('username is required') || mensaje.includes('username required')) {
      return "register.usernameRequired";
    }
    if (mensaje.includes('email is required') || mensaje.includes('email required')) {
      return "register.emailRequired";
    }
    if (mensaje.includes('password is required') || mensaje.includes('password required')) {
      return "register.passwordRequired";
    }
    if (mensaje.includes('invalid email') || mensaje.includes('email inválido')) {
      return "register.invalidEmail";
    }
    
    return "generic.somethingWrong";
  };

  const disabled = !username || !email || !password || !repeatPassword || password !== repeatPassword || loading;

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
        {t("ui.register", "Registrarse")}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 15 }}>
        <input
          placeholder={t("ui.username", "Nombre de usuario")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle(isMobile)}
          autoComplete="username"
          required
        />
        <input
          type="email"
          placeholder={t("ui.email", "Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle(isMobile)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder={t("ui.password", "Contraseña")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle(isMobile)}
          autoComplete="new-password"
          required
        />
        <input
          type="password"
          placeholder={t("ui.repeatPassword", "Repetir contraseña")}
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          style={inputStyle(isMobile)}
          autoComplete="new-password"
          required
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
          {loading ? t("loading.registering") : t("ui.register", "Registrarse")}
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
        {t("ui.haveAccount", "¿Ya tenés cuenta?")} <Link to="/login" style={{ color: "#007bff" }}>{t("ui.login", "Ingresar")}</Link>
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