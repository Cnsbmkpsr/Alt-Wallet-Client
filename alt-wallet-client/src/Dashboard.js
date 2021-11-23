import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";

var url = "http://localhost:7546/"
var request = new XMLHttpRequest();
request.open('GET', url);
request.responseType = 'text';
request.send();

fetch(url).then(function (response) {
    response.text().then(function (text) {
        console.log("reponse: ");
        console.log(text);
    });
});


const testConnexionToApi = async () => {
    console.log("[ ]  Test Connexion to API...")
    try {
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider.network.name);
        const signer = provider.getSigner();
        console.log(signer)
    } catch (err) {
        console.log(err);
    }
}

const getWalletInformation = async () => {
    console.log("[ ]  Get Wallet Informations...")
    try {
        await testConnexionToApi();
    } catch (err) {
        console.log(err);
    }
}


export default function Dashboard() {
    const [apiStatus, setApiStatus] = useState("Not connected");
    getWalletInformation();


    return (
        <div className="bg-gray-600">
            <h1>Dashboard here</h1>
            <h2>{apiStatus}</h2>
        </div>
    )
}
