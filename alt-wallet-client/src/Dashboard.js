import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { resolveProperties } from "@ethersproject/properties";




const testConnexionToApi = async () => {
    console.log("[ ]  Test Connexion to API...")
    return new Promise((resolve, reject) => {
        try {
            var url = "http://localhost:7546/"
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'text';
            request.send();

            fetch(url).then(function (response) {
                response.text().then(function (text) {
                    //console.log("reponse: ");
                    //console.log(text);
                    resolve(text);
                });
            });

        } catch (err) {
            console.log(err);
        }
    })
}

const getWalletInformation = async ({ setApiStatus, apiStatus }) => {
    console.log("[ ]  Get Wallet Informations...")
    try {
        setApiStatus(await testConnexionToApi());
        await window.ethereum.send("eth_requestAccounts");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    } catch (err) {
        console.log(err);
    }
}


export default function Dashboard() {
    const [apiStatus, setApiStatus] = useState("Offline");
    getWalletInformation({ setApiStatus, apiStatus });


    return (
        <div className="bg-gray-600 text-center text-white">
            <h1>Bienvenue sur votre Dashboard cliente ETH</h1>
            <h2>API Status: {apiStatus}</h2>
        </div>
    )
}
