import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import attestationProxyAbi from "@/lib/attestationProxyABI.json";

const { ALCHEMY_KEY, ATTESTATION_PROXY_CONTRACT } = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rpc = "https://polygon-mumbai.g.alchemy.com/v2/" + ALCHEMY_KEY;
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const abi = attestationProxyAbi;
  const contract = new ethers.Contract(
    ATTESTATION_PROXY_CONTRACT as string,
    abi,
    provider
  );
  const r = await contract.attest("");
  await r.wait();

  res.status(200).json(r);
}
