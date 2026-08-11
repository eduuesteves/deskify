import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import "./styles.scss";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/users", { name, email, password });

      alert("Conta criada com sucesso! Faça login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="brand-header">
          <h2>Crie sua conta</h2>
          <p>Preencha os dados abaixo para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="name">Nome completo</label>
            <input 
              id="name"
              type="text" 
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            {isLoading ? "Cadastrando..." : "Criar conta gratuita"}
          </button>
        </form>

        <span className="switch-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </span>
      </div>
    </div>
  );
}