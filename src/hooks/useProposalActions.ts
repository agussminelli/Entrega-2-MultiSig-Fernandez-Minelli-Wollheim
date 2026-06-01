import { useWriteContract } from 'wagmi';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';

export function useCreateProposal() {
  const { writeContract, isPending, isError, error } = useWriteContract();

  const createProposal = (target: `0x${string}`, value: bigint, data: `0x${string}`) => {
    writeContract({
      address: MULTISIG_ADDRESS,
      abi: MULTISIG_ABI,
      functionName: 'propose',
      args: [target, value, data],
    });
  };

  return {
    createProposal,
    isPending,
    isError,
    error,
  };
}

export function useApproveProposal() {
  const { writeContract, isPending, isError, error } = useWriteContract();

  const approve = (proposalId: bigint) => {
    writeContract({
      address: MULTISIG_ADDRESS,
      abi: MULTISIG_ABI,
      functionName: 'approve',
      args: [proposalId],
    });
  };

  return {
    approve,
    isPending,
    isError,
    error,
  };
}

export function useExecuteProposal() {
  const { writeContract, isPending, isError, error } = useWriteContract();

  const execute = (proposalId: bigint) => {
    writeContract({
      address: MULTISIG_ADDRESS,
      abi: MULTISIG_ABI,
      functionName: 'execute',
      args: [proposalId],
    });
  };

  return {
    execute,
    isPending,
    isError,
    error,
  };
}

export function useCancelProposal() {
  const { writeContract, isPending, isError, error } = useWriteContract();

  const cancel = (proposalId: bigint) => {
    writeContract({
      address: MULTISIG_ADDRESS,
      abi: MULTISIG_ABI,
      functionName: 'cancel',
      args: [proposalId],
    });
  };

  return {
    cancel,
    isPending,
    isError,
    error,
  };
}
