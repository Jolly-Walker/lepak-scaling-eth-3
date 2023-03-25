import React, { useState, Dispatch } from "react";

import { payments } from '@/lib/polybase';
import type { RecurPayment } from '@/lib/types';

export default function RecurModal({
  isOpen,
  setIsOpen,
  onClose,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  onClose: any
}) {
  // TODO: change to 1 usestate only
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState(0);
  const [date, setDate] = useState('');
  const [freq, setFreq] = useState('monthly');
  const [invalidInput, setInvalidInput] = useState('');

  const createPayment = async () => {
    if (to.length === 0 || date.length === 0) {
      setInvalidInput('Please fill in all fields');
      return;
    }
    if (amt === 0) {
      setInvalidInput('Please enter a valid amount to send');
      return;
    }
    // change id with transaction id of create recurring payment
    const rec = await payments.create(['0x1337testing4', '0x042c25573750b71b6d38C997654e43B3233F8E4D', to, amt, freq, date]);
    console.log('polybase.create:', rec);
    onClose(rec.data);
    cleanup();
    setIsOpen(false);
  }

  const cleanup = () => {
    setTo('');
    setAmt(0);
    setDate('');
    setFreq('');
    setInvalidInput('');
  }

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed w-full flex justify-center items-start pt-24 inset-0 h-screen overflow-y-auto bg-bg bg-opacity-90 z-50">
            <div className="bg-bg2 rounded-xl shadow-lg space-y-4 p-6 w-full max-w-lg">
              <h1 className="text-xl font-bold">Add recurring payment</h1>
              <div className="space-y-2 pb-4 pt-8">
                <div>
                  <label className="block mb-2">Payment address</label>
                  <input
                    required
                    className="input"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                  />
                </div>
                <div>
                  <label className="block mb-2">Amount</label>
                  <input 
                    required
                    className="input"
                    type="number"
                    placeholder="0.005 ETH" 
                    value={amt}
                    onChange={(e) => {
                      const n = parseFloat(e.target.value);
                      setAmt(isNaN(n) ? amt : n);
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-2">Payment date</label>
                  <input 
                    required 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input" 
                  />
                </div>
                <div className="flex gap-6 pt-2">
                  <div className="flex gap-2 items-center">
                    <input
                      required
                      id="monthly"
                      name="recur"
                      type="radio"
                      value="monthly"
                      checked={freq === "monthly"}
                      onChange={(e) => setFreq(e.target.value)}
                      className="w-6 h-6 accent-primary hover:cursor-pointer bg-bg3"
                    />
                    <label htmlFor="monthly" className="hover:cursor-pointer">
                      Monthly
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      required
                      id="weekly"
                      name="recur"
                      type="radio"
                      value="weekly"
                      checked={freq === "weekly"}
                      onChange={(e) => setFreq(e.target.value)}
                      className="w-6 h-6 accent-primary hover:cursor-pointer"
                    />
                    <label htmlFor="weekly" className="hover:cursor-pointer">
                      Weekly
                    </label>
                  </div>
                </div>
              </div>
              { invalidInput.length > 0 && (<>
                <small className="text-red-400 text-sm">{invalidInput}</small>
              </>)}
              <div className="flex gap-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-bg3 px-4 py-3 rounded-lg w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={createPayment}
                  className="bg-grad px-4 py-3 rounded-lg w-full"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
