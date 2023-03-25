import React from "react";
import type { RecurPayment } from '@/lib/types';

export default function RecurCard({ id, payment }: { id: number, payment: RecurPayment }) {
  const lookup = { monthly: "bg-primary", weekly: "bg-secondary text-bg" };

  return (
    <div className="w-full bg-bg2 rounded-xl p-6">
      <div className="flex gap-2 items-center mb-4">
        <p className="text-xl font-bold">Payment #{id}</p>
        <p
          className={"text-sm font-medium px-1 rounded " + lookup[payment.frequency]}
        >
          {payment.frequency}
        </p>
      </div>
      <p className="truncate">To: {payment.addrTo}</p>
      <p>Amount: {payment.amount} ETH</p>
      <p>Due date: {payment.date}</p>
    </div>
  );
}
