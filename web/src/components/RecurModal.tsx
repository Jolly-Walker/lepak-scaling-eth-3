import React, { Dispatch } from 'react';

export default function RecurModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<boolean> }) {
  return (
    <>
      { isOpen && (<>
        <div className="fixed w-full flex justify-center items-start pt-24 inset-0 h-screen overflow-y-auto bg-bg bg-opacity-90 z-50">
          <div className="bg-bg2 rounded-xl shadow-lg space-y-4 p-6 w-full max-w-lg">
            <h1 className="text-xl font-bold">Add recurring payment</h1>
            <p>desc</p>
            <div className="space-y-2 pb-4 pt-8">
              <div>
                <label className="block mb-2">Payment address</label>
                <input className="bg-bg3 rounded-lg p-2 w-full"/>
              </div>
              <div>
                <label className="block mb-2">Amount</label>
                <input className="bg-bg3 rounded-lg p-2 w-full"/>
              </div>
              <div>
                <label className="block mb-2">Payment date</label>
                <input type="date" className="bg-bg3 rounded-lg p-2 w-full"/>
              </div>
              <div className="flex gap-6 pt-2">
                <div className="flex gap-2 items-center">
                  <input id="monthly" name="recur" type="radio" className="w-6 h-6 accent-primary hover:cursor-pointer bg-bg3"/>
                  <label htmlFor="monthly" className="hover:cursor-pointer">Monthly</label>
                </div>
                <div className="flex gap-2 items-center">
                  <input id="weekly" name="recur" type="radio" className="w-6 h-6 accent-primary hover:cursor-pointer"/>
                  <label htmlFor="weekly" className="hover:cursor-pointer">Weekly</label>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsOpen(false)} 
                className="bg-bg3 px-4 py-3 rounded-lg w-full"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="bg-grad px-4 py-3 rounded-lg w-full"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </>)}
    </>
  )
}
