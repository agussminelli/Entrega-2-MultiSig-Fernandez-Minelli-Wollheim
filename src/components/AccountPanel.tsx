import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useIsSigner } from '../hooks/useIsSigner';

export function AccountPanel() {
  const { address } = useAccount();
  const { isSigner, isLoading } = useIsSigner();

  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <section className="account-panel">
      <div>
        <h2>Cuenta Conectada</h2>
        {address && (
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>
              Dirección: <code>{shortenAddress(address)}</code>
            </p>
            {!isLoading && (
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                Estado:{' '}
                <strong style={{ color: isSigner ? '#86efac' : '#fca5a5' }}>
                  {isSigner ? '✓ Eres signer' : '✕ No eres signer'}
                </strong>
              </p>
            )}
          </div>
        )}
      </div>
      <ConnectButton />
    </section>
  );
}
