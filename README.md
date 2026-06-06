# Entrega 2 — Contrato MultiSig

**Taller de Tecnologías 2 · ORT Argentina**
Fernandez · Minelli · Wollheim

Repositorio: [github.com/agussminelli/Entrega-2-MultiSig-Fernandez-Minelli-Wollheim](https://github.com/agussminelli/Entrega-2-MultiSig-Fernandez-Minelli-Wollheim)

---

## Descripción

Implementación de un contrato de firma múltiple (**MultiSig**) en Solidity y una interfaz React para operar con él. El contrato permite que un grupo de signers autorice transacciones mediante un mecanismo de aprobación con umbral: una propuesta se ejecuta recién cuando alcanza la cantidad mínima de aprobaciones requerida (threshold).

---

## Decisiones de Diseño

### Gestión de Signers

Se optó por un conjunto de signers **fijo**, definido durante el despliegue del contrato. El constructor recibe la lista de direcciones autorizadas y el threshold mínimo de aprobaciones.

No se incluyeron funciones para agregar o remover signers post-despliegue. Esta decisión simplifica el contrato y mantiene el foco en los flujos principales:

- Creación de propuestas
- Aprobación de propuestas
- Ejecución de transacciones al alcanzar el threshold
- Cancelación de propuestas por parte del creador

---

## Contrato en Sepolia

| Campo | Valor |
|---|---|
| Dirección | `0x6b232FA62405853382f82C5F97e3736F0ad4FeF9` |
| Chain ID | 11155111 |
| Threshold | 2 de 3 |

### Wallets signer

| Integrante | Dirección |
|---|---|
| Federico Wollheim | `0xF200f08Ff10D633B552320AEFE42779E9370f1f0` |
| Nahuel Minelli | `0x678BE110A5C2922a035A46bA5e99e9Cce1c1FFbD` |
| Agustina Fernandez | `0xB2649c3bF3503360Af13d91fC2e675C19e792947` |

---

## Compilar y Testear

```bash
npx hardhat compile
npx hardhat test
```

---

## Deployar

Crear un archivo `.env` en la raíz del proyecto:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<tu-key>
SEPOLIA_PRIVATE_KEY=0x<clave-privada>
```

Luego ejecutar:

```bash
npx hardhat ignition deploy ignition/modules/MultiSig.ts --network sepolia
```

---

## Correr el Frontend

Crear el archivo `frontend/.env.local` con el Project ID de [WalletConnect Cloud](https://cloud.walletconnect.com):

```
VITE_WALLETCONNECT_PROJECT_ID=tu_project_id_aqui
```

Instalar dependencias y levantar el servidor:

```bash
cd frontend
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173) y conectar MetaMask en la red Sepolia.

### Flujo de uso

1. **Conectar wallet** — la app verifica automáticamente si la dirección conectada es signer.
2. **Crear propuesta** — completar el formulario con dirección destino, valor en ETH y calldata opcional.
3. **Aprobar** — cada signer aprueba la propuesta desde su wallet.
4. **Ejecutar** — cuando se alcanza el threshold (2 de 3 aprobaciones), cualquier signer puede ejecutar la transacción.
5. **Cancelar** — solo el signer que creó la propuesta puede cancelarla antes de que sea ejecutada.
