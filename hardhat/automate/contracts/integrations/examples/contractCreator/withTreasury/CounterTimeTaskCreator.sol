// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../../../AutomateTaskCreator.sol";

/**
 * @dev
 * Example contract that creates a time task.
 */
// solhint-disable not-rely-on-time
// solhint-disable no-empty-blocks
contract CounterTimeTaskCreator is AutomateTaskCreator {
    uint256 public count;
    uint256 public lastExecuted;
    bytes32 public taskId;
    uint256 public constant MAX_COUNT = 5;
    uint256 public constant INTERVAL = 3 minutes;

    event CounterTaskCreated(bytes32 taskId);

    constructor(address _automate, address _fundsOwner)
        AutomateTaskCreator(_automate, _fundsOwner)
    {}

    function createTask() external {
        require(taskId == bytes32(""), "Already started task");

        bytes memory execData = abi.encodeCall(this.increaseCount, (1));

        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });
        moduleData.modules[0] = Module.TIME;
        moduleData.modules[1] = Module.PROXY;

        moduleData.args[0] = _timeModuleArg(block.timestamp, INTERVAL);
        moduleData.args[1] = _proxyModuleArg();

        bytes32 id = _createTask(
            address(this),
            execData,
            moduleData,
            address(0)
        );

        taskId = id;
        emit CounterTaskCreated(id);
    }

    function increaseCount(uint256 _amount) external onlyDedicatedMsgSender {
        uint256 newCount = count + _amount;

        if (newCount >= MAX_COUNT) {
            _cancelTask(taskId);
            count = 0;
        } else {
            count += _amount;
            lastExecuted = block.timestamp;
        }
    }
}
