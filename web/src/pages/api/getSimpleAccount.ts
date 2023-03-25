import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { SimpleAccountAPI } from "@account-abstraction/sdk";

const {
	RPC_URL,
	ENTRY_POINT_ADDRESS: entryPointAddress,
	SIMPLE_ACCOUNT_FACTORY_ADDRESS: factoryAddress,
} = process.env;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { password } = req.query;
	const signingKey = ethers.utils
		.keccak256(ethers.utils.toUtf8Bytes(password as string))
		.slice(2);

	const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
	const owner = new ethers.Wallet(signingKey, provider);
	const sw = new SimpleAccountAPI({
		provider,
		entryPointAddress: entryPointAddress as string,
		owner,
		factoryAddress,
	});

	const addr = await sw.getCounterFactualAddress();
	console.log("testing", addr, sw);
	res.status(200).json({ address: addr });
}
