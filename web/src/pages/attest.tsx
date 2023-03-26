import React, { useState } from "react";
import { ethers } from "ethers";
import attestationProxyAbi from "@/lib/attestationProxyABI.json";
import attestationStationAbi from "@/lib/attestationStationABI.json";

export default function Attest() {
  const [addr, setAddr] = useState("");
  const [newAddr, setNewAddr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const encodeRawKey = (rawKey: string) => {
    if (rawKey.length < 32) return ethers.utils.formatBytes32String(rawKey);

    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawKey));
    return hash.slice(0, 64) + "ff";
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(newAddr);
  }

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
        addr,
        key,
        val,
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
    console.log(sig)

    const contract = new ethers.Contract(
      "0x73b821968d8161Bff524Fae22c898f0CF6E32901",
      attestationProxyAbi,
      signer
    );

    const r = await contract
      .attest("0x042c25573750b71b6d38C997654e43B3233F8E4D", key, val, sig);
    await r.wait();
    console.log(r);
    
    const getContract = new ethers.Contract("0x1a1f1720A3a4CF7E1DE28434672e6b61643a943D", attestationStationAbi, signer);
    const res = await getContract.attestations(signer.getAddress(), addr, key);
    console.log(res)
    setNewAddr(res);
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
          {isLoading ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
                />
              </svg>
            </>
          ) : (
            "Confirm account identity"
          )}
        </button>
        { newAddr.length > 0 && (<div>
          <p className="px-2">New account address (click to copy): </p>
          <p className="hover:cursor-pointer hover:bg-white hover:bg-opacity-10 p-2 rounded-md active:bg-opacity-0" onClick={copyAddr}>{newAddr}</p>
        </div>)}
      </div>
    </div>
  );
}
