import { useState, useRef, useCallback } from 'react';
import { ethers } from 'ethers';
import { getERC20Contract } from "../store/contractStore";
import PropTypes from 'prop-types';

const DashboardTokenERC20 = ({ onTokenChange }) => {
    const [erc20TokenAddress, setErc20TokenAddress] = useState("");
    const [tokenName, setTokenName] = useState();
    const [tokenSupply, setTokenSupply] = useState();
    const [tokenSymbol, setTokenSymbol] = useState();
    const [tokenNetwork, setTokenNetwork] = useState();
    const [hasError, setHasError] = useState();
    const ref = useRef();

    const getTokenInformation = useCallback(
        async () => {
            try {
                if (typeof window.ethereum !== "undefined") {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = getERC20Contract(ref?.current?.value, signer);
                    const contractAddress = contract.address;
                    const contractName = await contract.name();
                    let contractSupply = await contract.totalSupply();
                    const contractSymbol = await contract.symbol();
                    const contractProvider = await contract.provider;
                    const contractNetwork = await contractProvider.getNetwork();

                    setTokenNetwork(contractNetwork.name);
                    setErc20TokenAddress(contractAddress);
                    setTokenName(contractName);
                    contractSupply = contractSupply.toString();
                    setTokenSupply(contractSupply);
                    setTokenSymbol(contractSymbol);
                    onTokenChange(contractAddress);
                    setHasError(null);
                }
            } catch (err) {
                setHasError(err.message);
                console.log(err.message);
            }

        },
        [onTokenChange],
    )

    let handleSubmit = useCallback(() => {
        console.log("[ ] Recherche d'informations pour le token : " + erc20TokenAddress);
        getTokenInformation();
    }, [erc20TokenAddress, getTokenInformation])


    return (
        <div className="credit-card w-full lg:w-2/3 sm:w-auto shadow-lg mx-auto rounded-xl bg-gray-100">
            <div className="flex flex-col justify-center text-center ">
                <div className="px-4 py-6 relative m-4">
                    <form onSubmit={handleSubmit} className="flex flex-col mb-10">
                        <input type="text" name="deliveryAddress" className="simpleInput text-center" placeholder="ERC20 Token Address" ref={ref} />
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 max-w-58 px-2 self-center rounded" type="button" onClick={() => handleSubmit()}>Search the ERC20 token</button>
                    </form>
                    {tokenName ?
                        <div>
                            <p className="text-lg w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                                Token informations for {tokenName}
                            </p>
                            <div className="dark:text-white">
                                <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-100">
                                    <p>
                                        Token address
                                    </p>
                                    <div className="flex items-end text-xs">
                                        {erc20TokenAddress}
                                    </div>
                                </div>
                                <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-100">
                                    <p>
                                        Network name on which the token is deployed
                                    </p>
                                    <div className="flex items-end text-xs">
                                        {tokenNetwork}
                                    </div>
                                </div>
                                <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                    <p>
                                        Total supply of the token
                                    </p>
                                    <div className="flex items-end text-xs">
                                        {tokenSupply}
                                    </div>
                                </div>
                                <div className="flex items-center mb-2 pb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                    <p>
                                        Token symbol
                                    </p>
                                    <div className="flex items-end text-xs">
                                        {tokenSymbol}
                                    </div>
                                </div>
                                <div className="flex items-center text-sm space-x-12 md:space-x-24 justify-between">
                                    <p>
                                        Address of the token transmitter
                                    </p>
                                    <div className="flex items-end text-xs">
                                        NULL
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div>
                            <div className="bg-yellow-200 border-yellow-600 text-yellow-600 border-l-4 p-4 my-2" role="alert">
                                <p>
                                    Waiting for the address of the ERC-20 token
                                </p>
                            </div>


                            <div className="rounded-md bg-blue-500 flex items-center jusitfy-between  text-white text-sm font-bold px-5 py-4 mb-2 relative" role="alert">
                                <div className="w-full flex items-center">

                                    <svg width="20" height="20" fill="currentColor" className="w-4 h-4 mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1216 1344v128q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64v-384h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h384q26 0 45 19t19 45v576h64q26 0 45 19t19 45zm-128-1152v192q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-192q0-26 19-45t45-19h256q26 0 45 19t19 45z">
                                        </path>
                                    </svg>
                                    <p>ALT Token address for testing : 0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034</p>
                                </div>
                            </div>

                            <div className="rounded-md flex items-center jusitfy-between px-5 py-4 mb-2 border border-blue-500 text-blue-500">
                                <div className="w-full flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className=" w-6 h-6 mr-2" viewBox="0 0 1792 1792">
                                        <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
                                        </path>
                                    </svg>
                                    <p>Make sure you are connected to the test network Rinkeby</p>
                                </div>
                            </div>
                        </div>
                    }
                    {hasError &&
                        <div className="bg-red-300 text-white">
                            {hasError}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

DashboardTokenERC20.propTypes = {
    onTokenChange: PropTypes.string
}

export default DashboardTokenERC20;