import { useState, useEffect, useCallback } from 'react';
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

    const [tokenAddress, setTokenAddress] = useState();

    const handleTokenChange = useCallback(
        (tokenAddress) => {
            setTokenAddress(tokenAddress);
        },
        [],
    )
    console.log(tokenAddress)


    return (


        <div>
            <Navbar />

            <DashboardTokenERC20 onTokenChange={handleTokenChange} />


            <DashboardWalletERC20 erc20TokenAddress={tokenAddress} />

            {
                tokenAddress ?? <MultiSend />

            }


        </div>
    )
}

export default customTokenTransaction;
