import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as path from 'path';
import * as fs from 'fs';

async function testContract() {
    // Load environment variables
    dotenv.config({ path: path.join(__dirname, '../backend/.env') });
    
    const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    // Load contract ABI
    const contractABI = JSON.parse(fs.readFileSync('./SpeakToEarn.abi', 'utf8'));
    const contractAddress = process.env.CONTRACT_ADDRESS!;
    
    console.log('Testing contract at address:', contractAddress);
    console.log('Using wallet:', wallet.address);
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    try {
        // 1. Check contract balance
        const balance = await contract.getContractBalance();
        console.log('\n1. Contract balance:', ethers.utils.formatEther(balance), 'CELO');
        
        // 2. Send some CELO to the contract
        console.log('\n2. Sending 0.01 CELO to contract...');
        const tx1 = await contract.depositFunds({ value: ethers.utils.parseEther('0.01') });
        await tx1.wait();
        console.log('Transaction hash:', tx1.hash);
        
        const newBalance = await contract.getContractBalance();
        console.log('New contract balance:', ethers.utils.formatEther(newBalance), 'CELO');
        
        // 3. Test sending payment for a task
        const taskId = `test-task-${Date.now()}`;
        const recipientAddress = '0x666dc7D3cFa6aE0Ed331F0741A0B6E326df1850C'; // Using a test recipient
        
        console.log('\n3. Testing payment for task:', taskId);
        console.log('Recipient:', recipientAddress);
        
        const tx2 = await contract.sendPayment(recipientAddress, taskId);
        await tx2.wait();
        console.log('Payment transaction hash:', tx2.hash);
        
        // 4. Check if task is marked as processed
        const isProcessed = await contract.processedTasks(taskId);
        console.log('\n4. Is task processed?', isProcessed);
        
        console.log('\nAll tests completed successfully!');
        
    } catch (error) {
        console.error('Error testing contract:', error);
    }
}

testContract();
