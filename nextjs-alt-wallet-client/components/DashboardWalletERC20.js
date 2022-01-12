import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from "../components/Navbar";
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import DashboardCustomToken from '../components/DashboardCustomToken';
import ErrorMessage from "../components/ErrorMessage";
import MultiSend from '../components/MultiSend';
import DashboardAltToken from '../components/DashboardAltToken';

const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"

const DashboardWalletERC20 = ({ erc20TokenAddress }) => {
    const [error, setError] = useState();
    const [tokenName, setTokenName] = useState();

    const [userAccount, setUserAccount] = useState()
    const [amount, setAmount] = useState()
    const [erc20TokenBalance, setErc20TokenBalance] = useState()
    const [walletNetworkUse, setWalletNetworkUse] = useState()

    /**
     * * Get account from metamask
     */
    async function requestAccount() {
        if (typeof window.ethereum == 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
            getBalance();
        }
    }

    async function getBalance() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(erc20TokenAddress, Token.abi, provider)
                const balance = await contract.balanceOf(account);
                const network = await provider.getNetwork();
                const contractName = await contract.name();


                balance = balance.toString();
                setUserAccount(account);
                setErc20TokenBalance(balance);
                setWalletNetworkUse(network.name);
                setTokenName(contractName);

            }
        } catch (err) {
            console.log(err.message);
        }

    }


    useEffect(() => {
        requestAccount();
    }, [erc20TokenAddress]);

    return (
        <div>
            <div className="flex flex-col justify-center justify-items-center justify-self-center content-center items-center bg-gray-100 p-4 m-4 shadow-lg dark:bg-gray-800">
                {erc20TokenBalance ?
                    <div>
                        <p className="text-2xl w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                            Your wallet informations
                        </p>

                        <div className="dark:text-white">

                            <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Your wallet address :
                                </p>
                                <div className="flex items-end text-xs">
                                    {userAccount}
                                </div>
                            </div>

                            <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Your {tokenName} balance :
                                </p>
                                <div className="flex items-end text-xs">
                                    {erc20TokenBalance}
                                </div>
                            </div>

                            <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Network connected :
                                </p>
                                <div className="flex items-end text-xs">
                                    {walletNetworkUse}
                                </div>
                            </div>

                        </div>
                        <MultiSend tokenAddress={erc20TokenAddress} />
                    </div>
                    : <div>
                        <h2>Waiting for information from your wallet...</h2>
                    </div>
                }

            </div>


        </div>
    )
}

export default DashboardWalletERC20;
