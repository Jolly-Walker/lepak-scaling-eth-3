const hre = require("hardhat");
const { addressList } = require("../addresses.js");

async function main() {
  const { deployer } = await hre.getNamedAccounts();

  console.log("Deploying contracts with the account:", deployer);
  const signer = await hre.ethers.provider.getSigner(deployer);
  const walletFactoryDeployer = await ethers.getContractFactory(
    "MainWalletFactory"
  );
  const walletFactory = await walletFactoryDeployer
    .connect(signer)
    .deploy(
      addressList.entryPoint,
      addressList.attestationStation,
      addressList.automate
    );
  await walletFactory.deployed();
  console.log("wallet factory address deployed to:", walletFactory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
