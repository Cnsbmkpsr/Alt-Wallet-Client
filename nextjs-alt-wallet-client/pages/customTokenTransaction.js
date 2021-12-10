import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from "../components/Navbar";
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import DashboardCustomToken from '../components/DashboardCustomToken';

const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"


const customTokenTransaction = () => {

    const [userAccount, setUserAccount] = useState()
    const [amount, setAmount] = useState()

    /**
     * * Get account from metamask
     */
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(altTokenAddress, Token.abi, provider)
            const balance = await contract.balanceOf(account);
            console.log("Balance: ", balance.toString());
        }
    }

    async function sendCoins() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(altTokenAddress, Token.abi, signer);
            const transaction = await contract.transfer(userAccount, amount);
            await transaction.wait();
            console.log(`${amount} Coins successfully sent to ${userAccount}`);
        }
    }



    return (
        <div>
            <Navbar />
            <h1>Custom token transaction</h1>

            <DashboardCustomToken />
            <div className="flex flex-col bg-gray-400 p-4 m-4">
                <button onClick={requestAccount}>Request account</button>
                <button onClick={getBalance}>Get Balance</button>
                <button onClick={sendCoins}>Send Coins</button>
                <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
                <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
            </div>


        </div>
    )
}

export default customTokenTransaction;
