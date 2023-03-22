const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("AttestationProxy", function () {
  async function deployTokenFixture() {
    encodeRawKey = (rawKey) => {
      if (rawKey.length < 32) return ethers.utils.formatBytes32String(rawKey);

      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawKey));
      return hash.slice(0, 64) + "ff";
    };

    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2] = await ethers.getSigners();

    const AttestationStation = await ethers.getContractFactory(
      "AttestationStation"
    );

    //deploy the attestation station
    const attestationStation = await AttestationStation.deploy();

    await attestationStation.deployed();

    const AttestationStationProxy = await ethers.getContractFactory(
      "AttestationStationProxy"
    );

    //deploy the proxy
    const attestationStationProxy = await AttestationStationProxy.deploy(
      owner.address
    );

    //set the implementation to the attestation station address
    await attestationStationProxy.upgradeTo(attestationStation.address);

    //deploy the attestation proxy
    const AttestationProxy = await ethers.getContractFactory(
      "AttestationProxy"
    );

    const attestationProxy = await AttestationProxy.deploy(
      attestationStationProxy.address
    );

    await attestationProxy.deployed();
    confirmRecoveryKey = encodeRawKey("confirm.account.recovery");

    //val 1 should be in bytes
    val = ethers.utils.formatBytes32String("1");

    return {
      attestationStation,
      attestationStationProxy,
      attestationProxy,
      owner,
      addr1,
      addr2,
      confirmRecoveryKey,
      val,
    };
  }

  describe("Deployment", function () {
    //We first check that the contract can deploy
    it("Should deploy the contract", async function () {
      const { attestationStation } = await loadFixture(deployTokenFixture);

      expect(attestationStation.address).to.properAddress;
    });

    //We then check that the attestation station address in the proxy is correct
    it("Should set the implementation address correctly", async function () {
      const { attestationProxy, attestationStationProxy } = await loadFixture(
        deployTokenFixture
      );

      expect(await attestationProxy.attestationStation()).to.equal(
        attestationStationProxy.address
      );
    });

    //We check that the ownership can be transferred
    it("Should allow the owner to transfer ownership", async function () {
      const { attestationProxy, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );

      await attestationProxy.transferOwnership(addr1.address);

      expect(await attestationProxy.owner()).to.equal(addr1.address);
    });
  });

  describe("Attestation", function () {
    //check that attestations can be created by anyone
    describe("Attestation Creation", function () {
      //anyone should be able to create attestation as long as they sign the message
      it("Should not allow addr1 to create an attestation for another signed message", async function () {
        const { attestationProxy, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        // pre create a message hash to be sent to the signer
        msgHashAddr2 = ethers.utils.solidityKeccak256(
          ["address", "bytes32", "bytes"],
          [addr1.address, confirmRecoveryKey, val]
        );

        signerAddr2 = await ethers.getSigner(addr2.address);

        sigAddr2 = await signerAddr2.signMessage(
          ethers.utils.arrayify(msgHashAddr2)
        );

        //Scenario 2:
        await expect(
          attestationProxy
            .connect(addr1)
            .attest(addr1.address, confirmRecoveryKey, val, sigAddr2)
        ).to.be.revertedWith("AttestationProxy: Invalid signature");
      });

      it("Should allow addr1 to create an attestation", async function () {
        const { attestationProxy, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        // pre create a message hash to be sent to the signer
        msgHashAddr1 = ethers.utils.solidityKeccak256(
          ["address", "bytes32", "bytes"],
          [addr1.address, confirmRecoveryKey, val]
        );

        signerAddr1 = await ethers.getSigner(addr1.address);

        sigAddr1 = await signerAddr1.signMessage(
          ethers.utils.arrayify(msgHashAddr1)
        );

        //Scenario 2:
        await expect(
          attestationProxy
            .connect(addr1)
            .attest(addr1.address, confirmRecoveryKey, val, sigAddr1)
        ).to.not.be.reverted;
      });

      it("Should not allow addr2 to create an attestation for another signed message", async function () {
        const { attestationProxy, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        // pre create a message hash to be sent to the signer
        msgHashAddr1 = ethers.utils.solidityKeccak256(
          ["address", "bytes32", "bytes"],
          [addr1.address, confirmRecoveryKey, val]
        );

        signerAddr1 = await ethers.getSigner(addr1.address);

        sigAddr1 = await signerAddr1.signMessage(
          ethers.utils.arrayify(msgHashAddr1)
        );

        //Scenario 2:
        await expect(
          attestationProxy
            .connect(addr2)
            .attest(addr1.address, confirmRecoveryKey, val, sigAddr1)
        ).to.be.revertedWith("AttestationProxy: Invalid signature").and.to.not
          .emit;
      });

      it("Should allow addr2 to create an attestation", async function () {
        const { attestationProxy, attestationStation, addr2 } =
          await loadFixture(deployTokenFixture);

        // pre create a message hash to be sent to the signer
        msgHashAddr2 = ethers.utils.solidityKeccak256(
          ["address", "bytes32", "bytes"],
          [addr2.address, confirmRecoveryKey, val]
        );

        signerAddr2 = await ethers.getSigner(addr2.address);

        sigAddr2 = await signerAddr2.signMessage(
          ethers.utils.arrayify(msgHashAddr2)
        );

        //Scenario 2:
        await expect(
          attestationProxy
            .connect(addr2)
            .attest(addr2.address, confirmRecoveryKey, val, sigAddr2)
        ).to.not.be.reverted;
      });

      it("Should allow owner to create an attestation", async function () {
        const { attestationProxy, attestationStation, owner, addr1 } =
          await loadFixture(deployTokenFixture);

        // pre create a message hash to be sent to the signer
        msgHashOwner = ethers.utils.solidityKeccak256(
          ["address", "bytes32", "bytes"],
          [addr1.address, confirmRecoveryKey, val]
        );

        signerOwner = await ethers.getSigner(owner.address);

        sigOwner = await signerOwner.signMessage(
          ethers.utils.arrayify(msgHashOwner)
        );

        //Scenario 1:
        await expect(
          attestationProxy.attest(
            addr1.address,
            confirmRecoveryKey,
            val,
            sigOwner
          )
        ).to.not.be.reverted;
      });

      it("Should not allow owner to create an attestation for another signed message", async function () {
        const { attestationProxy, owner, addr1 } = await loadFixture(
          deployTokenFixture
        );

        // pre create a message hash to be sent to the signer
        msgHashOwner = ethers.utils.solidityKeccak256(
          ["address", "bytes32", "bytes"],
          [addr1.address, confirmRecoveryKey, val]
        );

        signerAddr1 = await ethers.getSigner(addr1.address);

        sigAddr1 = await signerOwner.signMessage(
          ethers.utils.arrayify(msgHashAddr1)
        );

        //Scenario 1:
        await expect(
          attestationProxy
            .connect(owner)
            .attest(addr1.address, confirmRecoveryKey, val, sigOwner)
        ).to.be.revertedWith("AttestationProxy: Invalid signature").and.to.not
          .emit;
      });
    });
  });
});
