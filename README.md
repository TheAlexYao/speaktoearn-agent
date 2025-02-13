# Speak to Earn – Get Paid to Preserve & Learn Languages

## What it is
A decentralized platform that rewards users with CELO stablecoins for contributing language data through speaking, translation, and transcription tasks.

## What we built with Celo
We integrated Celo's blockchain to create a transparent, automated payment system for language contributors:
- **Smart Contracts**: Reward distribution system on Celo's Alfajores testnet using Hardhat
- **Payment Integration**: Direct CELO stablecoin transfers using ethers.js and MetaMask
- **User Experience**: Seamless web3 integration with React frontend and Express backend

## Team

### Alex Yao ([@thealexyao](https://x.com/thealexyao))
- Entrepreneur, full stack AI builder, and crypto '17
- Building at the intersection of AI and blockchain
- Leading development of the Speak to Earn platform

## 🔗 Technical Details

1. **Smart Contract Development**
   - Used Hardhat for development and testing
   - Deployed to Celo Alfajores testnet for testing
   - Integrated OpenZeppelin for secure contract patterns

2. **Frontend Integration**
   - Connected to Celo using ethers.js
   - Implemented MetaMask and Celo wallet support
   - Built responsive UI with React and TailwindCSS

3. **Backend Services**
   - Node.js/Express server for API endpoints
   - OpenAI integration for speech verification
   - Web3.Storage for decentralized data storage

4. **Testing & Deployment**
   - Automated tests with Hardhat
   - CI/CD pipeline for contract deployment
   - End-to-end testing on Alfajores testnet

### Smart Contract Architecture

#### SpeakToEarn.sol
Our main contract handles task verification and reward distribution:

```solidity
contract SpeakToEarn {
    // Fixed reward amount in CELO
    uint256 public constant REWARD_AMOUNT = 0.01 ether;
    
    // Track processed tasks to prevent double payments
    mapping(string => bool) public processedTasks;
    
    // Emit events for payment tracking
    event PaymentSent(address recipient, uint256 amount, string taskId);
    event FundsDeposited(address sender, uint256 amount);
    
    // Core functions
    function sendPayment(address recipient, string memory taskId) external;
    function depositFunds() external payable;
    function getContractBalance() external view returns (uint256);
}
```

#### Contract Interactions
1. **Task Submission**
   - User submits language task (speech/translation)
   - Backend verifies task with AI
   - Contract checks if task ID is unique

2. **Reward Distribution**
   - Backend calls `sendPayment` with user's address
   - Contract transfers CELO tokens to user
   - Event emitted for tracking

3. **Fund Management**
   - Admin deposits rewards using `depositFunds`
   - Contract maintains balance for payouts
   - Users can verify rewards via `getContractBalance`

## 🌟 The Problem

- 🗣️ Millions of people and thousands of languages are underrepresented in AI
- 🔗 LLMs need high-quality, diverse speech data but face limited access
- 📱 Traditional language learning apps don't reward speakers for their knowledge

## 💡 Our Solution

Speak to Earn creates a win-win ecosystem by:

1. **Paying Contributors** - Users earn CELO stablecoins for verified language contributions
2. **Building a Data Commons** - Creating a valuable dataset for AI language models
3. **Powering Language Learning** - Using the data to build better AI-powered learning tools

## 🚀 How It Works

1. **Select a Task**
   - Voice recording
   - Translation
   - Transcription

2. **Submit & Verify**
   - AI agent evaluation
   - Peer validation system
   - Quality assurance checks

3. **Earn Crypto**
   - Instant payouts in CELO
   - Transparent reward system
   - Automated via smart contracts

4. **Grow the Commons**
   - Contribute to language preservation
   - Improve AI models
   - Support better learning tools

## 🌍 Why It Matters

- **Financial Inclusion**: Empower speakers of rare languages to monetize their knowledge
- **Better AI**: Enable development of higher-quality multilingual models
- **Quality Data**: Replace messy internet scraping with verified human contributions
- **Scalable Verification**: Combine AI and human validation for reliable data

## 🔮 Future Vision

- Expand task types and verification mechanisms
- Build AI-powered language learning applications
- Implement on-chain reputation and governance
- Scale to a global network of contributors and learners

## 🏆 Why We'll Win

Speak to Earn isn't just another language app—it's a new way to participate in the AI economy. We're combining:
- Celo's blockchain technology for transparent payments
- AI-powered verification for quality assurance
- Economic incentives for language preservation

## 💻 Project Structure

```
packages/
  ├── backend/         # Express.js backend server with AI evaluation
  ├── contracts/       # Solidity smart contracts and Hardhat config
  ├── frontend/        # React frontend application
  └── docs/            # Project documentation
```

## Setup & Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd speaktoearn-agent
```

### Connecting Your Wallet

1. Install MetaMask from [metamask.io](https://metamask.io)

2. Add Celo Alfajores Testnet:
   - Network Name: Celo Alfajores Testnet
   - RPC URL: https://alfajores-forno.celo-testnet.org
   - Chain ID: 44787
   - Currency Symbol: CELO
   - Block Explorer: https://alfajores.celoscan.io

3. Get testnet CELO:
   - Visit [Celo Faucet](https://faucet.celo.org)
   - Enter your wallet address
   - Receive testnet CELO

4. Connect in the app:
   - Click "Connect Wallet" in the top right
   - Select MetaMask
   - Approve the connection

2. Install dependencies for all packages:
```bash
yarn install # Install root dependencies
```

3. Set up environment variables:

Create `.env` files in the required directories:

```bash
# packages/backend/.env
OPENAI_API_KEY=your_openai_api_key
PORT=3000
CELO_PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=deployed_contract_address

# packages/frontend/.env
VITE_BACKEND_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=deployed_contract_address

# packages/contracts/.env
PRIVATE_KEY=your_private_key
ALFAJORES_URL=https://alfajores-forno.celo-testnet.org
```

4. Deploy smart contracts:
```bash
cd packages/contracts
npx hardhat compile
npx hardhat deploy --network alfajores
```

Make sure to copy the deployed contract address and update it in both frontend and backend `.env` files.

## Running the Application

Run the following components in separate terminal windows:

1. **Backend Server**:
```bash
cd packages/backend
yarn dev  # Starts the backend server
```

2. **Frontend Application**:
```bash
cd packages/frontend
yarn dev  # Starts the frontend application
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Testing

To run tests for each package:

```bash
# Smart Contract Tests
cd packages/contracts
yarn test

# Backend Tests
cd packages/backend
yarn test

# Frontend Tests
cd packages/frontend
yarn test
```

## Development

### Smart Contracts

To work with smart contracts:

```bash
cd packages/contracts

# Compile contracts
yarn compile

# Deploy to Alfajores testnet
yarn deploy:alfajores

# Run local hardhat node (for development)
yarn chain
```

Make sure to update the contract addresses in your `.env` files after deployment.

# Backend Tests
cd packages/backend
npm test

# Frontend Tests
cd packages/frontend
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

<!-- TABLE OF CONTENTS -->

<div>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
      <ol>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#minipay">MiniPay</a></li>
     </ol>
    <li><a href="#how-to-use-celo-composer">How to use Celo Composer</a></li>
        <ol>
          <li><a href="#install-dependencies">Install Dependencies</a></li>
          <li><a href="#deploy-a-smart-contract">Deploy a Smart Contract</a></li>
          <li><a href="#deploy-your-dapp-locally">Deploy your Dapp Locally</a></li>
          <li><a href="#add-ui-components">Add UI Components</a></li>
          <li><a href="#deploy-with-vercel">Deploy with Vercel</a></li>
          <li><a href="#supported-frameworks">Supported Frameworks</a></li>
        </ol>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#support">Support</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

Celo Composer allows you to quickly build, deploy, and iterate on decentralized applications using Celo. It provides a number of frameworks, templates, deployment and component support, and Celo specific functionality to help you get started with your next dApp. 

It is the perfect lightweight starter-kit for any hackathon and for quickly testing out integrations and deployments on Celo.

<p align="right">(<a href="#top">back to top</a>)</p>

## Built With

Celo Composer is built on Celo to make it simple to build dApps using a variety of front-end frameworks, and libraries.

- [Celo](https://celo.org/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.19/)
- [Hardhat](https://hardhat.org/)
- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [viem](https://viem.sh/)
- [Tailwind](https://tailwindcss.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Prerequisites

- Node (v20 or higher)
- Git (v2.38 or higher)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.