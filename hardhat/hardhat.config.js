require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.17",
	networks: {
		mumbai: {
			url: process.env.MUMBAI_RPC,
			accounts: [`0x${process.env.PRIVATE_KEY}`],
		},
		goerli: {
			url: process.env.GOERLI_RPC,
			accounts: [`0x${process.env.PRIVATE_KEY}`],
		},
	},
};
