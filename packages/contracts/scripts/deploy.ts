import { ethers } from "hardhat";

async function main() {
  const SpeakToEarn = await ethers.getContractFactory("SpeakToEarn");
  const speakToEarn = await SpeakToEarn.deploy();
  await speakToEarn.waitForDeployment();

  console.log(`SpeakToEarn deployed to ${await speakToEarn.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
