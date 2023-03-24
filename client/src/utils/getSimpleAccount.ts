import { SimpleAccountAPI, PaymasterAPI } from "@account-abstraction/sdk";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

/**
 * Function that return a simple wallet object
 * @param provider RPC provider
 * @param signingKey sender private key
 * @param entryPointAddress ERC-4337 entry point address
 * @param factoryAddress Simple account factory address
 * @param paymasterAPI Paymaster API
 * @returns
 */
export function getSimpleAccount(
	provider: JsonRpcProvider,
	signingKey: string,
	entryPointAddress: string,
	factoryAddress: string,
	paymasterAPI?: PaymasterAPI
) {
	const owner = new ethers.Wallet(signingKey, provider);
	const sw = new SimpleAccountAPI({
		provider,
		entryPointAddress,
		owner,
		factoryAddress,
		paymasterAPI,
	});

	sw.getUserOpReceipt = async (
		userOpHash: string,
		timeout = 30000,
		interval = 5000
	): Promise<string | null> => {
		const endtime = Date.now() + timeout;
		const block = await sw.provider.getBlock("latest");
		while (Date.now() < endtime) {
			// @ts-ignore
			const events = await sw.entryPointView.queryFilter(
				// @ts-ignore
				sw.entryPointView.filters.UserOperationEvent(userOpHash),
				Math.max(0, block.number - 100)
			);
			if (events.length > 0) {
				return events[0].transactionHash;
			}
			await new Promise((resolve) => setTimeout(resolve, interval));
		}
		return null;
	};
	console.log(owner);
	console.log(sw);
	return sw;
}
