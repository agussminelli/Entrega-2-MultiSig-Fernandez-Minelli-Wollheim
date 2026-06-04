import { useProposalCount, useThreshold } from '../hooks/useMultiSig';
import { ProposalCard } from './ProposalCard';

export function ProposalList() {
  const { data: count } = useProposalCount();
  const { data: threshold } = useThreshold();

  if (count === undefined || threshold === undefined) {
    return <p className="muted">Cargando propuestas…</p>;
  }

  if (count === 0n) {
    return (
      <div className="panel">
        <h2>Propuestas</h2>
        <p className="muted">No hay propuestas todavía.</p>
      </div>
    );
  }

  const indices = Array.from({ length: Number(count) }, (_, i) => i);

  return (
    <div className="panel">
      <h2>Propuestas</h2>
      <div className="proposal-list">
        {indices.map((i) => (
          <ProposalCard key={i} proposalId={i} threshold={threshold} />
        ))}
      </div>
    </div>
  );
}
