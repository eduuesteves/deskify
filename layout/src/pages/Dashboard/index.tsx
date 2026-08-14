import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { DashboardCard } from '../../components/DashboardCard';
import './styles.scss'; 

export function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <Header />

            <main className="dashboard-content">
                <section className="welcome-banner">
                    <div className="welcome-text">
                        <h2>Olá, {user?.name}! 👋</h2>
                        <p>Aqui está o resumo das suas atividades e atalhos rápidos do sistema.</p>
                    </div>
                    <div className="quick-status">
                        <span className="status-dot"></span>
                        <span>Sistema Online</span>
                    </div>
                </section>

                <div className="dashboard-grid">
                    <DashboardCard 
                        icon="👤"
                        iconVariant="profile"
                        title="Meu Perfil"
                        description="Atualize suas informações pessoais, foto de avatar e altere sua senha de acesso."
                        actionText="Acessar perfil →"
                        onClick={() => navigate('/profile')}
                    />

                    <DashboardCard 
                        icon="📊"
                        iconVariant="metrics"
                        title="Visão Geral"
                        description="Acompanhe métricas em tempo real, chamados ativos e estatísticas do Deskify."
                        tag="Em breve"
                    />

                    <DashboardCard 
                        icon="⚙️"
                        iconVariant="settings"
                        title="Configurações"
                        description="Gerencie preferências da conta, notificações e parâmetros do sistema."
                        tag="Em breve"
                    />
                </div>
            </main>
        </div>
    );
}