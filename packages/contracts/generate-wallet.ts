import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

function generateWallet() {
    // Create a random wallet
    const wallet = ethers.Wallet.createRandom();
    
    console.log('\n=== New Wallet Generated ===');
    console.log('Address:', wallet.address);
    console.log('Private Key:', wallet.privateKey);
    console.log('\nIMPORTANT: Save these credentials securely!\n');
    
    // Update .env file
    const envPath = path.join(__dirname, '../backend/.env');
    let envContent = '';
    
    try {
        envContent = fs.readFileSync(envPath, 'utf8');
    } catch {
        // If .env doesn't exist, copy from template
        envContent = fs.readFileSync(path.join(__dirname, '../backend/.env.template'), 'utf8');
    }
    
    // Update PRIVATE_KEY
    envContent = envContent.replace(
        /PRIVATE_KEY=.*/,
        `PRIVATE_KEY=${wallet.privateKey}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('Updated PRIVATE_KEY in .env file');
    console.log('\nNext steps:');
    console.log('1. Get test CELO from: https://celo.org/developers/faucet');
    console.log('2. Run: npm run deploy');
}

generateWallet();
