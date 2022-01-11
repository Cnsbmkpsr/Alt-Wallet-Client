import React from 'react'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import DashboardAltToken from './DashboardAltToken';


const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"

const DashboardCustomToken = () => {

    const [tokenAddress, setTokenAddress] = useState();
    const [tokenName, setTokenName] = useState();
    const [tokenSupply, setTokenSupply] = useState();
    const [tokenOwnerAddress, setTokenOwnerAddress] = useState();
    const [tokenSymbol, setTokenSymbol] = useState();
    const [tokenNetwork, setTokenNetwork] = useState();

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
            const contractProvider = await contract.provider;
            const contractNetwork = await contractProvider.getNetwork();

            setTokenNetwork(contractNetwork.name);
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
            <DashboardAltToken />
        </div>
    )
}

export default DashboardCustomToken;
