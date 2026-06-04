import { formatUnits, formatEther, type Address } from 'viem';

export function formatAddress(address: Address): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatBalance(value: bigint, decimals: number): string {
  const raw = formatUnits(value, decimals);
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  return n.toFixed(4);
}

export function formatWei(value: bigint): string {
  const eth = Number(formatEther(value));
  if (eth === 0) return '0 ETH';
  return `${eth.toFixed(6)} ETH`;
}

export function proposalStatus(executed: boolean, cancelled: boolean): string {
  if (executed) return 'Ejecutada';
  if (cancelled) return 'Cancelada';
  return 'Pendiente';
}
