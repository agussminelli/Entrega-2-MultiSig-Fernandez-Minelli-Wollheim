import { useReadContract } from 'wagmi';
import { type Address } from 'viem';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';

const REFETCH = { refetchInterval: 4000 } as const;

export function useThreshold() {
  return useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'threshold',
    query: REFETCH,
  });
}

export function useProposalCount() {
  return useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'getProposalCount',
    query: REFETCH,
  });
}

export function useIsUserSigner(address: Address | undefined) {
  return useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'isSigner',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 },
  });
}
