import { ChangeEvent, useState } from "react";
import "./App.css";
import { SimpleAccountAPI } from "@account-abstraction/sdk";
import { ethers } from "ethers";
import { getSimpleAccount } from "./utils";
import { transfer, erc20Transfer } from "./simpleAccount";
import { DUMMY_TOKEN_POLYGON } from "./utils/constant";
import config from "./config.json";

function App() {
	const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
	const [wallet, setwallet] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [account, setAccount] = useState<SimpleAccountAPI>();
	const [form, setForm] = useState({
		address: "",
		amount: "",
	});

	const createWallet = async () => {
		setIsLoading(true);
		const accountAPI = getSimpleAccount(
			provider,
			config.signingKey,
			config.entryPoint,
			config.simpleAccountFactory
		);
		setwallet(await accountAPI.getCounterFactualAddress());
		setIsLoading(false);
		setAccount(accountAPI);
		console.log(accountAPI.getCounterFactualAddress());
		console.log(process.env);
	};

	const handleFormFieldChange = (
		fieldName: string,
		e: ChangeEvent<HTMLInputElement>
	) => {
		setForm({ ...form, [fieldName]: e.target.value });
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		erc20Transfer(DUMMY_TOKEN_POLYGON, form.address, form.amount, false);
	};

	return (
		<div className="App">
			<header className="App-header">
				<button
					onClick={() => createWallet()}
					className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
				>
					Create Wallet
				</button>
				{isLoading ? "Creating wallet" : wallet}
				{wallet ? (
					<form
						onSubmit={handleSubmit}
						className="w-1/2"
					>
						<label>Address</label>
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							type="text"
							placeholder="Address"
							value={form.address}
							onChange={(e) => handleFormFieldChange("address", e)}
						/>
						<label>Amount</label>
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							type="text"
							placeholder="Amount"
							value={form.amount}
							onChange={(e) => handleFormFieldChange("amount", e)}
						/>
						<button
							type="submit"
							className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							Transfer Fund
						</button>
					</form>
				) : null}
			</header>
		</div>
	);
}

export default App;
