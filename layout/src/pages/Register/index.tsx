import React, { useState } from 'react';
import { api } from '../../services/api';
import './styles.scss'; // Renomeie seu arquivo de estilo e mova para esta pasta

export function Register() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (name && email && password) {
      try {
        setIsLoading(true);
        
        const response = await api.post("/register", {
          name: name,
          email: email,
          password: password
        });

        console.log("Usuário criado: ", response.data);
        alert("Conta criada com sucesso!");
        
        setName("");
        setEmail("");
        setPassword("");
      } catch (error) {
        console.error("Erro ao registrar: ", error);
        alert("Erro ao criar conta. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Criar Conta</h2>
        <p>Cadastre-se para começar a gerenciar seus chamados.</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="name">Nome completo</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="Ex: José Eduardo" required /> 
          </div>
          <div className="input-group">
            <label htmlFor="email">E-mail corporativo</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} placeholder="eduardo@empresa.com" required /> 
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} placeholder="Crie uma senha forte" required /> 
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}