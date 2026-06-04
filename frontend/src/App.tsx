import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ConnectGate } from './components/ConnectGate';
import { ContractInfo } from './components/ContractInfo';
import { NewProposalForm } from './components/NewProposalForm';
import { ProposalList } from './components/ProposalList';
import { useIsUserSigner } from './hooks/useMultiSig';

function SignerSection({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { data: isSigner, isLoading } = useIsUserSigner(address);

  if (isLoading) return <p className="muted">Verificando permisos…</p>;

  if (!isSigner) {
    return (
      <div className="panel">
        <p className="error">Tu wallet no es signer de este contrato. Solo podés ver la información.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>MultiSig Wallet</h1>
        <p className="subtitle">Fernandez · Minelli · Wollheim</p>
      </header>
      <ConnectGate>
        <ContractInfo />
        <SignerSection>
          <NewProposalForm />
          <ProposalList />
        </SignerSection>
      </ConnectGate>
    </main>
  );
}
