import { AutomateSDK, isAutomateSupported } from "@gelatonetwork/automate-sdk";
import { Contract } from "ethers";
import hre from "hardhat";


export async function createRecurringPaymentTask(
    _payeeWallet,
    _interval,
    _userAccountAddress,
    _abi
) {
    // Check if current connected chain is supported by Automate 
    const chainId = hre.network.config.chainId;
    if (!isAutomateSupported(chainId)) {
        console.log(`Automate network not supported (${chainId})`);
        return;
    }

    //Init Automate SDK
    const [signer] = await hre.ethers.getSigners();
    const automate = new AutomateSDK(chainId, signer);

    // Prepare Task data to automate
    const userAccount = new Contract(_userAccountAddress, _abi, signer);
    const selector = userAccount.interface.getSighash("makeRecurringPayment(address)");
    const execData = userAccount.interface.encodeFunctionData("makeRecurringPayment", [_payeeWallet]);
    const startTime = Math.floor(Date.now() / 1000) + 60; // start in 1 minute
    const interval = 2 * 60; // exec every 5 minutes

    // Create task
    console.log("Creating Task...");
    const { taskId, tx } = await automate.createTask({
        execAddress: userAccount.address,
        execSelector: selector,
        execData,
        execAbi: JSON.stringify(_abi),
        startTime,
        interval,
        name: "Automated counter every 5min",
        dedicatedMsgSender: true,
    });
    await tx.wait();
    console.log(`Task created, taskId: ${taskId} (tx hash: ${tx.hash})`);
    console.log(`> https://app.gelato.network/task/${taskId}?chainId=${chainId}`);

    return taskId;
}


/** 
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
    */