import mainWalletabi from "./MainWallet.json";

// Main Wallet contract ABI
export const mainWalletABI = mainWalletabi;

export const walletFactory = "0x6494251544cF53b00652e684d1D7229a21e9115a";

// Chain ID
export enum CHAIN_ID {
	GOERLI = 5,
	OPTIMISM = 10,
	MUMBAI = 80001,
}

export enum TOKEN_ADDRESS {
	ETH = "",
	MATIC_MUMBAI = "0x0000000000000000000000000000000000001010",
	ERC_20_TOKEN = "0x0998B0b3CdED25564a8d2e531D93E666FB21E99d",
}
