# RecurriPay

## Intro 👋
RecurriPay stands for "Recurring Payments". To put it simply, it is a wallet which allows users to set up recurring payments. Addtionally it also has a social recovery feature which allows users to recover their funds in the event of private key loss.

### Try it yourself
link here


## Key features 🎲

![Home page](homePage.png)

![Diagram](diagram.png)

### Account abstraction 👤
![createWallet](createWallet.png)
The frontend of this project is built using Nextjs. Under the hood, this project builds on top of the `@account-abstraction-sdk` by Eth-infinitism to enable first class citizen contract accounts. We wrote smart contracts inheriting from SimpleAccount and SimpleAccountFactory with additional features - recurring payment and social recovery. 

### Recurring payment 🔂
For the former, when a user sets up a recurring payment order, we write it to the account smart contract (`setUpRecurringPayment`), create a task in Gelato Network and store the payment details in Polybase. It will then call the specified function to execute the transaction (`makeRecurringPayment`) every interval defined by the user. 

### Social recovery 🤝
![addRecoveryAddress](addRecoveryAddress.png)
As for social recovery, we have integrated with Optimism’s Attestation Station to achieve this feature. To set up social recovery, the account owner would specify 3 addresses as their social recovery addresses. In the event of losing the key to the ReccuriPay account, the account owner would create a new wallet and ask the owners of the registered social recovery accounts to make attestations that the account is lost, and specify the new wallet address. When all 3 addresses have attested. A function can be called in the account contract to move any tokens or ETH to the attested new wallet address. Optimism’s Attestation Station is easy to integrate and provides a simple and secure mechanism to build our social recovery feature. 

## The stack 🛠️
- Frontend: `Next.js`
    - Styling: `tailwind` `lottie` 
- Account abstraction: `eth-infinitism account-abstraction-sdk`
- Transaction automation: `Gelato Network`
- Smart Contract Development:  `hardhat` `solidity`
    - Deploy and address export: `hardhat-deploy`
    - SDK: `openzeppelin` `ethers` 
- Attestation: `Optimism's Attestation Station`
- Bundler infrastructure: `Stackup`
- Database: `Polybase`

## Getting started 🏁
### To deploy hardhat
```
// install dependencies
npm install 



```
### To run frontend
```
//if you are from root, head to web directory
cd web

//install dependencies
npm install 

//run in local
npm run dev
```