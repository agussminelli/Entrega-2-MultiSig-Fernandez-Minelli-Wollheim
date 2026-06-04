import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID no está definido en .env.local');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'MultiSig Wallet',
  projectId,
  chains: [sepolia],
  ssr: false,
});
