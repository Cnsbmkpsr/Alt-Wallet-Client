import { useState, useEffect, useCallback } from 'react';
import { utils } from 'ethers';
import { ethers } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BiClipboard } from "react-icons/bi"
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
//const axios = require('axios');
import axios from 'axios';

const DashboardApi = ({ walletAddress }) => {

    const [apiStatus, setApiStatus] = useState(null);
    const apiUrl = "https://altapihttps.ddns.net:443/"
    //const apiUrl = "http://localhost:7546/"
    let apiConnexionTimeout = 10;
    const [transactionsHistory, setTransactionsHistory] = useState(null);
    const [signerAddress, setSignerAddress] = useState();
    const [hasError, setHasError] = useState("API Status: Offline");

    const apiRequestBuilder = useCallback(async (ressourcePath, type, params, responseType) => {
        return new Promise((resolve) => {
            try {
                var request = new XMLHttpRequest();
                ressourcePath = apiUrl + ressourcePath;
                request.open(type, ressourcePath + "?" + params, true);
                request.timeout = 10000;
                request.responseType = responseType;
                request.onload = function () {
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
                setHasError(err.message);
                throw new Error(err);
            }
        })
    }, [])

    const axiosTestApiConnexion = useCallback(() => {
        axios.get(apiUrl)
            .then(function (response) {
                //console.log({ response });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, []);


    const testConnexionToApi = useCallback(async () => {
        try {

            apiConnexionTimeout -= 1;
            if (apiConnexionTimeout <= 0) {
                setApiStatus(null);
            }
            const apiResponse = await apiRequestBuilder("", "GET", "", "text");
            setApiStatus(apiResponse);
            setHasError(null);
        } catch (err) {
            setHasError(err.message);
            throw new Error(err);
        }
    },
        [],
    )

    const getTransactionHistory = useCallback(
        async (walletAddress, networkProvider) => {
            try {
                let params = "publicKey=" + walletAddress + "&provider=" + networkProvider
                const apiResponse = await apiRequestBuilder("wallet/transactionsHistory", "GET", params, "json");
                setTransactionsHistory(apiResponse);
                //console.log(apiResponse[0])
            } catch (err) {
                console.log(err);
                setHasError(err.message);
                throw new Error(err);
            }
        },
        [apiRequestBuilder],
    )

    const getWalletInformation = useCallback(async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            //const signer = provider.getSigner();
            //let walletAddress = (await signer.getAddress());
            setSignerAddress(signerAddress);
            let networkProvider = await provider.getNetwork();
            networkProvider = networkProvider.name;
            getTransactionHistory(walletAddress, networkProvider);
            await window.ethereum.send("eth_requestAccounts");
        } catch (err) {
            setHasError(err.message);
            console.log(err.message);
        }
    },
        [getTransactionHistory, signerAddress, walletAddress],
    )

    useEffect(() => {
        try {
            getWalletInformation();
            testConnexionToApi();
            setInterval(testConnexionToApi, 1000);
            axiosTestApiConnexion();


        } catch (err) {
            setHasError(err.message);
            console.log(err);
        }
    }, [axiosTestApiConnexion, getWalletInformation, testConnexionToApi, walletAddress]);

    return (
        <div>
            <div>

            </div>
            <div className="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                {
                    hasError &&
                    <ErrorMessage message={hasError} />
                }
                {
                    apiStatus &&
                    <div className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4 max-w" role="alert">
                        <p className="font-bold">
                            Success
                        </p>
                        <p className="max-w-sm">
                            API Status: Online
                        </p>
                    </div>
                }
                <div className="flex flex-col justify-center text-center">
                    <h1 className="text-4xl">Transaction history</h1>

                    {
                        transactionsHistory ?
                            <div>
                                <div className="container mx-auto px-4 sm:px-8">
                                    <div className="py-8 ">
                                        <div>
                                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                                <table className="min-w-full leading-normal">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                                                Index
                                                            </th>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800 text-sm uppercase font-normal">
                                                                Hash
                                                            </th>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800 text-sm uppercase font-normal">
                                                                Gas Price (Wei)
                                                            </th>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                                                value (ETH)
                                                            </th>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                                                timestamp
                                                            </th>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800 text-sm uppercase font-normal">
                                                                Status
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {transactionsHistory.map((transaction) =>
                                                            <tr key={transaction.hash}>
                                                                <td className="px-5 py-5 border-b border-r border-gray-200 bg-white text-sm">
                                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                                        {transaction.nonce - 1}
                                                                    </p>
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 justify-center whitespace-no-wrap flex flex-nowrap">
                                                                        {transaction.hash.substring(0, 4)} ...                               {transaction.hash.substring(transaction.hash.length - 4, transaction.hash.length)}
                                                                        <CopyToClipboard

                                                                            text={transaction.hash}>
                                                                            <BiClipboard />
                                                                        </CopyToClipboard>
                                                                    </p>
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                                        {utils.formatEther(transaction.gasPrice)}
                                                                    </p>
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                                        {utils.formatEther(transaction.value)}
                                                                    </p>
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                                        {new Date(transaction.timestamp * 1000).getFullYear()}/{new Date(transaction.timestamp * 1000).getDate()}/{new Date(transaction.timestamp * 1000).getMonth()}
                                                                    </p>
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                        <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                                                                        </span>
                                                                        <span className="relative">
                                                                            Success
                                                                        </span>
                                                                    </span>
                                                                </td>
                                                            </tr>
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
        </div>
    )
}

DashboardApi.propTypes = {
    walletAddress: PropTypes.string
}

export default DashboardApi;
