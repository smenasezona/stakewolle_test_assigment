'use client';

import React from 'react';
import {useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import {SelectChangeEvent} from "@mui/material";
import {useBlockchainService} from "@/helpers/hooks/useBlockchainService";

const MetaMaskConnector: React.FC = () => {
    const {
        userAddress,
        userBalanceETH,
        userBalanceBNB,
        connectWallet,
        sendTransaction,
        switchNetwork,
    } = useBlockchainService();

    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [network, setNetwork] = useState<string>('Mainnet');

    const handleNetworkChange = (event: SelectChangeEvent) => {
        const newNetwork = event.target.value as string;
        setNetwork(newNetwork);
        switchNetwork(newNetwork);
    };

    const handleSendTransaction = () => {
        sendTransaction(recipientAddress, amount);
    };

    return (
        <Box display={'flex'} justifyContent="center" alignItems="center"
             sx={{padding: 3, border: '1px solid #e3e3e3', borderRadius: 2}}>
            {!userAddress && (
                <Button variant="contained" color="primary" onClick={connectWallet} sx={{marginBottom: 2}}>
                    Connect Wallet
                </Button>
            )}
            {userAddress && (
                <Box sx={{marginTop: 2}}>
                    <Typography variant="body1" sx={{marginBottom: 1}}>Address: {userAddress}</Typography>
                    <Typography variant="body1" sx={{marginBottom: 1}}>Balance ETH: {userBalanceETH}</Typography>
                    <Typography variant="body1" sx={{marginBottom: 2}}>Balance BNB: {userBalanceBNB}</Typography>

                    <FormControl fullWidth sx={{marginBottom: 2}}>
                        <InputLabel id="network-select-label">Network</InputLabel>
                        <Select
                            labelId="network-select-label"
                            value={network}
                            label="Network"
                            onChange={handleNetworkChange}
                        >
                            <MenuItem value="Mainnet">Ethereum Mainnet</MenuItem>
                            <MenuItem value="Testnet">Ethereum Testnet (Ropsten)</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Recipient Address"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    <TextField
                        label="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        sx={{marginBottom: 2}}
                    />
                    <Button variant="contained" color="primary" onClick={handleSendTransaction}>
                        Send Transaction
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MetaMaskConnector;
