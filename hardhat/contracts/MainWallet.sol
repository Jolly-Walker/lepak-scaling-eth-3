// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@account-abstraction/contracts/samples/SimpleAccount.sol";

// added some starter code
contract MainWallet is SimpleAccount {
    struct ReccuringPayeeInfo {
        uint256 paymentAmount;
        address token;
        uint256 period;
        uint256 lastPaymentBlock;
    }

    mapping(address => ReccuringPayeeInfo) public reccuringPayments;
    // address[] public socialRecoveryAccounts;
    address public attestationStation;
    address public recoveryAccount1;
    address public recoveryAccount2;
    address public recoveryAccount3;
    address public newAccount; // new wallet if user lost the current wallet

    constructor(
        IEntryPoint anEntryPoint,
        address _attestationStation
    ) SimpleAccount(anEntryPoint) {
        attestationStation = _attestationStation;
    }

    // only wallet owner can call
    function setUpReccuringPayment(
        address _payeeWallet,
        uint256 _amount,
        address _token,
        uint256 _period,
        uint256 _firstPaymentBlock
    ) public {
        ReccuringPayeeInfo memory newInfo;
        newInfo.paymentAmount = _amount;
        newInfo.token = _token;
        newInfo.period = _period;
        newInfo.lastPaymentBlock - _firstPaymentBlock;

        reccuringPayments[_payeeWallet] = newInfo;
        // emit some event
    }

    // Used off-chain to check if payment is needed
    function isPaymentNeeded(address _payeeWallet) public view returns (bool) {
        ReccuringPayeeInfo memory info = reccuringPayments[_payeeWallet];
        if (info.paymentAmount > 0) {
            return (info.lastPaymentBlock + info.period) > block.number;
        } else {
            return false;
        }
    }

    // Used to make reccuring payment
    function makeReccuringPayment(address _payeeWallet) public {
        require(isPaymentNeeded(_payeeWallet), "payment not made");

        ReccuringPayeeInfo memory info = reccuringPayments[_payeeWallet];
        IERC20(info.token).transfer(_payeeWallet, info.paymentAmount);
        reccuringPayments[_payeeWallet].lastPaymentBlock += block.number;

        // emit some event
    }

    // only wallet owner can call
    function setUpSocialRecovery(
        address _account1,
        address _account2,
        address _account3
    ) external onlyOwner {
        recoveryAccount1 = _account1;
        recoveryAccount2 = _account2;
        recoveryAccount3 = _account3;

        // emit some event
    }

    // anyone can call
    function recoverAccount() external {
        // check attestationStation for signatures, saying this account has been lost
        // from the attestations, derive the address of the new wallet
        // set that wallet as newAccount
    }

    // anyone can call
    function recoverWalletTokens(address[] calldata _tokens) external {
        require(newAccount != address(0), "no recovery wallet was establised");
        for (uint256 i = 0; i < _tokens.length; i++) {
            IERC20(_tokens[i]).transfer(
                newAccount,
                IERC20(_tokens[i]).balanceOf(address(this))
            );
        }
    }

    // anyone can call
    function recoverWalletEth() external {
        require(newAccount != address(0), "no recovery wallet was establised");
        bool sent = payable(newAccount).send(address(this).balance);
        require(sent, "Failed to send Ether");

        // emit some event
    }

    // function recoverWalletNFTs(address[] calldata _tokens) external {
    //     require(newAccount != address(0), "no recovery wallet was establised");

    // }
}
