import React from "react";
import type { RecurPayment } from "@/lib/types";

type RecurCardProps = {
	name: string;
	taskId: string;
	interval: string;
	paymentType: string;
};

export function RecurCard({
	name,
	taskId,
	interval,
	paymentType,
}: RecurCardProps) {
	const lookup = { monthly: "bg-primary", weekly: "bg-secondary text-bg" };

	return (
		<div className="w-full bg-bg2 rounded-xl p-6">
			<div className="flex gap-2 items-center mb-4">
				<p className="text-xl font-bold">{name}</p>
				<p
					className={"text-sm font-medium px-1 rounded " + lookup[paymentType]}
				>
					{interval}
				</p>
			</div>
			<p>To: 0x94c....Da0d</p>
			<p>Amount: 0.001 ETH</p>
			<a
				className="font-medium text-purple-600 dark:text-white hover:underline"
				href={`https://app.gelato.network/task/${taskId}?chainId=80001`}
			>
				{`https://app.gelato.netw...`}
			</a>
		</div>
	);
}
