import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface ConnectGateProps {
  children: React.ReactNode;
}

export function ConnectGate({ children }: ConnectGateProps) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="connect-gate">
        <div style={{ textAlign: 'center' }}>
          <h2>Conecta tu billetera para comenzar</h2>
          <p style={{ color: 'var(--muted)' }}>
            Necesitas estar conectado con MetaMask u otro proveedor Web3 para interactuar con el contrato.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
