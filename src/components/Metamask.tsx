'use client'

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { Button, TextField, Typography } from '@mui/material'
import { formatEther, parseEther } from 'ethers/utils'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import styles from './Metamask.module.css'

const Metamask = () => {
	const [address, setAddress] = useState('')
	const [balanceETH, setBalanceETH] = useState('')
	const [balanceBNB, setBalanceBNB] = useState('')
	const [toAddress, setToAddress] = useState('')
	const [network, setNetwork] = useState('mainnet')
	const { enqueueSnackbar } = useSnackbar()

	const networks = {
		mainnet: 'https://mainnet.infura.io/v3/1cef41866295444b8b6da91ce5fae84d',
		testnet: 'https://goerli.infura.io/v3/1cef41866295444b8b6da91ce5fae84d',
	}

	const provider = new Web3Provider(window.ethereum)

	const connectWallet = async () => {
		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				})
				setAddress(accounts[0])
			} catch (error) {
				enqueueSnackbar('Ошибка при подключении кошелька', { variant: 'error' })
			}
		} else {
			enqueueSnackbar('Установите расширение MetaMask', { variant: 'warning' })
		}
	}

	const getBalance = async () => {
		if (window.ethereum) {
			const balanceETH = await provider.getBalance(address)
			setBalanceETH(formatEther(balanceETH.toString()))

			const bscProvider = new JsonRpcProvider(
				'https://bsc-dataseed.binance.org/'
			)
			const balanceBNB = await bscProvider.getBalance(address)
			setBalanceBNB(formatEther(balanceBNB.toString()))
		}
	}

	const sendTransaction = async () => {
		if (window.ethereum && toAddress) {
			try {
				const transactionData = {
					to: toAddress,
					value: parseEther('0.01'),
				}

				const tx = await window.ethereum.request({
					method: 'eth_sendTransaction',
					params: [transactionData],
				})

				enqueueSnackbar('Транзакция отправлена', { variant: 'success' })
			} catch (error) {
				enqueueSnackbar('Ошибка при отправке транзакции', { variant: 'error' })
			}
		} else {
			enqueueSnackbar('Подключите кошелек и введите адрес получателя', {
				variant: 'warning',
			})
		}
	}

	useEffect(() => {
		if (address) {
			getBalance()
		}
	}, [address, network])

	return (
		<div className={styles.container}>
			<Button variant='outlined' onClick={connectWallet}>
				Подключить MetaMask
			</Button>
			<div>
				<Typography variant='body1'>
					Адрес кошелька: <br /> {address}
				</Typography>
				<Typography variant='body1'>Баланс ETH: {balanceETH} ETH</Typography>
				<Typography variant='body1'>Баланс BNB: {balanceBNB} BNB</Typography>
			</div>
			<TextField
				label='Адрес получателя'
				value={toAddress}
				onChange={e => setToAddress(e.target.value)}
			/>
			<Button variant='contained' onClick={sendTransaction}>
				Отправить транзакцию
			</Button>
			<Button
				variant='contained'
				onClick={() =>
					setNetwork(network === 'mainnet' ? 'testnet' : 'mainnet')
				}
			>
				Переключить сеть
			</Button>
			<Typography variant='body1'>Текущая сеть: {network}</Typography>
		</div>
	)
}

export default Metamask
