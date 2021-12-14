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
            <div className="flex flex-col justify-center text-center">
                {tokenAddress ?

                    <div class="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                        <p class="text-sm w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                            Token informations for {tokenName}
                        </p>
                        <div class="flex items-end space-x-2 my-2 text-center">
                            <p class="text-base text-black dark:text-white font-bold">
                                Token address : {tokenAddress}
                            </p>

                        </div>
                        <div class="dark:text-white">
                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Network name on which the token is deployed
                                </p>
                                <div class="flex items-end text-xs">
                                    {tokenNetwork}
                                </div>
                            </div>
                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Total supply of the token
                                </p>
                                <div class="flex items-end text-xs">
                                    {tokenSupply}
                                </div>
                            </div>
                            <div class="flex items-center mb-2 pb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Token symbol
                                </p>
                                <div class="flex items-end text-xs">
                                    {tokenSymbol}
                                </div>
                            </div>
                            <div class="flex items-center text-sm space-x-12 md:space-x-24 justify-between">
                                <p>
                                    Address of the token transmitter
                                </p>
                                <div class="flex items-end text-xs">
                                    {tokenOwnerAddress}
                                </div>
                            </div>
                        </div>
                    </div>
                    : <h2>Waiting for token information...</h2>
                }
            </div>
        </div>
    )
}

export default DashboardCustomToken;
