import { AutomateSDK, isAutomateSupported } from "@gelatonetwork/automate-sdk";
import { Contract } from "ethers";
import hre from "hardhat";


export async function createRecurringPaymentTask(
    _payeeWallet,
    _startTime,
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
    const startTime = _startTime; // start timestamp in seconds or 0 to start immediately (default: 0)
    const interval = _interval; // execution interval in seconds

    // Create task
    console.log("Creating Task...");
    const { taskId, tx } = await automate.createTask({
        execAddress: userAccount.address,
        execSelector: selector,
        execData,
        execAbi: JSON.stringify(_abi),
        startTime,
        interval,
        name: "Recurring payment",
        dedicatedMsgSender: true, // Proxy caller 
        singleExec: false, //Repeat the task
        useTreasury: false // use false if your task is self-paying
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