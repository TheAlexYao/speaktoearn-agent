import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as path from 'path';

async function checkBalance() {
    // Load environment variables
    dotenv.config({ path: path.join(__dirname, '../backend/.env') });
    
    const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    console.log('Checking balance for address:', wallet.address);
    const balance = await provider.getBalance(wallet.address);
    console.log('Current balance:', ethers.utils.formatEther(balance), 'CELO');
}

checkBalance();
