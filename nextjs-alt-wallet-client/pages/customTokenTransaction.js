import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from "../components/Navbar";
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";

const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"


const customTokenTransaction = () => {

    const [userAccount, setUserAccount] = useState()
    const [amount, setAmount] = useState()
    const [tokenAddress, setTokenAddress] = useState();
    const [tokenName, setTokenName] = useState();
    const [tokenSupply, setTokenSupply] = useState();
    const [tokenOwnerAddress, setTokenOwnerAddress] = useState();
    const [tokenSymbol, setTokenSymbol] = useState();

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

    async function getTokenInformation() {
        if (typeof window.ethereum !== "undefined") {
            await requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(altTokenAddress, Token.abi, signer);
            const contractAddress = contract.address;
            const contractFunctions = contract.functions;
            const contractName = await contract.name();
            const contractSupply = await contract.totalSupply();
            const contractOwner = await contract.owner();
            const contractSymbol = await contract.symbol();

            setTokenAddress(contractAddress);
            setTokenName(contractName);
            setTokenSupply(contractSupply.toNumber());
            setTokenOwnerAddress(contractOwner);
            setTokenSymbol(contractSymbol);

        }
    }

    useEffect(() => {
        getTokenInformation();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Custom token transaction</h1>
            <div className="flex flex-col bg-gray-400 p-4 m-4">
                <button onClick={requestAccount}>Request account</button>
                <button onClick={getBalance}>Get Balance</button>
                <button onClick={sendCoins}>Send Coins</button>
                <button onClick={getTokenInformation}>Get Token Information</button>
                <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
                <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
            </div>
            <div className="bg-blue-300">
                {tokenAddress ? <h2>Address du Token: {tokenAddress}</h2> : <h2>Chargement...</h2>}
                {tokenAddress ? <h2>Nom du Token: {tokenName}</h2> : <h2>Chargement...</h2>}
                {tokenAddress ? <h2>Supply du Token: {tokenSupply}</h2> : <h2>Chargement...</h2>}
                {tokenAddress ? <h2>Address de l'éméteur du Token: {tokenOwnerAddress}</h2> : <h2>Chargement...</h2>}
                {tokenAddress ? <h2>Symbol du Token: {tokenSymbol}</h2> : <h2>Chargement...</h2>}
            </div>
        </div>
    )
}

export default customTokenTransaction;
