import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { useMultiSigInfo } from '../hooks/useMultiSigInfo';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';

export function ContractInfoPanel() {
  const publicClient = usePublicClient();
  const { threshold, isLoading: thresholdLoading } = useMultiSigInfo();
  const [signers, setSigners] = useState<`0x${string}`[]>([]);
  const [signersLoading, setSignersLoading] = useState(true);

  useEffect(() => {
    const fetchSigners = async () => {
      if (!publicClient) return;

      setSignersLoading(true);
      try {
        const fetchedSigners: `0x${string}`[] = [];
        let i = 0;

        // Obtener signers del contrato iterando hasta que falle
        while (true) {
          try {
            const signer = await publicClient.readContract({
              address: MULTISIG_ADDRESS,
              abi: MULTISIG_ABI,
              functionName: 'signers',
              args: [BigInt(i)],
            });
            if (signer) {
              fetchedSigners.push(signer as `0x${string}`);
              i++;
            } else {
              break;
            }
          } catch {
            break;
          }
        }

        setSigners(fetchedSigners);
      } catch (error) {
        console.error('Error fetching signers:', error);
      } finally {
        setSignersLoading(false);
      }
    };

    fetchSigners();
  }, [publicClient]);

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="contract-info-panel">
      <h2>Información del Contrato</h2>

      <div className="info-block">
        <label>Dirección del Contrato:</label>
        <div className="contract-address">
          <code>{MULTISIG_ADDRESS}</code>
          <button
            onClick={() => copyToClipboard(MULTISIG_ADDRESS)}
            title="Copiar dirección"
          >
            📋
          </button>
        </div>
      </div>

      <div className="info-block">
        <label>Threshold (Aprobaciones requeridas):</label>
        <div className="threshold-value">
          {thresholdLoading ? (
            <span className="loading">Cargando...</span>
          ) : (
            <strong>{threshold?.toString()}</strong>
          )}
        </div>
      </div>

      <div className="info-block">
        <label>Signers ({signers.length}):</label>
        <div className="signers-list">
          {signersLoading ? (
            <span className="loading">Cargando signers...</span>
          ) : signers.length === 0 ? (
            <span className="no-data">No hay signers cargados</span>
          ) : (
            <ul>
              {signers.map((signer, index) => (
                <li key={index}>
                  <span className="signer-number">#{index + 1}</span>
                  <code>{shortenAddress(signer)}</code>
                  <button
                    onClick={() => copyToClipboard(signer)}
                    title="Copiar dirección"
                  >
                    📋
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
