import { useNavigate } from 'react-router-dom';
import './styles.scss';

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
  };
}

export function TicketCard({ ticket }: TicketCardProps) {
  const navigate = useNavigate();

  return (
    <div className="ticket-card" onClick={() => navigate(`/ticket/${ticket.id}`)}>
      <div className="card-top">
        <span className={`status-badge ${ticket.status.toLowerCase()}`}>
          {ticket.status}
        </span>
        <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
          {ticket.priority}
        </span>
      </div>
      <h4>{ticket.title}</h4>
      <p>{ticket.description}</p>
    </div>
  );
}