import {Dispatch, SetStateAction, useState} from 'react';
import {BigNumberish, ethers} from 'ethers';
import {formatEther} from "ethers";
import {parseEther} from "ethers";

type NetworkInfo = {
    chainId: string;
    rpcUrl: string;
};

interface Networks {
    [key: string]: NetworkInfo;
}

const networks: Networks = {
    Mainnet: {
        chainId: '0x1',
        rpcUrl: 'https://mainnet.infura.io/v3/1cef41866295444b8b6da91ce5fae84d',
    },
    Testnet: {
        chainId: '0x3',
        rpcUrl: 'https://ropsten.infura.io/v3/1cef41866295444b8b6da91ce5fae84d',
    },
    BSC: {
        chainId: '0x38',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
    },
};


export const useBlockchainService = () => {
    const [provider, setProvider]: [ethers.BrowserProvider | null, Dispatch<SetStateAction<ethers.BrowserProvider | null>>] = useState<ethers.BrowserProvider | null>(null);
    const [userAddress, setUserAddress]: [string, Dispatch<SetStateAction<string>>] = useState<string>('');
    const [userBalanceETH, setUserBalanceETH]: [string, Dispatch<SetStateAction<string>>] = useState<string>('');
    const [userBalanceBNB, setUserBalanceBNB]: [string, Dispatch<SetStateAction<string>>] = useState<string>('');

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const newProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(newProvider);
                const accounts = await newProvider.send("eth_requestAccounts", []);
                const account = accounts[0];
                setUserAddress(account);
                await getBalance(newProvider, account);
            } catch (error) {
                console.error('Error during wallet connection:', error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const addBSCNetwork = async (provider: ethers.BrowserProvider) => {
        try {
            await provider.send('wallet_addEthereumChain', [{
                chainId: '0x38',
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
            }]);
        } catch (addError) {
            console.error('Error adding BSC network:', addError);
        }
    };

    const getBalance = async (provider: ethers.BrowserProvider, account: string) => {
        const balanceETH: BigNumberish = await provider.getBalance(account);
        setUserBalanceETH(formatEther(balanceETH));

        try {
            // Попытка переключения на BSC
            await provider.send("wallet_switchEthereumChain", [{chainId: '0x38'}]);
        } catch (error: any) {
            if (error.code === 4902) {
                // Добавление BSC и повторная попытка переключения
                await addBSCNetwork(provider);
                await provider.send("wallet_switchEthereumChain", [{chainId: '0x38'}]);
            } else {
                console.error('Error switching to BSC:', error);
            }
        }

        const balanceBNB: BigNumberish = await provider.getBalance(account);
        setUserBalanceBNB(formatEther(balanceBNB));

        // Возвращение к Ethereum Mainnet после получения баланса BNB
        await provider.send("wallet_switchEthereumChain", [{chainId: '0x1'}]);
    };


    const sendTransaction = async (recipientAddress: string, amount: string) => {
        if (!provider || !recipientAddress || !amount) {
            alert('Please fill all the required fields.');
            return;
        }

        try {
            const signer: ethers.JsonRpcSigner = await provider.getSigner();
            const tx = {
                to: recipientAddress,
                value: parseEther(amount),
            };

            const transaction: ethers.TransactionResponse = await signer.sendTransaction(tx);
            await transaction.wait();
            alert(`Transaction successful with hash: ${transaction.hash}`);
        } catch (error) {
            console.error('Transaction error:', error);
            alert('Transaction failed.');
        }
    };

    const switchNetwork = async (selectedNetwork: string) => {
        const {chainId} = networks[selectedNetwork];
        try {
            await provider!.send('wallet_switchEthereumChain', [{chainId}]);
        } catch (error) {
            console.error('Error switching network:', error);
        }
    };

    return {userAddress, userBalanceETH, userBalanceBNB, connectWallet, sendTransaction, switchNetwork};
};
