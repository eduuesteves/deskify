/* src/pages/Dashboard/index.tsx */
import { useAuth } from '../../contexts/AuthContext';
import './styles.scss'; 

export function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h1>Olá, {user?.name}! 👋</h1>
                
                <span className="role-badge">
                    {user?.role}
                </span>

                <p>Email: {user?.email}</p>
                
                <button onClick={logout}>
                    Sair da conta
                </button>
            </div>
        </div>
    );
}