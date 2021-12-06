import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { resolveProperties } from "@ethersproject/properties";

//console.clear();

let APIConnexion = false;

export default function Dashboard() {

    const [apiStatus, setApiStatus] = useState(null);
    const [networkName, setNetworkName] = useState();
    const [signerAddress, setSignerAddress] = useState();
    const [signerBalance, setSignerBalance] = useState();
    const [signerWalletTransactionCount, setSignerWalletTransactionCount] = useState();

    useEffect(() => {
        const testConnexionToApi = () => {
            console.log(apiStatus);
            return new Promise((resolve, reject) => {
                try {
                    //setApiStatus(null);
                    // URL de l'API ici
                    var url = "http://localhost:7546/"
                    var request = new XMLHttpRequest();
                    request.open('GET', url, true);
                    request.timeout = 5000;
                    request.responseType = 'text';
                    request.send();

                    fetch(url).then(function (response) {
                        response.text().then(function (text) {
                            console.log("response here")
                            console.log(text);
                            APIConnexion = true;
                            resolve(text);
                        });
                    });

                    request.ontimeout = function () {
                        setApiStatus(null);
                    }

                } catch (err) {
                    console.log("no api :(")
                    console.log(err);
                    APIConnexion = false;
                    setApiStatus(null);
                    reject(null);
                }
            })

        }

        const getWalletInformation = async ({ setApiStatus, setNetworkName, setSignerAddress, setSignerBalance, setSignerWalletTransactionCount }) => {
            try {
                console.log("get wallte information")
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

                await window.ethereum.send("eth_requestAccounts");


                setApiStatus(await testConnexionToApi());

            } catch (err) {
                console.log(err);
            }
        }

        setInterval(getWalletInformation, 1000, { setApiStatus, setNetworkName, setSignerAddress, setSignerBalance, setSignerWalletTransactionCount })
        getWalletInformation({ setApiStatus, setNetworkName, setSignerAddress, setSignerBalance, setSignerWalletTransactionCount });

    }, []);



    return (
        <div className="text-center text-gray-800">
            <h1>Bienvenue sur votre Dashboard cliente ETH</h1>

            {/* API Status */}
            {
                !apiStatus &&
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
