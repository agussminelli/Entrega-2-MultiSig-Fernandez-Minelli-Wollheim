# Entrega2_TallerdeTecnologia

## Decisiones de Diseño

### Gestión de Signers

En esta implementación se optó por un conjunto de signers fijo definido durante el despliegue del contrato.

El constructor recibe una lista de direcciones autorizadas (signers) y un threshold que representa la cantidad mínima de aprobaciones necesarias para ejecutar una propuesta.

No se incluyeron funciones para agregar o remover signers después del despliegue. Esta decisión se tomó para mantener la simplicidad del contrato, reducir la complejidad de la lógica y enfocarse en los requisitos principales del ejercicio:

* Creación de propuestas.
* Aprobación de propuestas.
* Ejecución de transacciones al alcanzar el threshold requerido.
* Cancelación de propuestas por parte del creador.

Este enfoque cumple con los requisitos establecidos, que permiten utilizar un conjunto de signers fijo o dinámico.

## Contrato deployado en Sepolia

- **Dirección:** `0x6b232FA62405853382f82C5F97e3736F0ad4FeF9`
- **Chain ID:** 11155111
- **Threshold:** 2 de 3 signers

### Wallets signer

| Integrante | Dirección |
|---|---|
| Federico | `0xF200f08Ff10D633B552320AEFE42779E9370f1f0` |
| Nahuel | `0x678BE110A5C2922a035A46bA5e99e9Cce1c1FFbD` |
| Agustina | `0xB2649c3bF3503360Af13d91fC2e675C19e792947` |

## Compilar

```bash
npx hardhat compile
```

## Testear

```bash
npx hardhat test
```

## Deployar

Requiere un archivo `.env` en la raíz del proyecto con estas variables:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<tu-key>
SEPOLIA_PRIVATE_KEY=0x<clave-privada>
```

Luego:

```bash
npx hardhat ignition deploy ignition/modules/MultiSig.ts --network sepolia
```

## Correr el frontend

Crear el archivo `frontend/.env.local` con el Project ID de [WalletConnect Cloud](https://cloud.walletconnect.com):

```
VITE_WALLETCONNECT_PROJECT_ID=tu_project_id_aqui
```

Luego:

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173). Conectar MetaMask en la red Sepolia.

### Flujo de uso

1. Conectar wallet — la app verifica automáticamente si sos signer del contrato.
2. **Crear propuesta:** completar el formulario con dirección destino, valor en ETH y calldata (opcional).
3. **Aprobar:** cada signer aprueba la propuesta desde su wallet.
4. **Ejecutar:** cuando se alcanza el threshold (2 de 3 aprobaciones), cualquier signer puede ejecutar la transacción.
5. **Cancelar:** solo el signer que creó la propuesta puede cancelarla.
