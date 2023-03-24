import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers';
import { SimpleAccountAPI, PaymasterAPI } from '@account-abstraction/sdk';

const { RPC_URL, SIGNING_KEY, ENTRY_POINT_ADDRESS: entryPointAddress, SIMPLE_ACCOUNT_FACTORY_ADDRESS: factoryAddress } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const owner = new ethers.Wallet(SIGNING_KEY as string, provider)
  const sw = new SimpleAccountAPI({provider, entryPointAddress, owner, factoryAddress, PaymasterAPI});

  sw.getUserOpReceipt = async (userOpHash: string, timeout = 3000, interval = 5000): Promise<string | null> => {
    const endtime = Date.now() + timeout;
    const block = await sw.provider.getBlock('latest');
    while (Date.now() < endtime) {
      const events = await sw.entryPointView.queryFilter(
        sw.entryPointView.filters.UserOperationEvent(userOpHash),
        Math.max(0, block.number - 100)
      )
      if (events.length > 0) return events[0].transactionHash;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }

  const addr = await sw.getCounterFactualAddress()
  console.log('testing', addr);
  res.status(200).json({ address: addr });
}
