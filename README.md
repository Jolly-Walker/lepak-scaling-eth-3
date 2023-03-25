# RecurriPay

## Intro 👋
RecurriPay stands for "Recurring Payments". To put it simply, it is a wallet which allows users to set up recurring payments. Addtionally it also has a social recovery feature which allows users to recover their funds in the event of private key loss. 
___

## Key features 🎲

![Diagram](diagram.png)

### Account abstraction 👤
The frontend of this project is built using Nextjs. Under the hood, this project builds on top of the `@account-abstraction-sdk` by Eth-infinitism to enable first class citizen contract accounts. We wrote smart contracts inheriting from SimpleAccount and SimpleAccountFactory with additional features - recurring payment and social recovery. 

### Recurring payment 🔂
For the former, when a user sets up a recurring payment order, we write it to the account smart contract (`setUpRecurringPayment`) as well as creating a task in Gelato Network. It will then call the specified function to execute the transaction (`makeRecurringPayment`) every interval defined by the user. 

### Social recovery 🤝
As for social recovery, we are using Optimism’s Attestation Station. First, the user specifies 3 addresses that can attest for them in the event of lost access to the account. In order to recover the funds within it, the 3 addresses need to send an attestation to the smart contract. Then, a function can be called in the account contract to move the funds to another address. Optimism’s Attestation Station is easy to integrate and provides a simple and secure mechanism to build our social recovery feature.

## The stack 🛠️
- Frontend: `Next.js`
- Account abstraction: `eth-infinitism account-abstraction-sdk`
- Transaction automation: `Gelato Network`
- Smart Contract Development:  `hardhat`
- Attestation: `Optimism's Attestation Station`
- Bundler infrastructure: `Stackup`

## Getting started 🏁
```
// install dependencies
npm install 



```