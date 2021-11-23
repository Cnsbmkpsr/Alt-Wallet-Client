import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { resolveProperties } from "@ethersproject/properties";

let APIConnexion = false;


const testConnexionToApi = async () => {
    console.log("[ ]  Test Connexion to API...")
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
        }
    })
}

const getWalletInformation = async ({ setApiStatus }) => {
    try {
        setApiStatus(await testConnexionToApi());
        await window.ethereum.send("eth_requestAccounts");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let networkName = (await provider.getNetwork()).name;

        const signer = provider.getSigner();
        let signerAddress = (await signer.getAddress());

        let signerWalletTransactionCount = await signer.getTransactionCount();

    } catch (err) {
        console.log(err);
    }
}

export default function Dashboard() {
    const [apiStatus, setApiStatus] = useState();
    getWalletInformation({ setApiStatus });

    setInterval(getWalletInformation, 10000, { setApiStatus });


    return (
        <div className="bg-gray-600 text-center text-white">
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
                !APIConnexion &&
                <h1 className="bg-yellow-600">Please wait, we are trying to connect to the API...</h1>
            }
        </div>
    )
}
