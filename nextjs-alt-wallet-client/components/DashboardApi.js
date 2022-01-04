import Dashboard from './Dashboard';
import React, { useState, useEffect } from 'react';
import { utils } from 'ethers';
import { ethers } from 'ethers';

const DashboardApi = ({ props }) => {

    const [apiStatus, setApiStatus] = useState(null);
    const apiUrl = "http://localhost:7546/"
    const apiConnexionTimeout = 10;
    const [transactionsHistory, setTransactionsHistory] = useState(null);

    const [networkName, setNetworkName] = useState();
    const [signerAddress, setSignerAddress] = useState();
    const [signerBalance, setSignerBalance] = useState();
    const [signerWalletTransactionCount, setSignerWalletTransactionCount] = useState();

    const apiRequestBuilder = async (ressourcePath, type, params, responseType) => {
        return new Promise((resolve, reject) => {
            try {
                var request = new XMLHttpRequest();
                ressourcePath = apiUrl + ressourcePath;
                request.open(type, ressourcePath + "?" + params, true);
                request.timeout = 10000;
                request.responseType = responseType;
                request.onload = function (e) {
                    if (this.status == 200) {
                        apiConnexionTimeout = 10;
                        resolve(this.response);
                    }
                };
                request.send();
                request.ontimeout = function () {
                    setApiStatus(null);
                    resolve(null);
                    console.log("[-] Error, timeout for connexion to the API")
                }
            } catch (err) {
                throw new Error(err);
            }
        })
    }

    const testConnexionToApi = async () => {
        try {
            apiConnexionTimeout -= 1;
            if (apiConnexionTimeout <= 0) {
                setApiStatus(null);
            }
            const apiResponse = await apiRequestBuilder("", "GET", "", "text");
            setApiStatus(apiResponse);

        } catch (err) {
            throw new Error(err);                    //console.log(err);
        }
    }

    const getWalletInformation = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            let networkName = (await provider.getNetwork()).name;
            setNetworkName(networkName);

            const signer = provider.getSigner();
            let signerAddress = (await signer.getAddress());
            setSignerAddress(signerAddress);
            getTransactionHistory(signerAddress);

            let signerBalance = (await ethers.utils.formatEther(await signer.getBalance()));
            setSignerBalance(signerBalance);

            let signerWalletTransactionCount = await signer.getTransactionCount();
            setSignerWalletTransactionCount(signerWalletTransactionCount);

            await window.ethereum.send("eth_requestAccounts");

        } catch (err) {
            console.log(err);
        }
    }

    const getTransactionHistory = async (walletAddress) => {
        try {
            let params = "publicKey=" + walletAddress
            const apiResponse = await apiRequestBuilder("wallet/transactionsHistory", "GET", params, "json");
            setTransactionsHistory(apiResponse);
            console.log(apiResponse[0])

        } catch (err) {
            throw new Error(err);                    //console.log(err);
        }
    }

    useEffect(() => {
        try {
            getWalletInformation();
            testConnexionToApi();
            setInterval(testConnexionToApi, 1000);

        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <div className="flex flex-col justify-center text-center">
            <div className="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                <h1 className="text-4xl">API Dashboard</h1>
                {
                    !apiStatus &&
                    <h1 className="bg-red-600">API Status: Offline</h1>
                }
                {
                    apiStatus &&
                    <h1 className="bg-green-600">API Status: Online</h1>
                }
                {
                    transactionsHistory ?
                        <div>
                            <div class="container mx-auto px-4 sm:px-8">
                                <div class="py-8 ">
                                    <div>
                                        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                            <table class="min-w-full leading-normal">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" class="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                                            Index
                                                        </th>
                                                        <th scope="col" class="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                                            Hash
                                                        </th>
                                                        <th scope="col" class="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                                            Gas Price (ETH)
                                                        </th>
                                                        <th scope="col" class="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                                            value (ETH)
                                                        </th>
                                                        <th scope="col" class="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                                            timestamp
                                                        </th>
                                                        <th scope="col" class="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactionsHistory.map((transaction) =>
                                                        <tr>
                                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p class="text-gray-900 whitespace-no-wrap">
                                                                    {transaction.nonce - 1}
                                                                </p>
                                                            </td>
                                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p class="text-gray-900 whitespace-no-wrap">
                                                                    {transaction.hash}
                                                                </p>
                                                            </td>
                                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p class="text-gray-900 whitespace-no-wrap">
                                                                    {utils.formatEther(transaction.gasPrice)}
                                                                </p>
                                                            </td>
                                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p class="text-gray-900 whitespace-no-wrap">
                                                                    {utils.formatEther(transaction.value)}
                                                                </p>
                                                            </td>
                                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p class="text-gray-900 whitespace-no-wrap">
                                                                    {new Date(transaction.timestamp * 1000).getDate()}/{new Date(transaction.timestamp * 1000).getMonth()}/{new Date(transaction.timestamp * 1000).getFullYear()}
                                                                </p>
                                                            </td>
                                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                    <span aria-hidden="true" class="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                                                                    </span>
                                                                    <span class="relative">
                                                                        Done
                                                                    </span>
                                                                </span>
                                                            </td>
                                                        </tr>


                                                        /*
                                                        <div>
                                                            <p>Transaction number: {transaction.nonce - 1}</p>
                                                            <p>Transaction hash: {transaction.hash}</p>
                                                            <p className="bg-blue-400">Transaction index: {transaction.transactionIndex}</p>
                                                            <p>Transaction done at {transaction.timestamp}</p>
                                                            <p >Transaction done to {transaction.to}</p>
                                                        </div>
                                                        */
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        :

                        <div>
                            <h3>Recovery of your transaction history, please wait...</h3>
                        </div>
                }
            </div>
        </div>
    )
}

export default DashboardApi;
