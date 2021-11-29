import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { resolveProperties } from "@ethersproject/properties";

//console.clear();

let APIConnexion = false;


const testConnexionToApi = () => {
    return new Promise((resolve, reject) => {
        try {
            // URL de l'API ici
            var url = "http://localhost:7546/"
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'text';
            request.send();

            fetch(url).then(function (response) {
                response.text().then(function (text) {
                    APIConnexion = true;
                    resolve(text);
                });
            });

        } catch (err) {
            console.log(err);
            APIConnexion = false;
            reject(null);
        }
    })

}

const getWalletInformation = async ({ setApiStatus, setNetworkName, setSignerAddress, setSignerBalance, setSignerWalletTransactionCount }) => {
    try {
        await window.ethereum.send("eth_requestAccounts");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let networkName = (await provider.getNetwork()).name;
        setNetworkName(networkName);

        const signer = provider.getSigner();
        let signerAddress = (await signer.getAddress());
        setSignerAddress(signerAddress);

        let signerBalance = (await ethers.utils.formatEther(await signer.getBalance()));
        setSignerBalance(signerBalance);

        let signerWalletTransactionCount = await signer.getTransactionCount();
        setSignerWalletTransactionCount(signerWalletTransactionCount);

        setApiStatus(await testConnexionToApi());



    } catch (err) {
        console.log(err);
    }
}

export default function Dashboard() {

    const [apiStatus, setApiStatus] = useState();
    const [networkName, setNetworkName] = useState();
    const [signerAddress, setSignerAddress] = useState();
    const [signerBalance, setSignerBalance] = useState();
    const [signerWalletTransactionCount, setSignerWalletTransactionCount] = useState();
    getWalletInformation({ setApiStatus, setNetworkName, setSignerAddress, setSignerBalance, setSignerWalletTransactionCount });

    setInterval(getWalletInformation, 10000, { setApiStatus, setNetworkName, setSignerAddress, setSignerBalance, setSignerWalletTransactionCount });


    return (
        <div className="text-center text-gray-800">
            <h1>Bienvenue sur votre Dashboard cliente ETH</h1>

            {/* API Status */}
            {
                !APIConnexion &&
                <h1 className="bg-red-600">API Status: Offline</h1>
            }
            {
                apiStatus &&
                <h1 className="bg-green-600">API Status: Online</h1>
            }

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