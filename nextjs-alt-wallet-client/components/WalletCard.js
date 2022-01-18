import { useState } from 'react';
import { ethers } from 'ethers';

const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChangedHandler(result[0]);
                })
        } else {
            setErrorMessage("Please install MetaMask");
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        getUserBalance(newAccount.toString());
    }

    const getUserBalance = (address) => {
        window.ethereum.request({ method: "eth_getBalance", params: [address, 'latest'] })
            .then(balance => {
                setUserBalance(ethers.utils.formatEther(balance));
            })
    }

    const chainChangedHandler = () => {
        window.location.reload();
    }

    window.ethereum.on('accountsChanged', accountChangedHandler);

    window.ethereum.on('chainChanged', chainChangedHandler);

    return (
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white mt-4 p-4 text-center">
            <h1>Here we use only Ethereum Provider API methods</h1>
            <h4>{"Connection to MetaMask using window.ethereum methods"}</h4>
            <button
                onClick={connectWalletHandler}
                className="border-2 p-2"
            >
            </button>
            <div>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div>
                <h3>Balance: {userBalance}</h3>
            </div>
            {errorMessage}
        </div>
    )

}



export default WalletCard
