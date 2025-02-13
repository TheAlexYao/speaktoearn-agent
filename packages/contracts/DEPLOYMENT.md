# Smart Contract Deployment and Management

## Contract Addresses
- SpeakToEarn: `0x20e352C14C7BC70a67491a268109f290C45efd70` (Celo Alfajores Testnet)

## Prerequisites
1. Environment Setup
   ```bash
   # packages/contracts/.env
   PRIVATE_KEY=your_wallet_private_key
   ALFAJORES_URL=https://alfajores-forno.celo-testnet.org
   ```

2. Network Configuration
   ```typescript
   // hardhat.config.ts
   {
     alfajores: {
       url: "https://alfajores-forno.celo-testnet.org",
       accounts: [PRIVATE_KEY],
       chainId: 44787
     }
   }
   ```

## Deployment Steps

1. **Deploy Contract**
   ```bash
   cd packages/contracts
   npx hardhat run scripts/deploy.ts --network alfajores
   ```
   - Records contract address for future use
   - Emits deployment event with contract address

2. **Check Deployer Balance**
   ```bash
   npx hardhat run check-balance.ts --network alfajores
   ```
   - Ensures deployer has enough CELO for operations
   - Current balance: ~1.13 CELO

3. **Fund Contract**
   ```bash
   npx hardhat run scripts/fund-contract.ts --network alfajores
   ```
   - Funds contract with 0.1 CELO
   - Enables 10 reward payments (0.01 CELO each)

## Contract Management Scripts

### 1. Deploy Script (deploy.ts)
```typescript
import { ethers } from "hardhat";

async function main() {
  const SpeakToEarn = await ethers.getContractFactory("SpeakToEarn");
  const speakToEarn = await SpeakToEarn.deploy();
  await speakToEarn.waitForDeployment();

  console.log(`SpeakToEarn deployed to ${await speakToEarn.getAddress()}`);
}
```

### 2. Balance Check Script (check-balance.ts)
```typescript
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as path from 'path';

async function checkBalance() {
    dotenv.config({ path: path.join(__dirname, '../backend/.env') });
    const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    const balance = await provider.getBalance(wallet.address);
    console.log('Current balance:', ethers.utils.formatEther(balance), 'CELO');
}
```

### 3. Contract Funding Script (fund-contract.ts)
```typescript
import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x20e352C14C7BC70a67491a268109f290C45efd70";
  const fundAmount = ethers.utils.parseEther("0.1");

  const contract = await ethers.getContractAt("SpeakToEarn", contractAddress);
  const tx = await contract.depositFunds({ value: fundAmount });
  await tx.wait();
}
```

## Contract Verification

The SpeakToEarn contract has the following key functions:
1. `sendPayment(address recipient, string taskId)`: Send reward to user
2. `depositFunds()`: Add funds to contract
3. `getContractBalance()`: Check contract balance

## Maintenance Tasks

1. **Regular Balance Checks**
   ```bash
   npx hardhat run check-balance.ts --network alfajores
   ```
   - Monitor deployer wallet balance
   - Ensure sufficient funds for gas fees

2. **Contract Refunding**
   ```bash
   npx hardhat run scripts/fund-contract.ts --network alfajores
   ```
   - Add more CELO when balance is low
   - Each reward costs 0.01 CELO

3. **Network Health**
   - Monitor Celo Alfajores testnet status
   - Check gas prices and network congestion

## Emergency Procedures

1. If contract runs out of funds:
   - Use fund-contract.ts to replenish
   - Monitor failed transactions

2. If deployment fails:
   - Check network status
   - Verify wallet balance
   - Ensure correct network configuration

## Integration Points

1. **Frontend**
   - Contract address stored in environment variables
   - Wallet connection via MetaMask
   - Network auto-switching to Alfajores

2. **Backend**
   - Contract interaction through ethers.js
   - Task verification before payment
   - Event monitoring for payments

## Testing

Before production use:
1. Deploy to testnet
2. Fund with small amount
3. Test reward distribution
4. Monitor gas usage
5. Verify event emissions
