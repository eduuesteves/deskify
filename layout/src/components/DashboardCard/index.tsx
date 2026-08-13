import './styles.scss';

interface DashboardCardProps {
  icon: string;
  iconVariant?: 'profile' | 'metrics' | 'settings';
  title: string;
  description: string;
  actionText?: string;
  tag?: string;
  onClick?: () => void;
}

export function DashboardCard({ 
  icon, 
  iconVariant = 'profile', 
  title, 
  description, 
  actionText, 
  tag, 
  onClick 
}: DashboardCardProps) {
  const isClickable = !!onClick;

  return (
    <div 
      className={`dash-card ${isClickable ? 'action-card' : ''}`} 
      onClick={onClick}
    >
      <div className={`card-icon ${iconVariant}-icon`}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      
      {actionText && <span className="card-link">{actionText}</span>}
      {tag && <span className="card-tag">{tag}</span>}
    </div>
  );
}