'use client'
import React, {FormEvent, useState} from 'react';
import {Button, TextField} from '@mui/material';

interface SendTransactionFormProps {
    sendTransaction: (recipientAddress: string, amount: string) => Promise<void>;
}

const SendTransactionForm: React.FC<SendTransactionFormProps> = ({sendTransaction}) => {
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await sendTransaction(recipientAddress, amount);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Recipient Address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                fullWidth
            />
            <TextField
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
            />
            <Button type="submit" variant="contained">Send Transaction</Button>
        </form>
    );
};

export default SendTransactionForm;
