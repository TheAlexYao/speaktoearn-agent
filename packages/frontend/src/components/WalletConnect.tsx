import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    console.log('Checking for ethereum provider...');
    const ethereum = window.ethereum;
    if (!ethereum) {
      console.log('No ethereum provider found');
      return;
    }
    console.log('Ethereum provider found');

    const provider = new ethers.providers.Web3Provider(ethereum);
    setProvider(provider);

    // Handle account changes
    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      setAccount(accounts[0] || null);
    };

    ethereum.on('accountsChanged', handleAccountsChanged);

    // Check if already connected
    provider.listAccounts().then((accounts) => {
      console.log('Checking existing accounts:', accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    });

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const connectWallet = async () => {
    console.log('Connecting wallet...');
    const ethereum = window.ethereum;
    if (!ethereum || !provider) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);

      // Check if we're on the right network (Celo Alfajores)
      const network = await provider.getNetwork();
      if (network.chainId !== 44787) {
        alert('Please switch to Celo Alfajores Testnet!');
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaef3' }], // 44787 in hex
          });
        } catch (error: any) {
          // If the chain hasn't been added to MetaMask
          if (error.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaef3',
                chainName: 'Celo Alfajores Testnet',
                nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
                rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
                blockExplorerUrls: ['https://alfajores.celoscan.io/'],
              }],
            });
          }
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4">
      {account ? (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
