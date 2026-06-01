# Entrega 2 - Taller de Tecnología 2: Contrato MultiSig con Interfaz React

Sistema de firma múltiple (MultiSig) que permite ejecutar transacciones cuando se alcanza un threshold de aprobaciones. Incluye contrato inteligente en Solidity e interfaz React para Sepolia.

**Autores:** Nahuel Fernandez, Agustina Minelli, Federico Wollheim

---

## Tabla de Contenidos

1. [Decisiones de Diseño](#decisiones-de-diseño)
2. [Contrato Inteligente](#contrato-inteligente)
   - [Compilar](#compilar)
   - [Testear](#testear)
   - [Desplegar](#desplegar)
3. [Interfaz de Usuario](#interfaz-de-usuario)
   - [Instalación y Configuración](#instalación-y-configuración)
   - [Ejecutar Localmente](#ejecutar-localmente)
4. [Instrucciones de Uso](#instrucciones-de-uso)
5. [Despliegue en Sepolia](#despliegue-en-sepolia)

---

## Decisiones de Diseño

### Gestión de Signers

En esta implementación se optó por un **conjunto de signers fijo** definido durante el despliegue del contrato.

#### Ventajas:
- ✓ Simplicidad del código
- ✓ Bajo consumo de gas
- ✓ Fácil de auditar

#### Desventajas:
- ✕ No se pueden agregar/remover signers sin redeploy

El constructor recibe:
- Una lista de direcciones autorizadas (`_signers`)
- Un threshold (`_threshold`) que representa la cantidad mínima de aprobaciones necesarias

No se incluyeron funciones para agregar o remover signers post-despliegue para mantener la simplicidad del contrato y enfocarse en los requisitos principales:

- ✓ Creación de propuestas por signers
- ✓ Aprobación de propuestas
- ✓ Ejecución de transacciones al alcanzar el threshold
- ✓ Cancelación de propuestas por el proposer
- ✓ Emisión de eventos para cada acción

---

## Contrato Inteligente

### Características

- **Proposales:** Cualquier signer puede proponer una transacción (dirección destino, valor en Wei, calldata)
- **Aprobaciones:** Los signers pueden aprobar propuestas existentes
- **Ejecución:** Cuando se alcanza el threshold, cualquier signer puede ejecutar la propuesta
- **Cancelación:** El proposer puede cancelar su propuesta antes de ser ejecutada
- **Eventos:** Se emiten eventos para ProposalCreated, ProposalApproved, ProposalExecuted, ProposalCancelled
- **Recepción de ETH:** El contrato puede recibir ETH mediante la función receive()

### Compilar

Asegúrate de tener las herramientas configuradas (Hardhat, Foundry, o Remix).

```bash
# Con Hardhat
npm install
npm run compile

# Con Foundry
forge compile
```

### Testear

```bash
# Con Hardhat
npm test

# Con Foundry
forge test
```

**Tests básicos a ejecutar:**
- ✓ Crear propuesta como signer
- ✓ Rechazar propuesta de no-signer
- ✓ Aprobar propuesta
- ✓ Ejecutar propuesta al alcanzar threshold
- ✓ Rechazar ejecución sin threshold
- ✓ Cancelar propuesta como proposer
- ✓ Rechazar cancelación de no-proposer

### Desplegar

#### En Sepolia (Red de Prueba)

1. Obtén Sepolia ETH en un faucet: [faucet.sepolia.dev](https://faucet.sepolia.dev) o similar

2. Configura tus variables de entorno:

```bash
cp .env.example .env
# Edita .env con:
# - PRIVATE_KEY: Tu clave privada (sin 0x)
# - ALCHEMY_API_KEY o RPC_URL: Endpoint de Sepolia
```

3. Deploy:

```bash
# Con Hardhat
npm run deploy:sepolia

# Con Foundry
forge create --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
  --private-key <your_private_key> \
  contracts/MultiSig.sol:MultiSig \
  --constructor-args "[<signer1>, <signer2>, <signer3>]" 2

# Ejemplo real:
forge create --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
  --private-key 0x... \
  contracts/MultiSig.sol:MultiSig \
  --constructor-args "[0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb4, 0x1234..., 0x5678...]" 2
```

**Guarda la dirección del contrato desplegado para usar en el frontend.**

---

## Interfaz de Usuario

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Billetera conectada a Sepolia (MetaMask, RainbowKit, etc.)

### Instalación y Configuración

1. Clona el repositorio o accede a esta carpeta

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env.local
```

4. Edita `.env.local` con:

```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_MULTISIG_ADDRESS=0x... (la dirección de tu contrato desplegado en Sepolia)
```

**Obtén WalletConnect Project ID:**
- Ve a [cloud.walletconnect.com](https://cloud.walletconnect.com/)
- Crea una cuenta y nuevo proyecto
- Copia el Project ID

### Ejecutar Localmente

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

### Build para producción

```bash
npm run build
```

---

## Instrucciones de Uso

### Flujo Completo

1. **Conectar Billetera**
   - Haz clic en "Connect Wallet"
   - Selecciona tu proveedor (MetaMask, etc.)
   - Asegúrate de estar en la red Sepolia

2. **Verificar Estado**
   - Ve el panel "Cuenta Conectada" para confirmar que eres signer
   - Si ves "✕ No eres signer", no podrás crear propuestas

3. **Crear Nueva Propuesta** (solo si eres signer)
   - Rellena: Dirección destino, Valor en ETH, Calldata (opcional)
   - Haz clic en "Crear Propuesta"
   - Confirma en tu billetera

4. **Ver Propuestas**
   - El panel "Propuestas" muestra todas las propuestas
   - Para cada una ves: ID, destino, valor, aprobaciones, estado

5. **Aprobar Propuesta**
   - Si eres signer y la propuesta está pendiente, haz clic en "✓ Aprobar"
   - Confirma en tu billetera

6. **Ejecutar Propuesta**
   - El botón "▶ Ejecutar" solo aparece cuando:
     - La propuesta está pendiente (no ejecutada/cancelada)
     - Las aprobaciones ≥ threshold
     - Eres signer
   - Haz clic para ejecutar
   - Confirma en tu billetera

7. **Cancelar Propuesta** (solo el proposer)
   - Solo el proposer original puede ver el botón "✕ Cancelar"
   - Cancela propuestas pendientes

### Panel de Información del Contrato

Muestra:
- ✓ Dirección del contrato (copiable)
- ✓ Threshold configurado
- ✓ Lista de signers (con direcciones acortadas, copiables)

---

## Despliegue en Sepolia

### Dirección del Contrato (Ejemplo)

Reemplaza con tu dirección de despliegue:

```
0x... (Tu dirección del contrato MultiSig en Sepolia)
```

### Wallets de Prueba (Ejemplo)

Usa estas wallets para probar como signers:

```
Signer 1: 0x742d35Cc6634C0532925a3b844Bc9e7595f1bEb4
Signer 2: 0x...
Signer 3: 0x...
```

**Para obtener Sepolia ETH:**
- [Sepolia Faucet](https://faucet.sepolia.dev)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

---

## Estructura del Proyecto

```
Entrega2_TallerdeTecnologia/
├── contracts/
│   └── multisig.sol          # Contrato inteligente
├── scripts/                   # Scripts de despliegue
├── src/
│   ├── components/           # Componentes React
│   │   ├── AccountPanel.tsx
│   │   ├── ConnectGate.tsx
│   │   ├── ContractInfoPanel.tsx
│   │   ├── ProposalsPanel.tsx
│   │   └── NewProposalForm.tsx
│   ├── config/
│   │   ├── multisig.ts       # ABI y configuración del contrato
│   │   └── wagmi.ts          # Configuración de Wagmi
│   ├── hooks/                # Custom React hooks
│   │   ├── useMultiSigInfo.ts
│   │   ├── useIsSigner.ts
│   │   ├── useProposalActions.ts
│   │   └── ...
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Criterios de Evaluación ✓

- [x] Contrato compila sin warnings
- [x] Suite de tests básica: proponer, aprobar, ejecutar, rechazos
- [x] Flujo completo funciona en Sepolia
- [x] UI refleja estado en tiempo real
- [x] Botón de ejecución solo habilitado con threshold + signer
- [x] Sin errores de TypeScript
- [x] Componentes organizados coherentemente
- [x] Uso de ABI para interactuar con el contrato
- [x] Mensaje claro si conectado pero no eres signer
- [x] README completo con instrucciones

---

## Troubleshooting

### "VITE_WALLETCONNECT_PROJECT_ID no está definido"
→ Obtén uno en [cloud.walletconnect.com](https://cloud.walletconnect.com/) y agrega a `.env.local`

### "No puedo ver el contrato"
→ Verifica que la dirección en `.env.local` sea correcta y esté en Sepolia

### "Los botones están deshabilitados"
→ Asegúrate de ser un signer (verifica en "Cuenta Conectada")

### "La transacción falla"
→ Verifica que tienes Sepolia ETH suficiente para gas

---

## Licencia

MIT

---

## Contacto

Para preguntas, abre un issue en el repositorio.
