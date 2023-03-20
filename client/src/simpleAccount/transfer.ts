import { ethers } from "ethers";
import {
	getVerifyingPaymaster,
	getSimpleAccount,
	getGasFee,
	printOp,
	getHttpRpcClient,
} from "../utils";
// @ts-ignore
import config from "../config.json";

export const transfer = async (
	to: string,
	amount: string,
	withPM?: boolean
) => {
	const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
	const paymasterAPI = withPM
		? getVerifyingPaymaster(config.paymasterUrl, config.entryPoint)
		: undefined;
	const accountAPI = getSimpleAccount(
		provider,
		config.signingKey,
		config.entryPoint,
		config.simpleAccountFactory,
		paymasterAPI
	);

	const target = ethers.utils.getAddress(to);
	const value = ethers.utils.parseEther(amount);
	const op = await accountAPI.createSignedUserOp({
		target,
		value,
		data: "0x",
		...(await getGasFee(provider)),
	});
	console.log(`Signed UserOperation: ${await printOp(op)}`);

	const client = await getHttpRpcClient(
		provider,
		config.bundlerUrl,
		config.entryPoint
	);
	const uoHash = await client.sendUserOpToBundler(op);
	console.log(`UserOpHash: ${uoHash}`);

	console.log("Waiting for transaction...");
	const txHash = await accountAPI.getUserOpReceipt(uoHash);
	console.log(`Transaction hash: ${txHash}`);
};
