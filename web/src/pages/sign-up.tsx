import { useState } from "react";
import { useRouter } from "next/router";
import { useWalletContext } from "@/context/WalletContext";
import { getSigningKey } from "./api/getSigningKey";
import { transfer } from "./api/transfer";

export default function SignUp() {
	const { password, setPassword, setAddress, address } = useWalletContext();

	const router = useRouter();
	const [isContinue, setIsContinue] = useState(false);
	const [passwords, setPasswords] = useState(["", ""]);
	const [diffPassword, setDiffPassword] = useState("");
	const [addresses, setAddresses] = useState(["", "", ""]);
	const [noRecovAddr, setNoRecovAddr] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const nextStep = () => {
		if (passwords[0].length === 0 || passwords[1].length === 0) {
			setDiffPassword("Please enter your password in both fields.");
			return;
		}
		if (passwords[0] !== passwords[1]) {
			setDiffPassword(
				"Please make sure your password is the same in both fields."
			);
			return;
		}
		setIsContinue(true);
	};

	const createWallet = async () => {
		if (addresses[0].length === 0) {
			setNoRecovAddr("Please enter at least one recovery address.");
			return;
		}
		setIsLoading(true);
		// const key = getSigningKey(passwords[0]);
		// const account = await transfer(
		// 	"0x94cAf61FC2206EB31bf7DAF993b1b8577992Da0d",
		// 	"0.01",
		// 	key,
		// 	false
		// );
		// setAddress(account as string);
		router.push("/dashboard");
	};

	return (
		<div className="flex justify-center">
			<div className="bg-bg2 rounded-xl shadow-lg space-y-4 p-6 w-full max-w-lg">
				{!isContinue ? (
					<>
						<h1 className="text-xl font-bold">Create your wallet</h1>
						<p>
							To get started with RecurPay, simply choose a strong, unique
							password to protect your wallet. We recommend using a combination
							of uppercase and lowercase letters, numbers, and special
							characters to create a strong password.
						</p>
						<div className="space-y-2 pb-4 pt-8">
							<div>
								<label className="block mb-2">Your password</label>
								<input
									required
									type="password"
									value={passwords[0]}
									onChange={(e) => setPasswords([e.target.value, passwords[1]])}
									className="input"
								/>
							</div>
							<div>
								<label className="block mb-2">Confirm your password</label>
								<input
									required
									type="password"
									value={passwords[1]}
									onChange={(e) => setPasswords([passwords[0], e.target.value])}
									className="input"
								/>
							</div>
						</div>
						{diffPassword.length > 0 && (
							<>
								<small className="text-sm text-red-400">{diffPassword}</small>
							</>
						)}
						<button
							onClick={nextStep}
							className="bg-grad px-4 py-3 rounded-lg w-full"
						>
							Continue
						</button>
					</>
				) : (
					<>
						<h1 className="text-xl font-bold">Add recovery addresses</h1>
						<p>
							Add atleast one recovery address to secure your wallet. You can
							choose a trusted friend or family member who will be able to help
							you regain access to your wallet in the event that you forget your
							password. You can have up to three recovery addresses.
						</p>
						<div className="space-y-2 pb-4 pt-8">
							<div>
								<label className="block mb-2">Address #1</label>
								<input
									required
									className="input"
									value={addresses[0]}
									onChange={(e) =>
										setAddresses([e.target.value, addresses[1], addresses[2]])
									}
									placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
								/>
							</div>
							<div>
								<label className="block mb-2">Address #2</label>
								<input
									className="input"
									value={addresses[1]}
									onChange={(e) =>
										setAddresses([addresses[0], e.target.value, addresses[2]])
									}
									placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
								/>
							</div>
							<div>
								<label className="block mb-2">Address #3</label>
								<input
									className="input"
									value={addresses[2]}
									onChange={(e) =>
										setAddresses([addresses[0], addresses[1], e.target.value])
									}
									placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
								/>
							</div>
						</div>
						{noRecovAddr.length > 0 && (
							<>
								<small className="text-sm text-red-400">{noRecovAddr}</small>
							</>
						)}
						<button
							onClick={createWallet}
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
								"Create wallet"
							)}
						</button>
					</>
				)}
			</div>
		</div>
	);
}
