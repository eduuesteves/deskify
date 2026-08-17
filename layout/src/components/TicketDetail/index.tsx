import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
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

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Busca os dados do ticket específico pelo ID na URL
  useEffect(() => {
    async function fetchTicketDetail() {
      try {
        const response = await api.get<Ticket>(`/ticket/${id}`);
        setTicket(response.data);
      } catch (error) {
        console.error('Erro ao carregar detalhes do ticket:', error);
        alert('Chamado não encontrado.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTicketDetail();
    }
  }, [id, navigate]);

  // Função para interagir e alterar o status do ticket
  const handleUpdateStatus = async (newStatus: 'OPEN' | 'IN_PROGRESS' | 'CLOSED') => {
    try {
      setUpdating(true);
      const response = await api.put<Ticket>(`/ticket/${id}`, {
        status: newStatus
      });
      setTicket(response.data);
      alert('Status do chamado atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Não foi possível alterar o status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="ticket-detail-layout">
        <Header />
        <main className="ticket-detail-content">
          <p>Carregando detalhes do chamado...</p>
        </main>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="ticket-detail-layout">
      <Header />

      <main className="ticket-detail-content">
        <div className="detail-card">
          <div className="detail-header">
            <button onClick={() => navigate('/dashboard')} className="btn-back">
              ← Voltar ao Dashboard
            </button>
            <div className="badges">
              <span className={`badge-priority ${ticket.priority.toLowerCase()}`}>
                Prioridade: {ticket.priority}
              </span>
              <span className={`badge-status ${ticket.status.toLowerCase()}`}>
                Status: {ticket.status}
              </span>
            </div>
          </div>

          <h1>{ticket.title}</h1>
          <span className="ticket-date">
            Criado em: {new Date(ticket.createdAt).toLocaleDateString('pt-BR')} às {new Date(ticket.createdAt).toLocaleTimeString('pt-BR')}
          </span>

          <div className="description-box">
            <h3>Descrição do Problema</h3>
            <p>{ticket.description}</p>
          </div>

          {/* Painel de Interação / Ações */}
          <div className="interaction-panel">
            <h3>Interagir com o Chamado (Alterar Status)</h3>
            <div className="action-buttons">
              <button 
                disabled={updating || ticket.status === 'OPEN'}
                onClick={() => handleUpdateStatus('OPEN')}
                className="btn-status open"
              >
                Marcar como Aberto
              </button>
              <button 
                disabled={updating || ticket.status === 'IN_PROGRESS'}
                onClick={() => handleUpdateStatus('IN_PROGRESS')}
                className="btn-status progress"
              >
                Em Andamento
              </button>
              <button 
                disabled={updating || ticket.status === 'CLOSED'}
                onClick={() => handleUpdateStatus('CLOSED')}
                className="btn-status closed"
              >
                Concluir / Fechar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}