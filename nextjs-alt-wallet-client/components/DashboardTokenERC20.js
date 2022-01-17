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
        <div>
            <div className="flex flex-col justify-center text-center">
                <div className="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="deliveryAddress" className="simpleInput" placeholder="ERC20 Token Address" ref={ref} />
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => handleSubmit()}>Rechercher le token ERC20</button>
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
                            <h2>Attempt to retrieve information from ERC20 Token...</h2>
                            <h2>ALT Token address for testing : 0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034</h2>
                            <h2>Make sure you are connected to the Test Rinkeby network</h2>
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