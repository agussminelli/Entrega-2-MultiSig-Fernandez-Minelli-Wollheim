import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';
import { formatAddress, formatWei, proposalStatus } from '../lib/format';

interface ProposalCardProps {
  proposalId: number;
  threshold: bigint;
}

type ProposalTuple = readonly [
  proposer: `0x${string}`,
  target: `0x${string}`,
  value: bigint,
  data: `0x${string}`,
  approvals: bigint,
  executed: boolean,
  cancelled: boolean,
];

const ZERO: `0x${string}` = '0x0000000000000000000000000000000000000000';
const REFETCH = { refetchInterval: 4000 } as const;

function extractProposal(raw: unknown) {
  if (!raw) return undefined;
  // viem puede devolver objeto o tupla según la versión — manejamos ambos
  if (Array.isArray(raw)) {
    const t = raw as unknown[];
    return {
      proposer: t[0] as `0x${string}`,
      target: t[1] as `0x${string}`,
      value: t[2] as bigint,
      approvals: t[4] as bigint,
      executed: t[5] as boolean,
      cancelled: t[6] as boolean,
    };
  }
  const obj = raw as Record<string, unknown>;
  return {
    proposer: obj['proposer'] as `0x${string}`,
    target: obj['target'] as `0x${string}`,
    value: obj['value'] as bigint,
    approvals: obj['approvals'] as bigint,
    executed: obj['executed'] as boolean,
    cancelled: obj['cancelled'] as boolean,
  };
}

export function ProposalCard({ proposalId, threshold }: ProposalCardProps) {
  const { address } = useAccount();
  const id = BigInt(proposalId);

  const { data: rawProposal, refetch } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'proposals',
    args: [id],
    query: REFETCH,
  }) as { data: ProposalTuple | undefined; refetch: () => void };

  const { data: hasApproved } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'approvedBy',
    args: [id, address ?? ZERO],
    query: { ...REFETCH, enabled: !!address },
  });

  const { data: isSigner } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'isSigner',
    args: [address ?? ZERO],
    query: { refetchInterval: 10000, enabled: !!address },
  });

  const { writeContract, isPending } = useWriteContract({
    mutation: { onSuccess: () => void refetch() },
  });

  const proposal = extractProposal(rawProposal);

  if (!proposal) {
    return <div className="proposal-card"><p className="muted">Cargando…</p></div>;
  }

  const { proposer, target, value, approvals, executed, cancelled } = proposal;
  const status = proposalStatus(executed, cancelled);
  const isActive = !executed && !cancelled;

  const canApprove = !!isSigner && isActive && !hasApproved && !isPending;
  const canExecute = !!isSigner && isActive && approvals >= threshold && !isPending;
  const canCancel = isActive && !!address && proposer.toLowerCase() === address.toLowerCase() && !isPending;

  function write(fn: 'approve' | 'execute' | 'cancel') {
    writeContract({ address: MULTISIG_ADDRESS, abi: MULTISIG_ABI, functionName: fn, args: [id] });
  }

  return (
    <div className="proposal-card">
      <div className="proposal-header">
        <span className="proposal-id">#{proposalId}</span>
        <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
      </div>
      <dl>
        <dt>Destino</dt>
        <dd><code>{formatAddress(target)}</code></dd>
        <dt>Valor</dt>
        <dd>{formatWei(value)}</dd>
        <dt>Aprobaciones</dt>
        <dd>{approvals.toString()} / {threshold.toString()}</dd>
        <dt>Propuesto por</dt>
        <dd><code>{formatAddress(proposer)}</code></dd>
      </dl>
      {isActive && (
        <div className="proposal-actions">
          <button onClick={() => write('approve')} disabled={!canApprove}>
            {isPending ? 'Enviando…' : 'Aprobar'}
          </button>
          <button onClick={() => write('execute')} disabled={!canExecute}>
            Ejecutar
          </button>
          <button className="btn-cancel" onClick={() => write('cancel')} disabled={!canCancel}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
