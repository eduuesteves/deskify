import React, { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(email && password) {
            try {
                setIsLoading(true);

                const response = await api.post("/login", {
                    email: email,
                    password: password
                });

                console.log("Usuário logado com sucesso: ", response.data);

                navigate("/dashboard")
            } catch(error) {
                console.error("Erro ao logar: ", error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Entrar</h2>
                <p>Acesse sua cotna para gerenciar seus chamados.</p>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <label htmlFor="email">E-mail corporativo</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            placeholder="eduardo@empresa.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    )
}