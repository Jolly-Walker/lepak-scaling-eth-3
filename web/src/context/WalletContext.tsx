import { createContext, ReactNode, useContext, useState } from "react";
import { ethers } from "ethers";
import { getAccount } from "@/pages/api/getAccount";
import { getSigningKey } from "@/pages/api/getSigningKey";

interface WalletContextType {
	address?: string;
	signingKey?: string;
	password?: string;
	setPassword: (password: string) => void;
	setAddress: (address: string) => void;
	setSigningKey: (signingKey: string) => void;
}

export const WalletContext = createContext<WalletContextType>({
	setAddress: () => {},
	setSigningKey: () => {},
	setPassword: () => {},
});

type Props = {
	children: ReactNode;
};

export const WalletContextProvider = ({ children }: Props) => {
	const [address, setAddress] = useState<string | undefined>();
	const [signingKey, setSigningKey] = useState<string | undefined>("");
	const [password, setPassword] = useState<string | undefined>("");

	return (
		<WalletContext.Provider
			value={{
				address,
				signingKey,
				password,
				setPassword,
				setAddress,
				setSigningKey,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};

export const useWalletContext = () => useContext(WalletContext);
