import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';

export function useIsSigner() {
  const { address } = useAccount();

  const { data: isSigner, isLoading } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'isSigner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isSigner: isSigner || false,
    isLoading,
    address,
  };
}
