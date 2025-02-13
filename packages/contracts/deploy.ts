import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function main() {
    // Connect to Celo network
    const provider = new ethers.providers.JsonRpcProvider(process.env.CELO_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
    
    console.log('Deploying contract from account:', wallet.address);

    // Read the contract bytecode
    const bytecode = fs.readFileSync(
        path.join(__dirname, 'SpeakToEarn.bin'),
        'utf8'
    ).trim();

    // Create contract factory
    const factory = new ethers.ContractFactory(
        JSON.parse(fs.readFileSync(path.join(__dirname, 'SpeakToEarn.abi'), 'utf8')),
        bytecode,
        wallet
    );

    // Deploy contract
    console.log('Deploying SpeakToEarn contract...');
    const contract = await factory.deploy();
    await contract.deployed();

    console.log('Contract deployed to:', contract.address);

    // Save the contract address
    const envPath = path.join(__dirname, '../backend/.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
        /CONTRACT_ADDRESS=.*/,
        `CONTRACT_ADDRESS=${contract.address}`
    );
    fs.writeFileSync(envPath, envContent);

    console.log('Updated CONTRACT_ADDRESS in .env file');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
