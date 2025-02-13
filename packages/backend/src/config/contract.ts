export const contractABI = [
  "function sendPayment(address recipient, string taskId)",
  "event PaymentSent(address recipient, uint256 amount, string taskId)",
  "function depositFunds(uint256 amount)",
  "function getContractBalance() view returns (uint256)",
  "function processedTasks(string) view returns (bool)"
];
