import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { api } from '../../services/api'; // Ajuste o caminho se necessário
import './styles.scss';

export function TicketCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Envia apenas o que o Prisma espera (o backend vincula o userId e define o status OPEN)
      await api.post('/ticket', { 
        title, 
        description, 
        priority 
      });
      
      alert('Ticket criado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      alert('Erro ao criar ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-create-layout">
      <Header />
      <main className="ticket-create-content">
        <div className="form-card">
          <div className="form-header">
            <h2>Abrir Novo Chamado</h2>
            <p>Preencha os dados abaixo para registrar sua solicitação no sistema.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Título do Chamado</label>
              <input 
                type="text" 
                placeholder="Ex: Erro ao carregar painel" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Prioridade</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value as any)}
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div className="input-group">
              <label>Descrição Detalhada</label>
              <textarea 
                rows={6}
                placeholder="Explique detalhadamente o que aconteceu..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Salvando...' : 'Criar Chamado'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}