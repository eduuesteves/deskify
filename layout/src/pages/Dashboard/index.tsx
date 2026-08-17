import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { DashboardCard } from '../../components/DashboardCard';
import { TicketCard } from '../../components/TicketCard';
import { TicketFilters } from '../../components/TicketFilters'; // Componente de filtros modularizado
import { api } from '../../services/api';
import './styles.scss';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('ALL'); // Estado de filtro por status

    // Estado do Modal Flutuante (Estilo Gmail)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Função centralizada para buscar tickets com validação de token
    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage(null);
            
            const token = localStorage.getItem('@deskify:token');
            if (!token) {
                setErrorMessage('Sessão expirada ou usuário não autenticado. Faça login novamente.');
                setLoading(false);
                return;
            }

            const response = await api.get<Ticket[]>('/ticket');
            setTickets(response.data);
        } catch (error: any) {
            console.error('Erro ao buscar tickets:', error);
            
            if (error.response?.status === 401) {
                setErrorMessage('Sessão não autorizada. Por favor, faça login novamente.');
            } else {
                setErrorMessage('Não foi possível carregar os chamados. Verifique sua conexão.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Lógica de filtragem otimizada usando useMemo
    const filteredTickets = useMemo(() => {
        if (filter === 'ALL') return tickets;
        return tickets.filter(t => t.status === filter);
    }, [tickets, filter]);

    // Manipulador para criação de tickets via modal flutuante
    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        try {
            setSubmitting(true);
            const response = await api.post<Ticket>('/ticket', { 
                title, 
                description, 
                priority 
            });

            // Atualiza a lista instantaneamente adicionando o novo chamado no topo
            setTickets((prevTickets) => [response.data, ...prevTickets]);
            
            // Reseta e fecha o modal
            setIsModalOpen(false);
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
        } catch (error: any) {
            console.error('Erro ao criar ticket:', error);
            if (error.response?.status === 401) {
                alert('Sessão expirada. Faça login novamente.');
                navigate('/');
            } else {
                alert('Ocorreu um erro ao criar o chamado. Tente novamente.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Header />

            <main className="dashboard-content">
                <section className="welcome-banner">
                    <div className="welcome-text">
                        <h2>Olá, {user?.name || 'Eduardo'}! 👋</h2>
                        <p>Aqui está o resumo das suas atividades e chamados do Deskify.</p>
                    </div>
                    <div className="quick-status">
                        <span className="status-dot"></span>
                        <span>Sistema Online</span>
                    </div>
                </section>

                {/* Atalhos rápidos do sistema */}
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
                        icon="⚡"
                        iconVariant="metrics"
                        title="Novo Chamado Rápido"
                        description="Abra um pop-up flutuante no canto inferior direito para registrar problemas instantaneamente."
                        actionText="Criar rápido ⚡"
                        onClick={() => setIsModalOpen(true)}
                    />

                    <DashboardCard 
                        icon="📋"
                        iconVariant="settings"
                        title="Página Dedicada"
                        description="Acesse o formulário completo em página inteira para gerenciar os detalhes do ticket."
                        actionText="Abrir página →"
                        onClick={() => navigate('/ticket')}
                    />
                </div>

                {/* Seção de listagem de Tickets com Filtros */}
                <section className="tickets-section">
                    <div className="section-header">
                        <h3>Seus Chamados</h3>
                        <div className="header-actions">
                            <button onClick={fetchTickets} className="btn-refresh" title="Atualizar lista">
                                🔄 Atualizar
                            </button>
                        </div>
                    </div>

                    {/* Componente Modular de Filtros por Status */}
                    <TicketFilters onFilterChange={setFilter} currentFilter={filter} />

                    {loading ? (
                        <div className="loading-state">
                            <p className="loading-text">Carregando chamados...</p>
                        </div>
                    ) : errorMessage ? (
                        <div className="error-state">
                            <p>{errorMessage}</p>
                            <button onClick={() => navigate('/')} className="btn-retry">Ir para Login</button>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="empty-tickets">
                            <p>Nenhum chamado encontrado para este filtro. Use o atalho rápido para abrir um novo!</p>
                        </div>
                    ) : (
                        <div className="tickets-grid">
                            {filteredTickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* MODAL FLUTUANTE ESTILO GMAIL (Canto Inferior Direito) */}
            {isModalOpen && (
                <div className="gmail-ticket-modal">
                    <div className="gmail-modal-header">
                        <h4>Novo Chamado de Suporte</h4>
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)} 
                            className="close-btn"
                            aria-label="Fechar modal"
                        >
                            ×
                        </button>
                    </div>
                    
                    <form onSubmit={handleCreateTicket} className="gmail-modal-form">
                        <input 
                            type="text" 
                            placeholder="Assunto / Título do problema" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required 
                            autoFocus
                        />

                        <select 
                            value={priority} 
                            onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                        >
                            <option value="LOW">Prioridade: Baixa</option>
                            <option value="MEDIUM">Prioridade: Média</option>
                            <option value="HIGH">Prioridade: Alta</option>
                        </select>

                        <textarea 
                            placeholder="Descreva detalhadamente o ocorrido..." 
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />

                        <div className="gmail-modal-footer">
                            <button 
                                type="submit" 
                                disabled={submitting} 
                                className="send-btn"
                            >
                                {submitting ? 'Enviando...' : 'Enviar Chamado'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}