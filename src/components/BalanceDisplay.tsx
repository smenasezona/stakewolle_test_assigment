'use client'
import React, {useEffect, useState} from 'react';
import {Typography} from '@mui/material';

interface BalanceDisplayProps {
    address: string;
    getBalance: (address: string) => Promise<{ eth: string; bnb: string }>;
}

interface Balances {
    eth: string;
    bnb: string;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({address, getBalance}) => {
    const [balances, setBalances] = useState<Balances>({eth: '', bnb: ''});

    useEffect(() => {
        const fetchBalances = async () => {
            const {eth, bnb} = await getBalance(address);
            setBalances({eth, bnb});
        };

        if (address) {
            fetchBalances();
        }
    }, [address, getBalance]);

    return (
        <>
            <Typography variant="body1">Balance: {balances.eth} ETH</Typography>
            <Typography variant="body1">Balance: {balances.bnb} BNB</Typography>
        </>
    );
};

export default BalanceDisplay;
