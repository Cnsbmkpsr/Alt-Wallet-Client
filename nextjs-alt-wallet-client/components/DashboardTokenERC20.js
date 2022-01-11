import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import Navbar from "../components/Navbar";
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import DashboardCustomToken from '../components/DashboardCustomToken';
import ErrorMessage from "../components/ErrorMessage";
import MultiSend from '../components/MultiSend';
import DashboardAltToken from '../components/DashboardAltToken';
import { getERC20Contract } from "../store/contractStore";

const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"

const DashboardTokenERC20 = ({ onTokenChange }) => {
    const [error, setError] = useState();
    const [erc20TokenAddress, setErc20TokenAddress] = useState("");
    const [tokenName, setTokenName] = useState();
    const [tokenSupply, setTokenSupply] = useState();
    const [tokenOwnerAddress, setTokenOwnerAddress] = useState();
    const [tokenSymbol, setTokenSymbol] = useState();
    const [tokenNetwork, setTokenNetwork] = useState();

    const ref = useRef();

    async function getTokenInformation() {
        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = getERC20Contract(ref?.current?.value, signer);
                const contractAddress = contract.address;
                const contractName = await contract.name();
                const contractSupply = await contract.totalSupply();
                //const contractOwner = await contract.owner();
                const contractSymbol = await contract.symbol();
                const contractProvider = await contract.provider;
                const contractNetwork = await contractProvider.getNetwork();

                setTokenNetwork(contractNetwork.name);
                setErc20TokenAddress(contractAddress);
                setTokenName(contractName);
                contractSupply = contractSupply.toString();
                setTokenSupply(contractSupply);
                //setTokenOwnerAddress(contractOwner);
                setTokenSymbol(contractSymbol);
                onTokenChange(contractAddress);

            }
        } catch (err) {
            console.log(err.message);
        }

    }

    let handleSubmit = () => {
        console.log("[ ] Recherche d'informations pour le token : " + erc20TokenAddress);
        getTokenInformation();
    }


    return (
        <div>
            <div className="flex flex-col justify-center text-center">

                <form onSubmit={handleSubmit}>
                    <input type="text" name="deliveryAddress" className="simpleInput" placeholder="ERC20 Token Address" ref={ref} />
                    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => handleSubmit()}>Rechercher le token ERC20</button>
                </form>

                {tokenName ?

                    <div class="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                        <p class="text-lg w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                            Token informations for {tokenName}
                        </p>

                        <div class="dark:text-white">
                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-100">
                                <p>
                                    Token address
                                </p>
                                <div class="flex items-end text-xs">
                                    {erc20TokenAddress}
                                </div>
                            </div>
                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-100">
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
                                    NULL
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div>
                        <h2>Attempt to retrieve information from ERC20 Token...</h2>
                        <h2>ALT Token address for testing : 0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034</h2>
                        <h2>Make sure you are connected to the Test Rinkeby network</h2>
                    </div>
                }
            </div>
        </div>
    )
}

export default DashboardTokenERC20;
