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
    // address public attestationStation;

    constructor(IEntryPoint anEntryPoint /*, address[] calldata _recoveryAccounts*/) SimpleAccount(anEntryPoint) {
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
    }


}