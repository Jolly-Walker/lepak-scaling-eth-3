// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@account-abstraction/contracts/samples/SimpleAccount.sol";
import "./AttestationStation.sol";

// added some starter code
contract MainWallet is SimpleAccount {
    //create an event type to emit when social recovery accounts are added
    event SocialRecoveryAccountAdded(
        address recoveryAccount1,
        address recoveryAccount2,
        address recoveryAccount3
    );

    event NewAccountCreated(address newAccount);

    event TokensRecovered(
        address newAccount,
        address tokenContractAddress,
        uint256 tokenBalance
    );

    event EthRecovered(address newAccount, uint256 ethBalance);

    struct ReccuringPayeeInfo {
        uint256 paymentAmount;
        address token;
        uint256 period;
        uint256 lastPaymentBlock;
    }

    mapping(address => ReccuringPayeeInfo) public reccuringPayments;
    address[] public payees;
    // address[] public socialRecoveryAccounts;
    address public attestationStation;
    AttestationStation attestationStationContract;

    address public recoveryAccount1;
    address public recoveryAccount2;
    address public recoveryAccount3;
    address public newAccount; // new wallet if user lost the current wallet

    constructor(
        IEntryPoint anEntryPoint,
        address _attestationStation
    ) SimpleAccount(anEntryPoint) {
        attestationStation = _attestationStation;
        attestationStationContract = AttestationStation(attestationStation);
    }

    // only wallet owner can call
    function setUpReccuringPayment(
        address _payeeWallet,
        uint256 _amount,
        address _token,
        uint256 _period,
        uint256 _firstPaymentBlock
    ) public onlyOwner {
        ReccuringPayeeInfo memory newInfo;
        newInfo.paymentAmount = _amount;
        newInfo.token = _token;
        newInfo.period = _period;
        newInfo.lastPaymentBlock - _firstPaymentBlock;

        payees.push(_payeeWallet);
        reccuringPayments[_payeeWallet] = newInfo;
        // emit some event
    }

    // only wallet owner can call
    function removeReccuringPayment(
        uint256 _payeeIndex
    ) public onlyOwner {
        address payeeWallet = payees[_payeeIndex];
        payees[_payeeIndex] = payees[payees.length-1];
        payees.pop();
        delete reccuringPayments[payeeWallet];
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
    ) external {
        recoveryAccount1 = _account1;
        recoveryAccount2 = _account2;
        recoveryAccount3 = _account3;

        // emit some event
        emit SocialRecoveryAccountAdded(
            recoveryAccount1,
            recoveryAccount2,
            recoveryAccount3
        );
    }

    // anyone can call
    // check attestationStation for signatures, saying this account has been lost
    // if signatures are valid, then
    // from the attestations, derive the address of the new wallet
    // set that wallet as newAccount
    function recoverAccount(bytes32 recoveryKey) external returns (address) {
        bool attestationStatus = getAttestation(recoveryKey);
        require(attestationStatus, "Not all attestations are valid");

        //Derive the new account address by calling the factory function, a sample is used for now
        newAccount = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;

        emit NewAccountCreated(newAccount);

        return newAccount;
    }

    // anyone can call
    function recoverWalletTokens(address[] calldata _tokens) external {
        require(newAccount != address(0), "no recovery wallet was establised");
        for (uint256 i = 0; i < _tokens.length; i++) {
            IERC20(_tokens[i]).transfer(
                newAccount,
                IERC20(_tokens[i]).balanceOf(address(this))
            );
            emit TokensRecovered(
                newAccount,
                _tokens[i],
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
        emit EthRecovered(newAccount, address(this).balance);
    }

    // function recoverWalletNFTs(address[] calldata _tokens) external {
    //     require(newAccount != address(0), "no recovery wallet was establised");

    // }

    function stringToBytes32(
        string memory source
    ) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function getAttestation(bytes32 recoveryKey) public view returns (bool) {
        //Connect to the attestation station and get the signatures from the recovery accounts
        bytes32 attestation1 = bytes32(
            attestationStationContract.attestations(
                recoveryAccount1,
                address(this),
                recoveryKey
            )
        );

        bytes32 attestation2 = bytes32(
            attestationStationContract.attestations(
                recoveryAccount2,
                address(this),
                recoveryKey
            )
        );

        bytes32 attestation3 = bytes32(
            attestationStationContract.attestations(
                recoveryAccount3,
                address(this),
                recoveryKey
            )
        );

        bool attestationStatus;
        bytes32 valid = stringToBytes32("1");

        //all values above should not equal to "0x"
        if (
            attestation1 == valid &&
            attestation2 == valid &&
            attestation3 == valid
        ) {
            attestationStatus = true;
        } else {
            attestationStatus = false;
        }

        return attestationStatus;
    }
}
