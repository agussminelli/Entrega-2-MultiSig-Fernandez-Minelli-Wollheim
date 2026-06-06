import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { expect } from "chai";
import hre from "hardhat";
import type { NetworkConnection } from "hardhat/types/network";

describe("MultiSig", function () {
  let conn: NetworkConnection;

  before(async function () {
    conn = await hre.network.connect();
  });

  after(async function () {
    await conn.close();
  });

  async function deployFixture(connection: NetworkConnection) {
    const [owner, signer2, signer3, nonSigner] = await connection.ethers.getSigners();
    const signers = [owner.address, signer2.address, signer3.address];
    const MultiSig = await connection.ethers.getContractFactory("MultiSig");
    const multisig = await MultiSig.deploy(signers, 2n);
    return { multisig, owner, signer2, signer3, nonSigner };
  }

  async function withProposalFixture(connection: NetworkConnection) {
    const base = await connection.networkHelpers.loadFixture(deployFixture);
    await base.multisig.connect(base.owner).propose(base.signer2.address, 0n, "0x");
    return base;
  }

  async function withApprovalsFixture(connection: NetworkConnection) {
    const base = await connection.networkHelpers.loadFixture(deployFixture);
    await base.owner.sendTransaction({
      to: await base.multisig.getAddress(),
      value: connection.ethers.parseEther("1"),
    });
    await base.multisig.connect(base.owner).propose(
      base.nonSigner.address,
      connection.ethers.parseEther("0.1"),
      "0x"
    );
    await base.multisig.connect(base.owner).approve(0n);
    await base.multisig.connect(base.signer2).approve(0n);
    return base;
  }

  describe("Constructor", function () {

    it("reverts si no hay signers", async function () {
      const MultiSig = await conn.ethers.getContractFactory("MultiSig");
      await expect(MultiSig.deploy([], 1n)).to.be.revertedWith("No signers");
    });

    it("reverts si threshold es cero", async function () {
      const [a] = await conn.ethers.getSigners();
      const MultiSig = await conn.ethers.getContractFactory("MultiSig");
      await expect(MultiSig.deploy([a.address], 0n)).to.be.revertedWith("Invalid threshold");
    });

    it("reverts si threshold supera la cantidad de signers", async function () {
      const [a, b] = await conn.ethers.getSigners();
      const MultiSig = await conn.ethers.getContractFactory("MultiSig");
      await expect(MultiSig.deploy([a.address, b.address], 3n)).to.be.revertedWith("Invalid threshold");
    });

    it("reverts si hay un signer con address cero", async function () {
      const [a] = await conn.ethers.getSigners();
      const MultiSig = await conn.ethers.getContractFactory("MultiSig");
      await expect(
        MultiSig.deploy([a.address, conn.ethers.ZeroAddress], 1n)
      ).to.be.revertedWith("Zero address");
    });

    it("reverts si hay signers duplicados", async function () {
      const [a] = await conn.ethers.getSigners();
      const MultiSig = await conn.ethers.getContractFactory("MultiSig");
      await expect(MultiSig.deploy([a.address, a.address], 1n)).to.be.revertedWith("Duplicate signer");
    });

    it("setea signers y threshold correctamente", async function () {
      const { multisig, owner, signer2, signer3 } = await conn.networkHelpers.loadFixture(deployFixture);
      expect(await multisig.threshold()).to.equal(2n);
      expect(await multisig.isSigner(owner.address)).to.be.true;
      expect(await multisig.isSigner(signer2.address)).to.be.true;
      expect(await multisig.isSigner(signer3.address)).to.be.true;
    });

  });

  describe("propose", function () {

    it("reverts si el caller no es signer", async function () {
      const { multisig, nonSigner } = await conn.networkHelpers.loadFixture(deployFixture);
      await expect(
        multisig.connect(nonSigner).propose(nonSigner.address, 0n, "0x")
      ).to.be.revertedWith("Not signer");
    });

    it("crea la propuesta con los campos correctos", async function () {
      const { multisig, owner, signer2 } = await conn.networkHelpers.loadFixture(deployFixture);
      await multisig.connect(owner).propose(signer2.address, 0n, "0x");
      const proposal = await multisig.proposals(0n);
      expect(proposal.proposer).to.equal(owner.address);
      expect(proposal.target).to.equal(signer2.address);
      expect(proposal.value).to.equal(0n);
      expect(proposal.approvals).to.equal(0n);
      expect(proposal.executed).to.be.false;
      expect(proposal.cancelled).to.be.false;
    });

    it("emite el evento ProposalCreated", async function () {
      const { multisig, owner, signer2 } = await conn.networkHelpers.loadFixture(deployFixture);
      await expect(multisig.connect(owner).propose(signer2.address, 0n, "0x"))
        .to.emit(multisig, "ProposalCreated")
        .withArgs(0n, owner.address, signer2.address, 0n);
    });

  });


  describe("approve", function () {

    it("reverts si el caller no es signer", async function () {
      const { multisig, nonSigner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await expect(multisig.connect(nonSigner).approve(0n)).to.be.revertedWith("Not signer");
    });

    it("reverts si el proposalId no existe", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await expect(multisig.connect(owner).approve(99n)).to.be.revertedWith("Invalid proposal");
    });

    it("reverts si la propuesta ya fue ejecutada", async function () {
      const { multisig, owner, signer2 } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await multisig.connect(owner).approve(0n);
      await multisig.connect(signer2).approve(0n);
      await multisig.connect(owner).execute(0n);
      await expect(multisig.connect(signer2).approve(0n)).to.be.revertedWith("Already executed");
    });

    it("reverts si la propuesta está cancelada", async function () {
      const { multisig, owner, signer2 } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await multisig.connect(owner).cancel(0n);
      await expect(multisig.connect(signer2).approve(0n)).to.be.revertedWith("Cancelled");
    });

    it("reverts si el signer ya aprobó", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await multisig.connect(owner).approve(0n);
      await expect(multisig.connect(owner).approve(0n)).to.be.revertedWith("Already approved");
    });

    it("incrementa approvals y registra approvedBy", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await multisig.connect(owner).approve(0n);
      const proposal = await multisig.proposals(0n);
      expect(proposal.approvals).to.equal(1n);
      expect(await multisig.approvedBy(0n, owner.address)).to.be.true;
    });

    it("emite el evento ProposalApproved", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await expect(multisig.connect(owner).approve(0n))
        .to.emit(multisig, "ProposalApproved")
        .withArgs(0n, owner.address);
    });

  });

  describe("execute", function () {

    it("reverts si el caller no es signer", async function () {
      const { multisig, nonSigner } = await conn.networkHelpers.loadFixture(withApprovalsFixture);
      await expect(multisig.connect(nonSigner).execute(0n)).to.be.revertedWith("Not signer");
    });

    it("reverts si el proposalId no existe", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withApprovalsFixture);
      await expect(multisig.connect(owner).execute(99n)).to.be.revertedWith("Invalid proposal");
    });

    it("reverts si no hay suficientes aprobaciones", async function () {
      const { multisig, owner, signer2 } = await conn.networkHelpers.loadFixture(deployFixture);
      await multisig.connect(owner).propose(signer2.address, 0n, "0x");
      await multisig.connect(owner).approve(0n);
      await expect(multisig.connect(owner).execute(0n)).to.be.revertedWith("Not enough approvals");
    });

    it("reverts si ya fue ejecutada", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withApprovalsFixture);
      await multisig.connect(owner).execute(0n);
      await expect(multisig.connect(owner).execute(0n)).to.be.revertedWith("Already executed");
    });

    it("reverts si está cancelada", async function () {
      const { multisig, owner, signer2 } = await conn.networkHelpers.loadFixture(deployFixture);
      await multisig.connect(owner).propose(signer2.address, 0n, "0x");
      await multisig.connect(owner).approve(0n);
      await multisig.connect(signer2).approve(0n);
      await multisig.connect(owner).cancel(0n);
      await expect(multisig.connect(owner).execute(0n)).to.be.revertedWith("Cancelled");
    });

    it("transfiere ETH y marca la propuesta como ejecutada", async function () {
      const { multisig, owner, nonSigner } = await conn.networkHelpers.loadFixture(withApprovalsFixture);
      const balanceBefore = await conn.ethers.provider.getBalance(nonSigner.address);
      await multisig.connect(owner).execute(0n);
      const balanceAfter = await conn.ethers.provider.getBalance(nonSigner.address);
      expect(balanceAfter - balanceBefore).to.equal(conn.ethers.parseEther("0.1"));
      const proposal = await multisig.proposals(0n);
      expect(proposal.executed).to.be.true;
    });

    it("emite el evento ProposalExecuted", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withApprovalsFixture);
      await expect(multisig.connect(owner).execute(0n))
        .to.emit(multisig, "ProposalExecuted")
        .withArgs(0n);
    });

  });

  describe("cancel", function () {

    it("reverts si el proposalId no existe", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await expect(multisig.connect(owner).cancel(99n)).to.be.revertedWith("Invalid proposal");
    });

    it("reverts si el caller no es el proposer", async function () {
      const { multisig, signer2 } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await expect(multisig.connect(signer2).cancel(0n)).to.be.revertedWith("Not proposer");
    });

    it("reverts si la propuesta ya fue ejecutada", async function () {
      const { multisig, owner, signer2 } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await multisig.connect(owner).approve(0n);
      await multisig.connect(signer2).approve(0n);
      await multisig.connect(owner).execute(0n);
      await expect(multisig.connect(owner).cancel(0n)).to.be.revertedWith("Already executed");
    });

    it("marca la propuesta como cancelada", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await multisig.connect(owner).cancel(0n);
      const proposal = await multisig.proposals(0n);
      expect(proposal.cancelled).to.be.true;
    });

    it("reverts si la propuesta ya está cancelada", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await multisig.connect(owner).cancel(0n);
      await expect(multisig.connect(owner).cancel(0n)).to.be.revertedWith("Already cancelled");
    });

    it("emite el evento ProposalCancelled", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(withProposalFixture);
      await expect(multisig.connect(owner).cancel(0n))
        .to.emit(multisig, "ProposalCancelled")
        .withArgs(0n);
    });

  });

  describe("receive", function () {

    it("acepta transferencias de ETH directas", async function () {
      const { multisig, owner } = await conn.networkHelpers.loadFixture(deployFixture);
      const amount = conn.ethers.parseEther("1");
      await owner.sendTransaction({ to: await multisig.getAddress(), value: amount });
      expect(
        await conn.ethers.provider.getBalance(await multisig.getAddress())
      ).to.equal(amount);
    });

  });

});
