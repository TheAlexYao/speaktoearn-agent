// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SpeakToEarnPayment
 * @dev Contract for handling payments in the SpeakToEarn platform
 */
contract SpeakToEarnPayment is Ownable {
    IERC20 public paymentToken;
    uint256 public taskReward;
    
    event PaymentSent(address recipient, uint256 amount, string taskId);
    event FundsDeposited(address depositor, uint256 amount);
    event RewardAmountUpdated(uint256 newAmount);
    event PaymentTokenUpdated(address newToken);

    constructor(
        address initialOwner,
        address _paymentToken,
        uint256 _taskReward
    ) Ownable(initialOwner) {
        paymentToken = IERC20(_paymentToken);
        taskReward = _taskReward;
    }

    /**
     * @dev Deposits tokens into the contract for future payments
     * @param amount Amount of tokens to deposit
     */
    function depositFunds(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        emit FundsDeposited(msg.sender, amount);
    }

    /**
     * @dev Sends payment to a recipient for completing a task
     * @param recipient Address to receive the payment
     * @param taskId Unique identifier for the completed task
     */
    function sendPayment(address recipient, string calldata taskId) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(
            paymentToken.balanceOf(address(this)) >= taskReward,
            "Insufficient contract balance"
        );
        require(
            paymentToken.transfer(recipient, taskReward),
            "Payment transfer failed"
        );
        emit PaymentSent(recipient, taskReward, taskId);
    }

    /**
     * @dev Updates the reward amount for tasks
     * @param newAmount New reward amount
     */
    function updateTaskReward(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Reward must be greater than 0");
        taskReward = newAmount;
        emit RewardAmountUpdated(newAmount);
    }

    /**
     * @dev Updates the payment token address
     * @param newToken Address of the new payment token
     */
    function updatePaymentToken(address newToken) external onlyOwner {
        require(newToken != address(0), "Invalid token address");
        paymentToken = IERC20(newToken);
        emit PaymentTokenUpdated(newToken);
    }

    /**
     * @dev Returns the contract's current token balance
     */
    function getContractBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }
}
