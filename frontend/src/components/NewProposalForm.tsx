import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther, isAddress, type Hex } from 'viem';
import { MULTISIG_ADDRESS, MULTISIG_ABI } from '../config/multisig';

export function NewProposalForm() {
  const [target, setTarget] = useState('');
  const [value, setValue] = useState('');
  const [calldata, setCalldata] = useState('');
  const [error, setError] = useState('');

  const { writeContract, isPending } = useWriteContract();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isAddress(target)) {
      setError('Dirección destino inválida.');
      return;
    }

    let parsedValue: bigint;
    try {
      parsedValue = parseEther(value || '0');
    } catch {
      setError('Valor en ETH inválido.');
      return;
    }

    const data: Hex = calldata.trim() === '' ? '0x' : (calldata.trim() as Hex);
    if (data !== '0x' && !/^0x[0-9a-fA-F]*$/.test(data)) {
      setError('Calldata debe ser hex (0x...).');
      return;
    }

    writeContract(
      { address: MULTISIG_ADDRESS, abi: MULTISIG_ABI, functionName: 'propose', args: [target, parsedValue, data] },
      {
        onSuccess: () => {
          setTarget('');
          setValue('');
          setCalldata('');
        },
      },
    );
  }

  return (
    <div className="panel">
      <h2>Nueva Propuesta</h2>
      <form className="proposal-form" onSubmit={handleSubmit}>
        <label>
          Dirección destino
          <input
            type="text"
            placeholder="0x..."
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
        </label>
        <label>
          Valor (ETH)
          <input
            type="text"
            placeholder="0.0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
        <label>
          Calldata (hex, opcional)
          <input
            type="text"
            placeholder="0x"
            value={calldata}
            onChange={(e) => setCalldata(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? 'Enviando…' : 'Proponer'}
        </button>
      </form>
    </div>
  );
}
