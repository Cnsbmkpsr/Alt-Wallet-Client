import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from "../components/Navbar";
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import DashboardCustomToken from '../components/DashboardCustomToken';
import ErrorMessage from "../components/ErrorMessage";
import MultiSend from '../components/MultiSend';
import DashboardAltToken from '../components/DashboardAltToken';
import DashboardWalletERC20 from '../components/DashboardWalletERC20';
import DashboardTokenERC20 from '../components/DashboardTokenERC20';


const customTokenTransaction = () => {

    const [error, setError] = useState();
    const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"

    const [userAccount, setUserAccount] = useState()
    const [amount, setAmount] = useState()
    const [altTokenBalance, setAltTokenBalance] = useState()
    const [walletNetworkUse, setWalletNetworkUse] = useState()
    const [destinationAddress, setDestinationAddress] = useState()


    return (
        <div>
            <Navbar />

            <DashboardTokenERC20 />

            {/*
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
                    : <div>
                        <h2>En attente des informations de votre wallet...</h2>
                    </div>
                }


            </div>

            */}


            <DashboardWalletERC20 />


        </div>
    )
}

export default customTokenTransaction;
