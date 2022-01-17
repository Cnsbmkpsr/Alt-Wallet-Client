import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import PropTypes from "prop-types";

export default function Dashboard({ walletAddress }) {

    const [networkName, setNetworkName] = useState();
    const [signerAddress, setSignerAddress] = useState();
    const [signerBalance, setSignerBalance] = useState();
    const [signerWalletTransactionCount, setSignerWalletTransactionCount] = useState();

    const getWalletInformation = useCallback(async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            let networkName = (await provider.getNetwork()).name;
            setNetworkName(networkName);

            const signer = provider.getSigner();
            let signerAddress = (await signer.getAddress());
            setSignerAddress(signerAddress);
            walletAddress(signerAddress);

            let signerBalance = ethers.utils.formatEther(await signer.getBalance());
            setSignerBalance(signerBalance);

            let signerWalletTransactionCount = await signer.getTransactionCount();
            setSignerWalletTransactionCount(signerWalletTransactionCount);

            await window.ethereum.send("eth_requestAccounts");

        } catch (err) {
            console.log(err);
        }
    },
        [],
    )


    useEffect(() => {
        setInterval(getWalletInformation, 1000);
        getWalletInformation();

    }, [getWalletInformation]);



    return (
        <div className="text-center text-gray-800">
            <h1>Bienvenue sur votre Dashboard cliente ETH</h1>


            {
                networkName &&
                <h1>Network: {networkName}</h1>
            }

            {
                signerAddress &&
                <h1>Wallet address: {signerAddress}</h1>
            }

            {
                signerBalance &&
                <h1>Wallet ETH Balance: {signerBalance}</h1>
            }

            {
                signerWalletTransactionCount &&
                <h1>Nonce: {signerWalletTransactionCount}</h1>
            }

        </div>
    )
}

Dashboard.propTypes = {
    walletAddress: PropTypes.string
}