import React, { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { getSimpleAccount, getVerifyingPaymaster } from "../utils";
import config from "../config";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
	// Contract Wallet address
	const [walletAddress, setWalletAddress] = useState();

	// Set Reccuring Date

	// Get Smart Account Address
	const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
	const paymasterAPI = getVerifyingPaymaster(
		config.paymasterUrl,
		config.entryPoint
	);
	const sw = getSimpleAccount(
		provider,
		config.signingKey,
		config.entryPoint,
		config.simpleAccountFactory,
		paymasterAPI
	);
	setWalletAddress(sw.address);

	const getWalletContract = () => {};

	return (
		<WalletContext.Provider value={{ walletAddress }}>
			{children}
		</WalletContext.Provider>
	);
};
