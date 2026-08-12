import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import "./styles.scss";

export function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const token = localStorage.getItem("@deskify:token");
      const response = await api.patch("/users", 
        { name, photo },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUser = response.data.user;

      if (token) {
        login(updatedUser, token);
      }

      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao atualizar o perfil.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="profile-layout">
      <header className="profile-header">
        <h1>Deskify</h1>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          Voltar ao Dashboard
        </button>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          <h2>Meu Perfil</h2>
          <p>Gerencie suas informações pessoais</p>

          <form onSubmit={handleUpdate} className="profile-form">
            <div className="avatar-section">
              <img 
                src={photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} 
                alt={name} 
              />
            </div>

            <div className="input-group">
              <label htmlFor="name">Nome completo</label>
              <input 
                id="name"
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">E-mail (não editável)</label>
              <input 
                id="email"
                type="email" 
                value={email}
                disabled 
              />
            </div>

            <div className="input-group">
              <label htmlFor="photo">URL da Foto de Perfil</label>
              <input 
                id="photo"
                type="text" 
                placeholder="https://exemplo.com/foto.jpg"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}