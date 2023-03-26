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
  const { key } = req.query;

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const owner = new ethers.Wallet('0xac5bbdd9b7138f413e849e9e9d91d9a81735bbbf9a661ac4818f195c23a74afa', provider);
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
