const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("AttestationStation", function () {
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
    const attestationStation = await AttestationStation.deploy();

    await attestationStation.deployed();

    confirmRecoveryKey = encodeRawKey("confirm.account.recovery");

    //val 1 should be in bytes
    val = ethers.utils.formatBytes32String("1");

    return {
      attestationStation,
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
  });

  describe("Attestation", function () {
    //check that attestations can be created by anyone
    describe("Attestation Creation", function () {
      //we first create attestations individually
      it("Should allow anyone to create an attestation", async function () {
        const { attestationStation, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        // //Scenario 1: Owner attests to addr1
        await attestationStation.attestOne(
          owner.address,
          addr1.address,
          confirmRecoveryKey,
          val
        );

        //Scenario 2: addr1 attests to addr2
        await expect(
          attestationStation
            .connect(addr1)
            .attestOne(addr1.address, addr2.address, confirmRecoveryKey, val)
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(addr1.address, addr2.address, confirmRecoveryKey, val);

        //Scenario 3: addr2 attests to owner
        await expect(
          attestationStation
            .connect(addr2)
            .attestOne(addr2.address, owner.address, confirmRecoveryKey, val)
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(addr2.address, owner.address, confirmRecoveryKey, val);

        //Scenario 4: addr1 attests to owner
        await expect(
          attestationStation
            .connect(addr1)
            .attestOne(addr1.address, owner.address, confirmRecoveryKey, val)
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(addr1.address, owner.address, confirmRecoveryKey, val);

        //Scenario 5: addr2 attests to addr1
        await expect(
          attestationStation
            .connect(addr2)
            .attestOne(addr2.address, addr1.address, confirmRecoveryKey, val)
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(addr2.address, addr1.address, confirmRecoveryKey, val);

        //Scenario 6: owner attests to addr2
        await expect(
          attestationStation
            .connect(owner)
            .attestOne(owner.address, addr2.address, confirmRecoveryKey, val)
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(owner.address, addr2.address, confirmRecoveryKey, val);
      });

      //we then create multiple attestations at once
      it("Should allow anyone to create multiple attestations", async function () {
        const { attestationStation, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        //Scenario 1: Owner attests to multiple addresses
        await expect(
          attestationStation.attest([
            {
              creator: owner.address,
              about: addr1.address,
              key: confirmRecoveryKey,
              val: val,
            },
            {
              creator: owner.address,
              about: addr2.address,
              key: confirmRecoveryKey,
              val: val,
            },
          ])
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(owner.address, addr1.address, confirmRecoveryKey, val);

        //Scenario 2: addr1 attests to multiple addresses
        await expect(
          attestationStation.connect(addr1).attest([
            {
              creator: addr1.address,
              about: owner.address,
              key: confirmRecoveryKey,
              val: val,
            },
            {
              creator: addr1.address,
              about: addr2.address,
              key: confirmRecoveryKey,
              val: val,
            },
          ])
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(addr1.address, owner.address, confirmRecoveryKey, val);

        //Scenario 3: addr2 attests to multiple addresses
        await expect(
          attestationStation.connect(addr2).attest([
            {
              creator: addr2.address,
              about: owner.address,
              key: confirmRecoveryKey,
              val: val,
            },
            {
              creator: addr2.address,
              about: addr1.address,
              key: confirmRecoveryKey,
              val: val,
            },
          ])
        )
          .to.emit(attestationStation, "AttestationCreated")
          .withArgs(addr2.address, owner.address, confirmRecoveryKey, val);
      });
    });

    describe("Attestation Retrieval", function () {
      //check that attestations can be retrieved by anyone
      it("Should allow anyone to retrieve attestations", async function () {
        const { attestationStation, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        //Scenario 1: Owner retrieves attestation from addr1, expecting a true or false value
        (await expect(
          attestationStation.attestations(
            owner.address,
            addr1.address,
            confirmRecoveryKey
          ) != "0x"
        )) == typeof true;

        //Scenario 2: addr1 retrieves attestation from addr2, expecting a bytes value
        (await expect(
          attestationStation.attestations(
            addr1.address,
            addr2.address,
            confirmRecoveryKey
          ) != "0x"
        )) == typeof true;
      });

      //check that attestations can be retrieved by using events
      it("Should allow anyone to retrieve attestations using events", async function () {
        const { attestationStation, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        //put a few attestations in the contract
        await attestationStation.attest([
          {
            creator: owner.address,
            about: addr1.address,
            key: confirmRecoveryKey,
            val: val,
          },
          {
            creator: addr1.address,
            about: addr2.address,
            key: confirmRecoveryKey,
            val: val,
          },
          {
            creator: addr2.address,
            about: owner.address,
            key: confirmRecoveryKey,
            val: val,
          },
        ]);

        aboutKey = attestationStation.filters.AttestationCreated(
          null,
          addr1.address,
          null,
          null
        );

        //expect to only find one event
        expect(
          (await attestationStation.queryFilter(aboutKey)).length
        ).to.equal(1);
      });

      //check that attestations can be retrieved by latest block timestamp
      it("Should allow anyone to retrieve attestations by latest block timestamp", async function () {
        const { attestationStation, owner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );

        //put a few attestations in the contract, do it in a way where there are 2 instances of owner attesting addr1, and 3 instances of addr1 atesting addr2
        await attestationStation.attest([
          {
            creator: owner.address,
            about: addr1.address,
            key: confirmRecoveryKey,
            val: val,
          },
          {
            creator: owner.address,
            about: addr1.address,
            key: confirmRecoveryKey,
            val: val,
          },
        ]);

        await attestationStation.connect(addr1).attest([
          {
            creator: addr1.address,
            about: addr2.address,
            key: confirmRecoveryKey,
            val: val,
          },
          {
            creator: addr1.address,
            about: addr2.address,
            key: confirmRecoveryKey,
            val: val,
          },
          {
            creator: addr1.address,
            about: addr2.address,
            key: confirmRecoveryKey,
            val: val,
          },
        ]);

        aboutKey = attestationStation.filters.AttestationCreated(
          null,
          addr2.address,
          null,
          null
        );

        events = await attestationStation.queryFilter(aboutKey);

        events.map((e) => {
          [e.args.key, e.args.creator];
        });

        //create a key that includes the 2 fields needed to check for equality
        eventToKey = (e) => `${e.args.key}-${e.args.creator}`;

        //function that updates history unless it finds the history includes newer info
        updateToLatest = (history, event) => {
          const key = eventToKey(event);
          if (
            history[key] == null ||
            history[key].blockNumber < event.blockNumber
          ) {
            history[key] = event;
            return history;
          }
          return history;
        };

        attestedHistory = events.reduce(updateToLatest, {});
        relevantEvents = Object.keys(attestedHistory).map(
          (k) => attestedHistory[k]
        );

        //expect to only find one event
        expect(relevantEvents.length).to.equal(1);
      });
    });
  });
});
