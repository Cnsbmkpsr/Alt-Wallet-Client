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
            <div className="flex flex-col justify-center text-center">
                {tokenAddress ?

                    <div class="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                        <p class="text-sm w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                            Informations du token {tokenName}
                        </p>
                        <div class="flex items-end space-x-2 my-6 text-center">
                            <p class="text-xl text-black dark:text-white font-bold">
                                Addresse du token : {tokenAddress}
                            </p>

                        </div>
                        <div class="dark:text-white">
                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Supply totale du token
                                </p>
                                <div class="flex items-end text-xs">
                                    {tokenSupply}
                                </div>
                            </div>
                            <div class="flex items-center mb-2 pb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Symbole du token
                                </p>
                                <div class="flex items-end text-xs">
                                    {tokenSymbol}
                                </div>
                            </div>
                            <div class="flex items-center text-sm space-x-12 md:space-x-24 justify-between">
                                <p>
                                    Addresse émétrice du token
                                </p>
                                <div class="flex items-end text-xs">
                                    {tokenOwnerAddress}
                                </div>
                            </div>
                        </div>
                    </div>
                    : <h2>Chargement...</h2>}

            </div>
        </div>
    )
}

export default DashboardCustomToken;
