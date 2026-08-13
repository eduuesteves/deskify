import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import "./styles.scss";

export function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Estados de dados do perfil
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Estados para alteração de senha
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  // Estados para mostrar/ocultar senhas
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Mensagens globais de feedback
  const [message, setMessage] = useState({ text: "", type: "" });

  // Validações em tempo real da nova senha
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  const isNewPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  // Cálculo da força da senha para a barra de progresso (0 a 5)
  const strengthCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthPercentage = (strengthCount / 5) * 100;

  function getStrengthLabel() {
    if (strengthCount === 0) return "";
    if (strengthCount <= 2) return "Fraca";
    if (strengthCount <= 4) return "Média";
    return "Forte";
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      setIsLoadingProfile(true);
      const token = localStorage.getItem("@deskify:token");

      const response = await api.patch("/users", 
        { name, photo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data.user;
      if (token) login(updatedUser, token);

      setMessage({ text: "Perfil atualizado com sucesso!", type: "success" });
    } catch (error: any) {
      console.error(error);
      setMessage({ text: error.response?.data?.error || "Erro ao atualizar perfil.", type: "error" });
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!oldPassword || !newPassword) {
      setMessage({ text: "Preencha a senha atual e a nova senha.", type: "error" });
      return;
    }

    if (!isNewPasswordValid) {
      setMessage({ text: "A nova senha não atende aos requisitos de segurança.", type: "error" });
      return;
    }

    try {
      setIsLoadingPassword(true);
      const token = localStorage.getItem("@deskify:token");

      await api.patch("/users/password", 
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ text: "Senha alterada com sucesso!", type: "success" });
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.error(error);
      setMessage({ text: error.response?.data?.error || "Erro ao alterar a senha.", type: "error" });
    } finally {
      setIsLoadingPassword(false);
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
        <div className="profile-container-grid">
          
          {/* Card 1: Informações Pessoais */}
          <div className="profile-card">
            <div className="card-title-area">
              <h2>Meu Perfil</h2>
              <p>Gerencie suas informações pessoais</p>
            </div>

            {message.text && (
              <div className={`banner-${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="profile-form">
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

              <button type="submit" disabled={isLoadingProfile}>
                {isLoadingProfile ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          </div>

          {/* Card 2: Alteração de Senha Dinâmica */}
          <div className="profile-card">
            <div className="card-title-area">
              <h2>Segurança</h2>
              <p>Atualize sua senha de acesso</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="profile-form">
              <div className="input-group">
                <label htmlFor="oldPassword">Senha Atual</label>
                <div className="password-input-wrapper">
                  <input 
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="toggle-eye" 
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? " ocultar" : " ver"}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <div className="password-input-wrapper">
                  <input 
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={newPassword.length > 0 ? (isNewPasswordValid ? "input-valid" : "input-invalid") : ""}
                  />
                  <button 
                    type="button" 
                    className="toggle-eye" 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? " ocultar" : " ver"}
                  </button>
                </div>

                {/* Barra de Progresso de Força da Senha */}
                {newPassword.length > 0 && (
                  <div className="password-strength-container">
                    <div className="strength-header">
                      <span>Força da senha:</span>
                      <span className={`strength-text ${strengthCount === 5 ? "strong" : ""}`}>
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div className="strength-bar-bg">
                      <div 
                        className={`strength-bar-fill level-${strengthCount}`} 
                        style={{ width: `${strengthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Pílulas de Segurança */}
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

              <button 
                type="submit" 
                disabled={!isNewPasswordValid || !oldPassword || isLoadingPassword}
              >
                {isLoadingPassword ? "Atualizando..." : "Atualizar senha"}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}