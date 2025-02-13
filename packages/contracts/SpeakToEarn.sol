// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SpeakToEarn {
    address public owner;
    uint256 public constant REWARD_AMOUNT = 0.01 ether; // Fixed reward amount
    mapping(string => bool) public processedTasks;

    event PaymentSent(address recipient, uint256 amount, string taskId);
    event FundsDeposited(address sender, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function sendPayment(address recipient, string memory taskId) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(!processedTasks[taskId], "Task already processed");
        require(address(this).balance >= REWARD_AMOUNT, "Insufficient contract balance");

        processedTasks[taskId] = true;
        (bool success, ) = recipient.call{value: REWARD_AMOUNT}("");
        require(success, "Payment failed");

        emit PaymentSent(recipient, REWARD_AMOUNT, taskId);
    }

    function depositFunds() external payable {
        require(msg.value > 0, "Must send some funds");
        emit FundsDeposited(msg.sender, msg.value);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Allow contract to receive funds
    receive() external payable {}
}
