import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useMultiSigInfo } from '../hooks/useMultiSigInfo';
import {
  useApproveProposal,
  useExecuteProposal,
  useCancelProposal,
} from '../hooks/useProposalActions';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';

interface Proposal {
  id: bigint;
  proposer: `0x${string}`;
  target: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  approvals: bigint;
  executed: boolean;
  cancelled: boolean;
}

export function ProposalsPanel() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { threshold, proposalCount, isLoading: infoLoading } = useMultiSigInfo();
  const { approve } = useApproveProposal();
  const { execute } = useExecuteProposal();
  const { cancel } = useCancelProposal();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!publicClient || !proposalCount) return;

      setIsLoading(true);
      try {
        const fetchedProposals: Proposal[] = [];

        for (let i = 0; i < Number(proposalCount); i++) {
          const proposal = await publicClient.readContract({
            address: MULTISIG_ADDRESS,
            abi: MULTISIG_ABI,
            functionName: 'proposals',
            args: [BigInt(i)],
          });

          if (proposal) {
            fetchedProposals.push({
              id: BigInt(i),
              proposer: proposal[0] as `0x${string}`,
              target: proposal[1] as `0x${string}`,
              value: proposal[2] as bigint,
              data: proposal[3] as `0x${string}`,
              approvals: proposal[4] as bigint,
              executed: proposal[5] as boolean,
              cancelled: proposal[6] as boolean,
            });
          }
        }

        setProposals(fetchedProposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [publicClient, proposalCount]);

  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatEth = (wei: bigint) => {
    return (Number(wei) / 1e18).toFixed(4);
  };

  const getProposalStatus = (proposal: Proposal) => {
    if (proposal.cancelled) return 'Cancelada';
    if (proposal.executed) return 'Ejecutada';
    return 'Pendiente';
  };

  const canApprove = (proposal: Proposal) => {
    return !proposal.executed && !proposal.cancelled && address;
  };

  const canExecute = (proposal: Proposal) => {
    return (
      !proposal.executed &&
      !proposal.cancelled &&
      proposal.approvals >= (threshold || 0n) &&
      address
    );
  };

  const canCancel = (proposal: Proposal) => {
    return (
      !proposal.executed &&
      !proposal.cancelled &&
      proposal.proposer === address
    );
  };

  if (isLoading || infoLoading) {
    return (
      <section className="proposals-panel">
        <h2>Panel de Propuestas</h2>
        <div className="loading">Cargando propuestas...</div>
      </section>
    );
  }

  if (proposals.length === 0) {
    return (
      <section className="proposals-panel">
        <h2>Panel de Propuestas</h2>
        <div className="no-proposals">No hay propuestas aún</div>
      </section>
    );
  }

  return (
    <section className="proposals-panel">
      <h2>Panel de Propuestas ({proposals.length})</h2>

      <div className="proposals-list">
        {proposals.map((proposal) => (
          <div key={Number(proposal.id)} className="proposal-card">
            <div className="proposal-header">
              <span className="proposal-id">#{Number(proposal.id)}</span>
              <span className={`status ${getProposalStatus(proposal).toLowerCase()}`}>
                {getProposalStatus(proposal)}
              </span>
            </div>

            <div className="proposal-details">
              <div className="detail-row">
                <span className="label">Destino:</span>
                <code>{shortenAddress(proposal.target)}</code>
              </div>

              <div className="detail-row">
                <span className="label">Valor:</span>
                <strong>{formatEth(proposal.value)} ETH</strong>
              </div>

              <div className="detail-row">
                <span className="label">Aprobaciones:</span>
                <span className="approvals">
                  {Number(proposal.approvals)}/{Number(threshold || 0)}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (Number(proposal.approvals) / Number(threshold || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="detail-row">
                <span className="label">Proposer:</span>
                <code>{shortenAddress(proposal.proposer)}</code>
              </div>

              {proposal.data !== '0x' && (
                <div className="detail-row">
                  <span className="label">Calldata:</span>
                  <code className="calldata">{proposal.data}</code>
                </div>
              )}
            </div>

            <div className="proposal-actions">
              {canApprove(proposal) && (
                <button
                  onClick={() => approve(proposal.id)}
                  className="btn-approve"
                  title="Aprobar esta propuesta"
                >
                  ✓ Aprobar
                </button>
              )}

              {canExecute(proposal) && (
                <button
                  onClick={() => execute(proposal.id)}
                  className="btn-execute"
                  title="Ejecutar esta propuesta"
                >
                  ▶ Ejecutar
                </button>
              )}

              {canCancel(proposal) && (
                <button
                  onClick={() => cancel(proposal.id)}
                  className="btn-cancel"
                  title="Cancelar esta propuesta"
                >
                  ✕ Cancelar
                </button>
              )}

              {!canApprove(proposal) && !canExecute(proposal) && !canCancel(proposal) && (
                <span className="no-actions">Sin acciones disponibles</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
