import { AccountPanel } from './components/AccountPanel';
import { ConnectGate } from './components/ConnectGate';
import { ContractInfoPanel } from './components/ContractInfoPanel';
import { ProposalsPanel } from './components/ProposalsPanel';
import { NewProposalForm } from './components/NewProposalForm';

export default function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>MultiSig - Entrega 2 Taller de Tecnología 2</h1>
        <p className="subtitle">Contrato de firma múltiple con interfaz React</p>
        <p className="subtitle">Realizado por: Nahuel Fernandez, Agustina Minelli y Federico Wollheim</p>
      </header>
      <ConnectGate>
        <AccountPanel />
        <ContractInfoPanel />
        <ProposalsPanel />
        <NewProposalForm />
      </ConnectGate>
    </main>
  );
}
