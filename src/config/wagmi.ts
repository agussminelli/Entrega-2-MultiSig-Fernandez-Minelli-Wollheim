import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('VITE_WALLETCONNECT_PROJECT_ID no está definido en .env.local');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'MultiSig - Entrega 2 Taller de Tecnología',
  projectId: projectId || 'demo',
  chains: [sepolia],
  ssr: false,
});
