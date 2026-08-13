import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import "./styles.scss";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isNameValid = name.trim().length >= 3;
  
  function isValidEmail(emailStr: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  }
  const isEmailValid = isValidEmail(email);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);

  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) {
      setErrorMessage("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/users", { name, email, password });

      setSuccessMessage("Conta criada com sucesso! Redirecionando...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.response?.data?.error || "Erro ao criar conta.");
      setIsLoading(false);
    }
  }

  return (
    <div className="register-container">
      {successMessage && (
        <div className="toast-success">
          <span className="toast-icon">✓</span>
          <p>{successMessage}</p>
        </div>
      )}

      <div className="register-card">
        <div className="brand-header">
          <h2>Crie sua conta</h2>
          <p>Preencha os dados abaixo para começar</p>
        </div>

        {errorMessage && (
          <div className="error-banner">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="name">Nome completo</label>
            <input 
              id="name"
              type="text" 
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || !!successMessage}
              className={name.length > 0 ? (isNameValid ? "input-valid" : "input-invalid") : ""}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || !!successMessage}
              className={email.length > 0 ? (isEmailValid ? "input-valid" : "input-invalid") : ""}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || !!successMessage}
              className={password.length > 0 ? (isPasswordValid ? "input-valid" : "input-invalid") : ""}
            />

            <div className="security-badges">
              <span className={`badge ${hasMinLength ? "met" : ""}`}>
                {hasMinLength && "✓ "}8+ caracteres
              </span>
              <span className={`badge ${hasUpper ? "met" : ""}`}>
                {hasUpper && "✓ "}Maiúscula
              </span>
              <span className={`badge ${hasLower ? "met" : ""}`}>
                {hasLower && "✓ "}Minúscula
              </span>
              <span className={`badge ${hasNumber ? "met" : ""}`}>
                {hasNumber && "✓ "}Número
              </span>
              <span className={`badge ${hasSpecial ? "met" : ""}`}>
                {hasSpecial && "✓ "}Especial
              </span>
            </div>
          </div>

          <button type="submit" disabled={!isFormValid || isLoading || !!successMessage}>
            {isLoading || successMessage ? "Processando..." : "Criar conta gratuita"}
          </button>
        </form>

        <span className="switch-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </span>
      </div>
    </div>
  );
}