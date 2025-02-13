import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x20e352C14C7BC70a67491a268109f290C45efd70";
  const fundAmount = ethers.parseEther("0.1"); // Fund with 0.1 CELO

  // Get the contract
  const contract = await ethers.getContractAt("SpeakToEarn", contractAddress);
  
  // Send funds
  const tx = await contract.depositFunds({ value: fundAmount });
  await tx.wait();

  // Get the new balance
  const balance = await ethers.provider.getBalance(contractAddress);
  console.log(`Contract funded! New balance: ${ethers.formatEther(balance)} CELO`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
