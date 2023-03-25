const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("MainWallet", function () {
  async function deployTokenFixture() {
    encodeRawKey = (rawKey) => {
      if (rawKey.length < 32) return ethers.utils.formatBytes32String(rawKey);

      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawKey));
      return hash.slice(0, 64) + "ff";
    };

    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

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

    const MainWallet = await ethers.getContractFactory("MainWallet");

    //deploy the attestation station
    const mainWallet = await MainWallet.connect(owner).deploy(
      "0x0576a174D229E3cFA37253523E645A78A0C91B57",
      attestationStationProxy.address
    );

    await mainWallet.deployed();

    confirmRecoveryKey = encodeRawKey("confirm.account.recovery");

    //val 1 should be in bytes
    val = ethers.utils.formatBytes32String("1");

    return {
      attestationStation,
      attestationStationProxy,
      attestationProxy,
      mainWallet,
      owner,
      addr1,
      addr2,
      addr3,
      confirmRecoveryKey,
      val,
    };
  }

  describe("Deployment", function () {
    //We first check that the contract can deploy
    it("Should deploy the contract", async function () {
      const { mainWallet } = await loadFixture(deployTokenFixture);

      expect(mainWallet.address).to.properAddress;
    });

    //We then check that the attestation station address in the proxy is correct
    it("Should set the attestation station address correctly", async function () {
      const { mainWallet, attestationStationProxy } = await loadFixture(
        deployTokenFixture
      );

      expect(await mainWallet.attestationStation()).to.equal(
        attestationStationProxy.address
      );
    });
  });

  describe("Social Recovery", function () {
    describe("Set Social Recovery", function () {
      //we call the set up social recovery function
      it("Should set up social recovery", async function () {
        const { mainWallet, owner, addr1, addr2, addr3 } = await loadFixture(
          deployTokenFixture
        );

        expect(
          await mainWallet
            .connect(owner)
            .setUpSocialRecovery(addr1.address, addr2.address, addr3.address)
        ).to.emit("SocialRecoveryAccountAdded");
      });

      describe("Check Attestations", function () {
        //we first create an attestation
        it("should return true if all attestations are received", async function () {
          const {
            mainWallet,
            attestationProxy,
            owner,
            addr1,
            addr2,
            addr3,
            confirmRecoveryKey,
            val,
          } = await loadFixture(deployTokenFixture);

          //set up social recovery
          await mainWallet
            .connect(owner)
            .setUpSocialRecovery(addr1.address, addr2.address, addr3.address);

          // pre create a message hash to be sent to the signer
          msgHashAddr1 = ethers.utils.solidityKeccak256(
            ["address", "bytes32", "bytes"],
            [mainWallet.address, confirmRecoveryKey, val]
          );

          signerAddr1 = await ethers.getSigner(addr1.address);

          sigAddr1 = await signerAddr1.signMessage(
            ethers.utils.arrayify(msgHashAddr1)
          );

          msgHashAddr2 = ethers.utils.solidityKeccak256(
            ["address", "bytes32", "bytes"],
            [mainWallet.address, confirmRecoveryKey, val]
          );

          signerAddr2 = await ethers.getSigner(addr2.address);

          sigAddr2 = await signerAddr2.signMessage(
            ethers.utils.arrayify(msgHashAddr2)
          );

          msgHashAddr3 = ethers.utils.solidityKeccak256(
            ["address", "bytes32", "bytes"],
            [mainWallet.address, confirmRecoveryKey, val]
          );

          signerAddr3 = await ethers.getSigner(addr3.address);

          sigAddr3 = await signerAddr3.signMessage(
            ethers.utils.arrayify(msgHashAddr3)
          );

          //Scenario 2:
          await attestationProxy
            .connect(addr1)
            .attest(mainWallet.address, confirmRecoveryKey, val, sigAddr1);

          await attestationProxy
            .connect(addr2)
            .attest(mainWallet.address, confirmRecoveryKey, val, sigAddr2);

          await attestationProxy
            .connect(addr3)
            .attest(mainWallet.address, confirmRecoveryKey, val, sigAddr3);

          expect(await mainWallet.getAttestation(confirmRecoveryKey)).to.be
            .true;
        });

        it("should return false if not all attestations are received", async function () {
          const {
            mainWallet,
            attestationProxy,
            owner,
            addr1,
            addr2,
            addr3,
            confirmRecoveryKey,
            val,
          } = await loadFixture(deployTokenFixture);

          //set up social recovery
          await mainWallet
            .connect(owner)
            .setUpSocialRecovery(addr1.address, addr2.address, addr3.address);

          // pre create a message hash to be sent to the signer
          msgHashAddr1 = ethers.utils.solidityKeccak256(
            ["address", "bytes32", "bytes"],
            [mainWallet.address, confirmRecoveryKey, val]
          );

          signerAddr1 = await ethers.getSigner(addr1.address);

          sigAddr1 = await signerAddr1.signMessage(
            ethers.utils.arrayify(msgHashAddr1)
          );

          msgHashAddr2 = ethers.utils.solidityKeccak256(
            ["address", "bytes32", "bytes"],
            [mainWallet.address, confirmRecoveryKey, val]
          );

          signerAddr2 = await ethers.getSigner(addr2.address);

          sigAddr2 = await signerAddr2.signMessage(
            ethers.utils.arrayify(msgHashAddr2)
          );

          //Scenario 2:
          await attestationProxy
            .connect(addr1)
            .attest(mainWallet.address, confirmRecoveryKey, val, sigAddr1);

          await attestationProxy
            .connect(addr2)
            .attest(mainWallet.address, confirmRecoveryKey, val, sigAddr2);

          expect(await mainWallet.getAttestation(confirmRecoveryKey)).to.be
            .false;
        });
      });
    });
  });
});
