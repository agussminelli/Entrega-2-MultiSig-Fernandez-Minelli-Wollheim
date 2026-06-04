import { type Address } from 'viem';

// TODO: actualizar esta dirección si se redeploya el contrato con los signers reales
export const MULTISIG_ADDRESS: Address = '0x6b232FA62405853382f82C5F97e3736F0ad4FeF9';

export const SIGNER_COUNT = 3;

export const MULTISIG_ABI = [
  {
    inputs: [{ internalType: 'address[]', name: '_signers', type: 'address[]' }, { internalType: 'uint256', name: '_threshold', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'proposalId', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'signer', type: 'address' }],
    name: 'ProposalApproved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'ProposalCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'proposalId', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'proposer', type: 'address' }, { indexed: false, internalType: 'address', name: 'target', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }],
    name: 'ProposalCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'ProposalExecuted',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }, { internalType: 'address', name: '', type: 'address' }],
    name: 'approvedBy',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getProposalCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isSigner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'proposals',
    outputs: [
      { internalType: 'address', name: 'proposer', type: 'address' },
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'uint256', name: 'approvals', type: 'uint256' },
      { internalType: 'bool', name: 'executed', type: 'bool' },
      { internalType: 'bool', name: 'cancelled', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }, { internalType: 'uint256', name: 'value', type: 'uint256' }, { internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'propose',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'signers',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'threshold',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;
