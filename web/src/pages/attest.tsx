import React, { useState } from "react";
// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import { InjectedConnector } from 'wagmi/connectors/injected';
import { ethers } from "ethers";
import attestationProxyAbi from "@/lib/attestationProxyABI.json";

export default function Attest() {
  const [addr, setAddr] = useState("");
  const [newAddr, setNewAddr] = useState("");

  const encodeRawKey = (rawKey) => {
    if (rawKey.length < 32) return ethers.utils.formatBytes32String(rawKey);

    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawKey));
    return hash.slice(0, 64) + "ff";
  };

  // TODO: fix
  const attest = async () => {
    const key = encodeRawKey("confirm.account.recovery");
    const val = ethers.utils.solidityPack(
      ["address"],
      ["0xcd3B766CCDd6AE721141F452C550Ca635964ce71"]
    );
    const msgHash = ethers.utils.solidityKeccak256(
      ["address", "bytes32", "bytes"],
      [
        "0x042c25573750b71b6d38C997654e43B3233F8E4D",
        encodeRawKey(key),
        ethers.utils.toUtf8Bytes(val),
      ]
    );

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }], // the chain ID for Polygon Mumbai Testnet is 0x13881
    });
    await window.ethereum.enable();
    //get the signer
    const signer = provider.getSigner();

    //sign the message
    const sig = await signer.signMessage(ethers.utils.arrayify(msgHash));

    const rpc =
      "https://polygon-mumbai.g.alchemy.com/v2/O2hr5ferYvqzEiz-c0yP4RE7xK_KiV96";
    const sprovider = new ethers.providers.JsonRpcProvider(rpc);
    const ssigner = sprovider.getSigner();
    const abi = attestationProxyAbi;
    const contract = new ethers.Contract(
      "0x1a1f1720A3a4CF7E1DE28434672e6b61643a943D",
      abi,
      sprovider
    );
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // const account = accounts[0];
    const r = await contract
      .connect(signer)
      .attest("0x042c25573750b71b6d38C997654e43B3233F8E4D", key, val, sig);
    await r.wait();
    console.log(r);
    // const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/your-project-id');
    // const AttestationProxy = new ethers.Contract()
    // const a = AttestationProxy.attach('0x1a1f1720A3a4CF7E1DE28434672e6b61643a943D')
  };

  return (
    <div className="flex justify-center">
      <div className="bg-bg2 rounded-xl shadow-lg space-y-4 p-6 w-full max-w-lg">
        <h1 className="text-xl font-bold">Recover an account</h1>
        <p>
          Help a friend recover their wallet by confirming their identity with
          our social recovery feature. Simply enter the address of the account
          to recover.
        </p>
        <div className="space-y-2 pb-4 pt-8">
          <div>
            <label className="block mb-2">Account to recover</label>
            <input
              required
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              className="input"
            />
          </div>
        </div>
        {true && (
          <>
            <small className="text-sm text-red-400">{""}</small>
          </>
        )}
        <button
          onClick={attest}
          className="bg-grad px-4 py-3 rounded-lg w-full"
        >
          Confirm account identity
        </button>
      </div>
    </div>
  );
}
