import { ethers } from "hardhat";
import { Automate } from "../typechain";

export const transferOwnership = async () => {
  const newOwnerAddress = "0xcdf41a135c65d0013393b3793f92b4faf31032d0"; // fill with your own owner address

  const automateAddress = (<Automate>await ethers.getContract("Automate"))
    .address;
  const ownableInterface = [
    "function transferOwnership(address newOwner) external",
  ];
  const ops = await ethers.getContractAt(ownableInterface, automateAddress);
  const ownerAddressStorageSlot = await ethers.provider.getStorageAt(
    automateAddress,
    ethers.BigNumber.from(
      "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"
    )
  );
  const ownerAddress = ethers.utils.getAddress(
    "0x" + ownerAddressStorageSlot.substring(26)
  );

  // const ops = await ethers.getContractAt("EIP173Proxy", automateAddress);
  // const ownerAddress = await ops.proxyAdmin();

  console.log("Current Owner: ", ownerAddress);
  console.log("New Owner: ", newOwnerAddress);

  await ops.transferOwnership(newOwnerAddress);
};

transferOwnership();
