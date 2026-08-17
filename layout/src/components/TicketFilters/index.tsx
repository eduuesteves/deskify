interface Props {
  onFilterChange: (status: string) => void;
  currentFilter: string;
}

export function TicketFilters({ onFilterChange, currentFilter }: Props) {
  const statuses = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Abertos', value: 'OPEN' },
    { label: 'Em Andamento', value: 'IN_PROGRESS' },
    { label: 'Fechados', value: 'CLOSED' },
  ];

  return (
    <div className="ticket-filters">
      {statuses.map((s) => (
        <button
          key={s.value}
          className={currentFilter === s.value ? 'active' : ''}
          onClick={() => onFilterChange(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}