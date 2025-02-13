import axios from 'axios';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import * as path from 'path';

async function requestTokens() {
    // Load environment variables
    dotenv.config({ path: path.join(__dirname, '../backend/.env') });
    
    const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    console.log('Requesting tokens for address:', wallet.address);
    
    try {
        const response = await axios.post('https://celo.org/developers/faucet', {
            address: wallet.address,
            chain: 'alfajores'
        });
        
        console.log('Request successful!');
        console.log('Please wait a few minutes for the tokens to arrive.');
        
        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log('Current balance:', ethers.utils.formatEther(balance), 'CELO');
        
    } catch (error) {
        console.error('Error requesting tokens:', error);
    }
}

requestTokens();
