import { useState, useEffect } from "react";
import RecurCard from "@/components/RecurCard";
import RecurModal from "@/components/RecurModal";
import { payments } from "@/lib/polybase";
import type { RecurPayment } from "@/lib/types";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState({});
  const [recurringPayments, setRecurringPayments] = useState<RecurPayment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // payments from lib/polybase doesn't run server side
  const getPayments = async () => {
    const res = await payments.get();
    setRecurringPayments(res.data.map((d) => d.data));
    setIsLoading(false);
    console.log(res, recurringPayments);
  };

  useEffect(() => {
    getPayments();
    const stored = localStorage.getItem("wallet");
    setWallet(JSON.parse(stored));
  }, []);

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome back, {wallet.address}</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full bg-bg2 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold">Your balance</h2>
            <p className="text-4xl md:text-5xl font-bold">0.06 ETH</p>
            <p className="text-xl">$120USD</p>
            <hr />
            <h2 className="text-xl font-bold">Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col items-center">
                {/* TODO: convert these to components */}
                <div className="bg-grad rounded-lg p-4 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p>Buy</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-grad rounded-lg p-4 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </div>
                <p>Send</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-grad rounded-lg p-4 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3"
                    />
                  </svg>
                </div>
                <p>Receive</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-grad rounded-lg p-4 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
                <p>Swap</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-bg2 rounded-xl p-6">
            <h2 className="text-xl font-bold">Your balance</h2>
            <div className="py-4 flex justify-between items-center border-b">
              <p>Contract call...</p>
              <a href="https://etherscan.com">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div className="py-4 flex justify-between items-center border-b">
              <p>Contract call...</p>
              <a href="https://etherscan.com">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div className="py-4 flex justify-between items-center border-b">
              <p>Contract call...</p>
              <a href="https://etherscan.com">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <a
              href="/transactions"
              className="block text-center p-4 text-xl font-bold"
            >
              View all
            </a>
          </div>
        </div>
        <h2 className="text-xl font-bold">Your recurring payments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {/* skeleton loader */}
          {isLoading &&
            [1, 2, 3].map((i) => (
              <div
                className="w-full bg-bg3 rounded-xl p-6 animate-pulse space-y-4"
                key={i}
              >
                <div className="h-8 bg-white bg-opacity-10 rounded-md" />
                <div className="h-4 bg-white bg-opacity-10 rounded-md" />
                <div className="h-4 bg-white bg-opacity-10 rounded-md" />
                <div className="h-4 bg-white bg-opacity-10 rounded-md" />
              </div>
            ))}
          {recurringPayments.map((p: RecurPayment, id) => (
            <RecurCard key={id} id={id + 1} payment={p} />
          ))}
          <button
            onClick={() => setIsOpen(true)}
            className="bg-bg3 rounded-xl p-6 flex flex-col justify-center items-center gap-4 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Add new recurring payment</p>
          </button>
        </div>
      </div>
      <RecurModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={(r: RecurPayment) =>
          setRecurringPayments([...recurringPayments, r])
        }
      />
    </>
  );
}
