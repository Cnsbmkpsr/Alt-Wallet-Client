import React from 'react'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";


const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"

const DashboardCustomToken = () => {

    const [tokenAddress, setTokenAddress] = useState();
    const [tokenName, setTokenName] = useState();
    const [tokenSupply, setTokenSupply] = useState();
    const [tokenOwnerAddress, setTokenOwnerAddress] = useState();
    const [tokenSymbol, setTokenSymbol] = useState();

    /**
     * * Get account from metamask
     */
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
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
            <div className="bg-blue-300">
                {tokenAddress && <h2>Address du Token: {tokenAddress} </h2>}
                {tokenAddress ? <h2>Nom du Token: {tokenName}</h2> : <h2>Chargement...</h2>}
                {tokenAddress ? <h2>Supply du Token: {tokenSupply}</h2> : <h2>Chargement...</h2>}
                {tokenAddress ? <h2>Address de l'éméteur du Token: {tokenOwnerAddress}</h2> : <h2>Chargement...</h2>}
                {tokenAddress ? <h2>Symbol du Token: {tokenSymbol}</h2> : <h2>Chargement...</h2>}
                <button onClick={getTokenInformation}>Get Token Information</button>
            </div>
        </div>
    )
}

export default DashboardCustomToken;
