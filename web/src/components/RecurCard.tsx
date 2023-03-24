import React from 'react';

export default function RecurCard({ paymentType }: { paymentType: string }) {
  const lookup = { monthly: 'bg-primary', weekly: 'bg-secondary text-bg' }; 

  return (
    <div className="w-full bg-bg3 rounded-xl p-6">
      <div className="flex gap-2 items-center mb-4">
        <p className="text-xl font-bold">Payment #1</p>
        <p className={ "text-sm font-medium px-1 rounded " + lookup[paymentType]}>
          { paymentType}
        </p>
      </div>
      <p>To: 0x1337...</p>
      <p>Amount: 0.005 ETH</p>
      <p>Due date: 17 March 2023</p>
    </div>
  )
}
