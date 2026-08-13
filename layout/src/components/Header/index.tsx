import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles.scss';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="brand-wrapper" onClick={() => navigate('/dashboard')}>
        <h1>Deskify</h1>
        <span className="platform-tag">Workspace</span>
      </div>
      
      <div className="header-actions">
        <div 
          className="profile-trigger" 
          onClick={() => navigate('/profile')}
          title="Gerenciar perfil"
        >
          <img 
            src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} 
            alt={user?.name || "Usuário"} 
          />
          <div className="user-info-text">
            <span className="profile-name">{user?.name}</span>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout} title="Encerrar sessão">
          Sair
        </button>
      </div>
    </header>
  );
}