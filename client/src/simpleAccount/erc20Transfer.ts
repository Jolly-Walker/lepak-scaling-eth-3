import { ethers } from "ethers";
import {
	ERC20_ABI,
	// getVerifyingPaymaster,
	getSimpleAccount,
	getGasFee,
	printOp,
	getHttpRpcClient,
} from "../utils";
// @ts-ignore
import config from "../config.json";

export const erc20Transfer = async (
	tkn: string, //token address
	t: string, //to address
	amt: string, // amount
	withPM?: boolean
) => {
	const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
	// const paymasterAPI = withPM
	// 	? getVerifyingPaymaster(config.paymasterUrl, config.entryPoint)
	// 	: undefined;
	const accountAPI = getSimpleAccount(
		provider,
		config.signingKey,
		config.entryPoint,
		config.simpleAccountFactory
		// paymasterAPI
	);

	const token = ethers.utils.getAddress(tkn);
	const to = ethers.utils.getAddress(t);
	const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
	const [symbol, decimals] = await Promise.all([
		erc20.symbol(),
		erc20.decimals(),
	]);
	console.log(erc20);
	const amount = ethers.utils.parseUnits(amt, decimals);
	console.log(erc20.interface.encodeFunctionData("transfer", [to, amount]));

	console.log(`Transferring ${amt} ${symbol}...`);

	const op = await accountAPI.createSignedUserOp({
		target: erc20.address,
		data: erc20.interface.encodeFunctionData("transfer", [to, amount]),
		...(await getGasFee(provider)),
	});
	const client = await getHttpRpcClient(
		provider,
		config.bundlerUrl,
		config.entryPoint
	);
	const uoHash = await client.sendUserOpToBundler(op);
	console.log("Waiting for transaction...");
	const txHash = await accountAPI.getUserOpReceipt(uoHash);
	console.log(`Transaction hash: ${txHash}`);
};
