import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from "../components/Navbar";
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import DashboardCustomToken from '../components/DashboardCustomToken';
import ErrorMessage from "../components/ErrorMessage";

const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"


const customTokenTransaction = () => {

    const [error, setError] = useState();

    const [userAccount, setUserAccount] = useState()
    const [amount, setAmount] = useState()
    const [altTokenBalance, setAltTokenBalance] = useState()
    const [walletNetworkUse, setWalletNetworkUse] = useState()
    const [destinationAddress, setDestinationAddress] = useState()

    /**
     * * Get account from metamask
     */
    async function requestAccount() {
        if (typeof window.ethereum == 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
            getBalance()
        }
    }

    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(altTokenAddress, Token.abi, provider)
            const balance = await contract.balanceOf(account);
            const network = await provider.getNetwork();
            console.log(destinationAddress);

            balance = balance.toString();
            setUserAccount(account);
            setAltTokenBalance(balance);
            setWalletNetworkUse(network.name);
        }
    }

    async function sendCoins() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await requestAccount()
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(altTokenAddress, Token.abi, signer);
                console.log(destinationAddress);
                const transaction = await contract.transfer(destinationAddress, amount);
                await transaction.wait();
                console.log(`${amount} Coins successfully sent to ${userAccount}`);
            }
        } catch (err) {
            setError(err.message);
        }

    }


    useEffect(() => {
        requestAccount();
    }, []);

    return (
        <div>
            <Navbar />

            <DashboardCustomToken />
            <div className="flex flex-col justify-center justify-items-center justify-self-center content-center items-center bg-gray-100 p-4 m-4 shadow-lg dark:bg-gray-800">

                {altTokenBalance ?
                    <div>
                        <p class="text-2xl w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                            Your wallet informations
                        </p>

                        <div class="dark:text-white">

                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Your wallet address :
                                </p>
                                <div class="flex items-end text-xs">
                                    {userAccount}
                                </div>
                            </div>

                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Your Alt Token balance :
                                </p>
                                <div class="flex items-end text-xs">
                                    {altTokenBalance}
                                </div>
                            </div>

                            <div class="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Network connected :
                                </p>
                                <div class="flex items-end text-xs">
                                    {walletNetworkUse}
                                </div>
                            </div>

                        </div>
                    </div>
                    : <h2>En attente des informations du token...</h2>
                }

                <input defaultValue={""} onChange={e => setDestinationAddress(e.target.value)} placeholder="Delivery address" class="simpleInput" />
                <input defaultValue={""} onChange={e => setAmount(e.target.value)} placeholder="Amount" class="simpleInput" />

                <ErrorMessage message={error} />

                <div>
                    <button onClick={requestAccount} type="button" class="simpleButton m-2 bg-cyan-600">
                        Connecter mon wallet
                    </button>

                    <button onClick={getBalance} type="button" class="simpleButton m-2">
                        Get my Balance
                    </button>

                    <button onClick={sendCoins} type="button" class="simpleButton m-2 bg-green-500">
                        Send the token
                    </button>


                </div>

            </div>


        </div>
    )
}

export default customTokenTransaction;
