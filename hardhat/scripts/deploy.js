const hre = require("hardhat");

async function main() {
  // We get the account to deploy the contract with
  const { deployer } = await hre.getNamedAccounts();

  console.log("Deploying contracts with the account:", deployer);
  const signer = await hre.ethers.provider.getSigner(deployer);

  const AttestationStation = await hre.ethers.getContractFactory(
    "AttestationStation"
  );

  const attestationStation = await AttestationStation.connect(signer).deploy();

  await attestationStation.deployed();

  console.log(
    "AttestationStation contract deployed to:",
    attestationStation.address
  );

  const AttestationStationProxy = await hre.ethers.getContractFactory(
    "AttestationStationProxy"
  );

  const attestationStationProxy = await AttestationStationProxy.connect(
    signer
  ).deploy(signer._address);

  await attestationStationProxy.deployed();

  console.log(
    "AttestationStationProxy contract deployed to:",
    attestationStationProxy.address,
    "with deployer address:",
    signer._address
  );

  //call the upgrade function on the proxy
  await attestationStationProxy
    .attach(attestationStationProxy.address)
    .upgradeTo(attestationStation.address);

  console.log(
    "AttestationStationProxy contract upgraded to:",
    attestationStation.address
  );

  const AttestationProxy = await hre.ethers.getContractFactory(
    "AttestationProxy"
  );
  const attestationProxy = await AttestationProxy.connect(signer).deploy(
    attestationStationProxy.address
  );

  await attestationProxy.deployed();

  console.log(
    "AttestationProxy contract deployed to:",
    attestationProxy.address,
    "with proxy address:",
    attestationStationProxy.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
