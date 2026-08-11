import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import "./styles.scss";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

 async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      await login(user, token);

      await navigate("/dashboard", { replace: true });

    } catch (error: any) {
      console.error("ERRO DETALHADO:", error);
      alert("Email ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-header">
          <h2>Bem-vindo de volta</h2>
          <p>Entre com suas credenciais para acessar o painel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar na plataforma"}
          </button>
        </form>

        <span className="switch-link">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </span>
      </div>
    </div>
  );
}