import {
	AutomateSDK,
	CreateTaskOptions,
	TaskTransaction,
} from "@gelatonetwork/automate-sdk";
import { ethers, Contract, Overrides } from "ethers";
import { chainId, walletABI } from "./constant";
import config from "../config.json";

export const createSubscription = async (
	to: string,
	amount: string,
	interval: number
	// startTime?: number,
) => {
	const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

	// Wallet owner created by private key
	const owner = new ethers.Wallet(
		"0x123d3ec5db9648ed99ae2be28af69ac7b03314f4ecf424a671d61145d639da73",
		provider
	);

	// Init AutomateSDK
	const automate = new AutomateSDK(chainId.MUMBAI, owner);
	const toAddress = ethers.utils.getAddress(to); // Receiver's address

	// Getting Wallet contract
	const transfer = new Contract(
		"0x1cb030d55Bb854EA1Fd20f784e424e5ABd7b2f9C",
		walletABI,
		provider
	);
	const selector = transfer.interface.getSighash("transfer(address,uint256)");
	const value = ethers.utils.parseEther(amount);
	const execData = transfer.interface.encodeFunctionData("transfer", [
		toAddress,
		value,
	]);
	// const startTime = Date.now();

	// Create Task
	const param: CreateTaskOptions = {
		name: "Subscription to Netflix",
		execAddress: transfer.address,
		execSelector: selector,
		execAbi: JSON.stringify(walletABI),
		execData,
		interval: interval,
		dedicatedMsgSender: true,
	};
	const overrides: Overrides = { gasLimit: 200000 };
	console.log("Creating task");
	const { taskId, tx }: TaskTransaction = await automate.createTask(
		param,
		overrides
	);
	await tx.wait();
	console.log(taskId);
};
