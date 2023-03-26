import React, { Dispatch, useContext, useState } from "react";
import { WalletContext } from "@/context/WalletContext";
import { ethers } from "ethers";
import { CHAIN_ID, mainWalletABI, TOKEN_ADDRESS } from "@/constants";
import { AutomateSDK } from "@gelatonetwork/automate-sdk";

interface IForm {
	payeeWallet: string;
	amount: string;
	startTime: number;
	interval: number;
}

export default function RecurModal({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: Dispatch<boolean>;
}) {
	const { address } = useContext(WalletContext);
	const [form, setForm] =
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useState<IForm>({
			payeeWallet: "",
			amount: "",
			startTime: 0,
			interval: 1,
		});

	const [link, setLink] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleChange = (name: any, event: any) => {
		setForm({
			...form,
			[name]: event.target.value,
		});
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		console.log(address);
		console.log(form.interval * 60);
		const provider = new ethers.providers.JsonRpcProvider(
			process.env.NEXT_PUBLIC_ALCHEMY_RPC
		);
		const signer = new ethers.Wallet(
			process.env.NEXT_PUBLIC_SPONSOR_KEY as string,
			provider
		);
		const walletContract = new ethers.Contract(address, mainWalletABI, signer);
		console.log(walletContract);
		console.log(form.payeeWallet);
		console.log(TOKEN_ADDRESS.MATIC_MUMBAI);
		console.log(provider.getBlockNumber());
		const value = ethers.utils.parseEther(form.amount);
		console.log(value);
		try {
			await walletContract.setUpReccuringPayment(
				form.payeeWallet,
				value,
				TOKEN_ADDRESS.MATIC_MUMBAI,
				30,
				// Date.now()
				provider.getBlockNumber()
			);
		} catch (error) {
			console.log(error);
		}

		const automate = new AutomateSDK(CHAIN_ID.MUMBAI, signer);

		// Prepare Task data to automate
		console.log(walletContract.interface);
		const selector = walletContract.interface.getSighash(
			"makeReccuringPayment(address)"
		);
		const execData = walletContract.interface.encodeFunctionData(
			"makeReccuringPayment",
			[form.payeeWallet]
		);
		const startTime = form.startTime; // start timestamp in seconds or 0 to start immediately (default: 0)
		const interval = form.interval * 60; // execution interval in seconds

		// Create task
		console.log("Creating Task...");
		try {
			const { taskId, tx } = await automate.createTask({
				execAddress: walletContract.address,
				execSelector: selector,
				execData,
				execAbi: JSON.stringify(mainWalletABI),
				startTime,
				interval: form.interval * 60,
				name: "Recurring payment",
				dedicatedMsgSender: true, // Proxy caller
				singleExec: false, //Repeat the task
				useTreasury: false, // use false if your task is self-paying
			});
			await tx.wait();
			console.log(`Task created, taskId: ${taskId} (tx hash: ${tx.hash})`);
			setLink(`https://app.gelato.network/task/${taskId}?chainId=80001`);
		} catch (error) {
			console.log(error);
		}
		setForm({
			payeeWallet: "",
			amount: "",
			startTime: 0,
			interval: 1,
		});
		setIsLoading(false);
	};

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
										placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
										value={form.payeeWallet}
										name="payWallet"
										onChange={() => handleChange("payeeWallet", event)}
									/>
								</div>
								<div>
									<label className="block mb-2">Amount</label>
									<input
										required
										type="number"
										className="input"
										placeholder="0.005 ETH"
										value={form.amount}
										name="amount"
										onChange={() => handleChange("amount", event)}
									/>
								</div>
								<div>
									<label className="block mb-2">Payment date</label>
									<input
										required
										type="date"
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
											className="w-6 h-6 accent-primary hover:cursor-pointer bg-bg3"
										/>
										<label
											htmlFor="monthly"
											className="hover:cursor-pointer"
										>
											Monthly
										</label>
									</div>
									<div className="flex gap-2 items-center">
										<input
											required
											id="weekly"
											name="recur"
											type="radio"
											className="w-6 h-6 accent-primary hover:cursor-pointer"
										/>
										<label
											htmlFor="weekly"
											className="hover:cursor-pointer"
										>
											Weekly
										</label>
									</div>
									<div className="flex gap-2 items-center">
										<input
											required
											id="weekly"
											name="recur"
											type="radio"
											className="w-6 h-6 accent-primary hover:cursor-pointer"
										/>
										<label
											htmlFor="weekly"
											className="hover:cursor-pointer"
										>
											Hourly
										</label>
									</div>
									<div className="flex gap-2 items-center">
										<input
											required
											id="weekly"
											name="recur"
											type="radio"
											className="w-6 h-6 accent-primary hover:cursor-pointer"
										/>
										<label
											htmlFor="weekly"
											className="hover:cursor-pointer"
										>
											Minute
										</label>
									</div>
								</div>
								<div>
									<label className="block mb-2">Interval</label>
									<input
										required
										type="number"
										className="input"
										placeholder="eg. 2"
										value={form.interval}
										name="interval"
										onChange={() => handleChange("interval", event)}
									/>
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
									onClick={handleSubmit}
									className="bg-grad px-4 py-3 rounded-lg w-full flex items-center justify-center"
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
										"Continue"
									)}
								</button>
							</div>
							<div>
								{link ? (
									<div className="mt-1 ">
										<a
											href={link}
											className="w-1/2"
										>
											View more: {link.slice(0, 40)}...
										</a>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
