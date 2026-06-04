import { useReadContracts } from 'wagmi';
import { MULTISIG_ADDRESS, MULTISIG_ABI, SIGNER_COUNT } from '../config/multisig';
import { formatAddress } from '../lib/format';

const base = { address: MULTISIG_ADDRESS, abi: MULTISIG_ABI } as const;

export function ContractInfo() {
  const signerCalls = Array.from({ length: SIGNER_COUNT }, (_, i) => ({
    ...base,
    functionName: 'signers' as const,
    args: [BigInt(i)] as const,
  }));

  const { data } = useReadContracts({
    contracts: [
      { ...base, functionName: 'threshold' },
      ...signerCalls,
    ],
    query: { refetchInterval: 4000 },
  });

  const threshold = data?.[0].result as bigint | undefined;
  const signers = signerCalls.map((_, i) => data?.[i + 1]?.result as `0x${string}` | undefined);

  return (
    <div className="panel">
      <h2>Información del Contrato</h2>
      <dl>
        <dt>Dirección</dt>
        <dd><code>{MULTISIG_ADDRESS}</code></dd>

        <dt>Threshold</dt>
        <dd>{threshold !== undefined ? `${threshold.toString()} de ${SIGNER_COUNT}` : '…'}</dd>

        <dt>Signers</dt>
        <dd>
          <ul className="signer-list">
            {signers.map((s, i) => (
              <li key={i}>{s ? formatAddress(s) : '…'}</li>
            ))}
          </ul>
        </dd>
      </dl>
    </div>
  );
}
