import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import PropTypes from "prop-types";

export default function Dashboard({ walletAddress }) {

    const [networkInformations, setNetworkInformations] = useState({
        networkName: "",
        signerAddress: "",
        signerBalance: "",
        signerWalletTransactionCount: ""
    });

    const getWalletInformation = useCallback(async () => {
        try {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let networkName = (await provider.getNetwork()).name;
            let signer = provider.getSigner();
            let signerAddress = (await signer.getAddress());
            let signerBalance = ethers.utils.formatEther(await signer.getBalance());
            let signerWalletTransactionCount = await signer.getTransactionCount();

            walletAddress(signerAddress);

            setNetworkInformations((prevState) => ({
                ...prevState,
                networkName: networkName,
                signerAddress: signerAddress,
                signerBalance: signerBalance,
                signerWalletTransactionCount: signerWalletTransactionCount
            }))

            await window.ethereum.send("eth_requestAccounts");

        } catch (err) {
            console.log(err);
        }
    },
        [walletAddress],
    )


    useEffect(() => {
        setInterval(getWalletInformation, 1000);
        getWalletInformation();

    }, [getWalletInformation]);



    return (
        <div className="text-center text-gray-800 tracking-wide m-2 ">
            <h1 className="text-2xl">Welcome to your Dashboard to interact with the Ethereum network</h1>
            {
                networkInformations.signerAddress &&
                <h1 className="m-2">Your publique Wallet address: {networkInformations.signerAddress}</h1>
            }
            <div className="flex flex-wrap-reverse justify-center space-x-4 space-y-3 text-center items-center">         {
                networkInformations.networkName &&
                <h1 className="p-2 rounded-lg border-2 border-gray-600 mt-3">Currently connected network: {networkInformations.networkName}</h1>
            }
                {
                    networkInformations.signerBalance &&
                    <h1 className="p-2 rounded-lg border-2 border-gray-600">Wallet ETH Balance: {networkInformations.signerBalance}</h1>
                }

                {
                    networkInformations.signerWalletTransactionCount &&
                    <h1 className="p-2 rounded-lg border-2 border-gray-600">Nonce: {networkInformations.signerWalletTransactionCount}</h1>
                }
            </div>
        </div>
    )
}

Dashboard.propTypes = {
    walletAddress: PropTypes.string
}