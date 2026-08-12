import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles.scss'; 

export function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div className="brand-wrapper">
                    <h1>Deskify</h1>
                    <span className="role-badge">{user?.role}</span>
                </div>
                
                <div className="header-actions">
                    <div 
                        className="profile-trigger" 
                        onClick={() => navigate('/profile')}
                        title="Ver perfil"
                    >
                        <img 
                            src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"} 
                            alt={user?.name || "Usuário"} 
                        />
                        <span className="profile-name">{user?.name}</span>
                    </div>

                    <button className="logout-btn" onClick={logout}>
                        Sair
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="welcome-card">
                    <h2>Olá, {user?.name}! 👋</h2>
                    <p>Seja bem-vindo de volta ao seu painel Deskify.</p>
                </div>
            </main>
        </div>
    );
}