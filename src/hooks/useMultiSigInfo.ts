import { useReadContract } from 'wagmi';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';

export function useMultiSigInfo() {
  const { data: threshold, isLoading: thresholdLoading } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'threshold',
  });

  const { data: proposalCount, isLoading: countLoading } = useReadContract({
    address: MULTISIG_ADDRESS,
    abi: MULTISIG_ABI,
    functionName: 'getProposalCount',
  });

  return {
    threshold,
    proposalCount,
    isLoading: thresholdLoading || countLoading,
  };
}
