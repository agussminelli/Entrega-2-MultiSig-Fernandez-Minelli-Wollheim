import { useState } from 'react';
import { useCreateProposal } from '../hooks/useProposalActions';
import { useIsSigner } from '../hooks/useIsSigner';

export function NewProposalForm() {
  const [target, setTarget] = useState('');
  const [value, setValue] = useState('');
  const [calldata, setCalldata] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { createProposal, isPending, isError, error: createError } = useCreateProposal();
  const { isSigner } = useIsSigner();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!target.startsWith('0x') || target.length !== 42) {
      setError('Dirección destino inválida (debe ser formato 0x...)');
      return;
    }

    if (!value || isNaN(Number(value)) || Number(value) < 0) {
      setError('El valor debe ser un número válido y no negativo');
      return;
    }

    if (calldata && (!calldata.startsWith('0x') || calldata.length % 2 !== 0)) {
      setError('Calldata debe ser un formato hex válido (0x...)');
      return;
    }

    try {
      // Convertir ETH a Wei
      const valueInWei = BigInt(Math.floor(Number(value) * 1e18));
      const finalCalldata = (calldata || '0x') as `0x${string}`;

      createProposal(target as `0x${string}`, valueInWei, finalCalldata);

      setSuccess('Propuesta enviada al contrato!');
      // Limpiar formulario
      setTarget('');
      setValue('');
      setCalldata('');

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al crear la propuesta');
      console.error(err);
    }
  };

  if (!isSigner) {
    return (
      <section className="new-proposal-form">
        <h2>Nueva Propuesta</h2>
        <div className="not-signer-message">
          ⚠ No eres signer. Solo los signers pueden crear propuestas.
        </div>
      </section>
    );
  }

  return (
    <section className="new-proposal-form">
      <h2>Nueva Propuesta</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="target">Dirección Destino *</label>
          <input
            id="target"
            type="text"
            placeholder="0x..."
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="value">Valor (ETH) *</label>
          <input
            id="value"
            type="number"
            placeholder="0"
            step="0.001"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="calldata">Calldata (hex, opcional)</label>
          <input
            id="calldata"
            type="text"
            placeholder="0x (opcional)"
            value={calldata}
            onChange={(e) => setCalldata(e.target.value)}
            disabled={isPending}
          />
          <small>Para llamadas a funciones específicas. Déjalo vacío para transferencias simples.</small>
        </div>

        {error && <div className="error-message">{error}</div>}
        {createError && <div className="error-message">{createError.message}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={isPending}>
          {isPending ? 'Enviando propuesta...' : 'Crear Propuesta'}
        </button>
      </form>
    </section>
  );
}
