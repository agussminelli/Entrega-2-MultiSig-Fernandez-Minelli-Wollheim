// TODO: Reemplaza estas direcciones con las de tu contrato desplegado en Sepolia
export const MULTISIG_ADDRESS = (import.meta.env.VITE_MULTISIG_ADDRESS || '0x0') as `0x${string}`;

export const MULTISIG_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_signers', type: 'address[]', internalType: 'address[]' },
      { name: '_threshold', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approvedBy',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'address', internalType: 'address' },
    ],
    outputs: [{ type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cancel',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getProposalCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isSigner',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'propose',
    inputs: [
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'proposals',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'proposer', type: 'address', internalType: 'address' },
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
      { name: 'approvals', type: 'uint256', internalType: 'uint256' },
      { name: 'executed', type: 'bool', internalType: 'bool' },
      { name: 'cancelled', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'signers',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'threshold',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ProposalApproved',
    inputs: [
      { name: 'proposalId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'signer', type: 'address', indexed: true, internalType: 'address' },
    ],
  },
  {
    type: 'event',
    name: 'ProposalCancelled',
    inputs: [{ name: 'proposalId', type: 'uint256', indexed: true, internalType: 'uint256' }],
  },
  {
    type: 'event',
    name: 'ProposalCreated',
    inputs: [
      { name: 'proposalId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'proposer', type: 'address', indexed: true, internalType: 'address' },
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'ProposalExecuted',
    inputs: [{ name: 'proposalId', type: 'uint256', indexed: true, internalType: 'uint256' }],
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
] as const;
