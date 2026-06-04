import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// TODO: reemplazar con las direcciones reales de los tres integrantes antes de la entrega final
const SIGNERS = [
  "0xF200f08Ff10D633B552320AEFE42779E9370f1f0", // Federico
  "0x678BE110A5C2922a035A46bA5e99e9Cce1c1FFbD", // Nahuel
  "0xB2649c3bF3503360Af13d91fC2e675C19e792947", // Agustina
];

const THRESHOLD = 2n;

export default buildModule("MultiSigModule", (m) => {
  const multisig = m.contract("MultiSig", [SIGNERS, THRESHOLD]);

  return { multisig };
});
