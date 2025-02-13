import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as path from 'path';
import * as fs from 'fs';

async function depositFunds() {
    // Load environment variables
    dotenv.config({ path: path.join(__dirname, '../backend/.env') });
    
    const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    // Load contract ABI
    const contractABI = JSON.parse(fs.readFileSync('./SpeakToEarn.abi', 'utf8'));
    const contractAddress = process.env.CONTRACT_ADDRESS!;
    
    console.log('Depositing funds to contract at address:', contractAddress);
    console.log('Using wallet:', wallet.address);
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    try {
        // Check initial contract balance
        const initialBalance = await contract.getContractBalance();
        console.log('\nInitial contract balance:', ethers.utils.formatEther(initialBalance), 'CELO');
        
        // Send 1 CELO to the contract
        console.log('\nSending 1 CELO to contract...');
        const tx = await contract.depositFunds({ value: ethers.utils.parseEther('1') });
        console.log('Transaction hash:', tx.hash);
        console.log('Waiting for transaction confirmation...');
        await tx.wait();
        console.log('Transaction confirmed!');
        
        // Check new contract balance
        const newBalance = await contract.getContractBalance();
        console.log('\nNew contract balance:', ethers.utils.formatEther(newBalance), 'CELO');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

depositFunds();
