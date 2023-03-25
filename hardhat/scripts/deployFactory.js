const hre = require("hardhat");
const {addressList} = require("../addresses.js");

async function main() {
    const walletFactoryDeployer = await ethers.getContractFactory('WalletFactory');
    const walletFactory = await walletFactoryDeployer.deploy(addressList.entryPoint, addressList.attestationStation);
    await walletFactory.deployed();
    console.log("wallet factory address deployed to:", walletFactory.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  