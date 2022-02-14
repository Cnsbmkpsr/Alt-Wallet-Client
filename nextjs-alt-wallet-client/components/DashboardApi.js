import { useState, useEffect, useCallback } from 'react';
import { utils } from 'ethers';
import { ethers } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BiClipboard } from "react-icons/bi"
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

const DashboardApi = ({ walletAddress }) => {

    // * Currently, the API is freely host on a Google Cloud VM
    const apiUrl = "https://altapihttps.ddns.net:443/"

    // * After 30 secondes without response, the API status is Offline by default
    let apiConnexionTimeout = 30;

    const [apiStatus, setApiStatus] = useState(null);
    const [transactionsHistory, setTransactionsHistory] = useState(null);
    const [signerAddress, setSignerAddress] = useState();
    const [hasError, setHasError] = useState("API Status: Offline");

    // TODO: Simplify the request with Axios or fetch in Javascript
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

                // * Set if the transaction is an income ou an outgoing
                for (let i = 0; i < apiResponse.length; i++) {
                    if (apiResponse[i].to == null) {
                        apiResponse[i].to = walletAddress;
                        apiResponse[i].transactionType = "receive"
                    } else {
                        apiResponse[i].transactionType = "sending"
                    }

                    let TransactionETHValue = utils.formatEther(apiResponse[i].value);
                    if (TransactionETHValue == 0) {
                        apiResponse[i].value = "Another Token was send";
                    } else {
                        apiResponse[i].value = TransactionETHValue;
                    }

                }
                setTransactionsHistory(apiResponse);
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
            setSignerAddress(signerAddress);
            let networkProvider = await provider.getNetwork();
            networkProvider = networkProvider.name;
            if (walletAddress == null) {
                await window.ethereum.send("eth_requestAccounts");
            } else {
                getTransactionHistory(walletAddress, networkProvider);
            }
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
        } catch (err) {
            setHasError(err.message);
            console.log(err);
        }
    }, [getWalletInformation, testConnexionToApi, walletAddress]);

    return (
        <div>
            <div className="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                <h1 className="text-4xl text-center">Transaction history</h1>

                {
                    hasError &&
                    <ErrorMessage message={hasError} />
                }

                {
                    apiStatus &&
                    <div>
                        <div className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4 max-w mt-4" role="alert">
                            <p className="font-bold">
                                Success
                            </p>
                            <p className="max-w-sm">
                                API Status: Online
                            </p>
                        </div>

                    </div>
                }

                <div className="flex flex-col justify-center text-center">
                    {
                        transactionsHistory ?
                            < div >
                                <div className="container mx-auto px-4 sm:px-8">
                                    <div className="py-8 ">
                                        <div>
                                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                                <table className="min-w-full leading-normal">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                                                Type
                                                            </th>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800 text-sm uppercase font-normal">
                                                                Hash
                                                            </th>
                                                            <th scope="col" className="px-5 py-5 bg-white  border-b border-r border-gray-200 text-gray-800 text-sm uppercase font-normal">
                                                                Receiver address
                                                            </th>
                                                            <th scope="col" className="px-1 py-5 bg-white  border-b border-r border-gray-200 text-gray-800 text-sm uppercase font-normal">
                                                                Gas Price (Wei)
                                                            </th>
                                                            <th scope="col" className="px-1 py-5 bg-white  border-b border-r border-gray-200 text-gray-800  text-sm uppercase font-normal">
                                                                value (ETH)
                                                            </th>
                                                            <th scope="col" className="px-1 py-5 bg-white  border-b border-r border-gray-200 text-gray-800  text-sm uppercase font-normal">
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
                                                                    {
                                                                        transaction.transactionType == "sending" ?
                                                                            <p className="text-purple-400 whitespace-no-wrap">
                                                                                {transaction.transactionType}
                                                                            </p>
                                                                            :
                                                                            <p className="text-sky-300 whitespace-no-wrap">
                                                                                {transaction.transactionType}
                                                                            </p>
                                                                    }

                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 justify-center whitespace-no-wrap flex flex-nowrap">
                                                                        {transaction.hash.substring(0, 4)} ...    {transaction.hash.substring(transaction.hash.length - 4, transaction.hash.length)}
                                                                        <CopyToClipboard

                                                                            text={transaction.hash}>
                                                                            <BiClipboard />
                                                                        </CopyToClipboard>
                                                                    </p>
                                                                </td>
                                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 justify-center whitespace-no-wrap flex flex-nowrap">
                                                                        {transaction.to.substring(0, 4)} ...    {transaction.to.substring(transaction.to.length - 4, transaction.to.length)}
                                                                        <CopyToClipboard

                                                                            text={transaction.to}>
                                                                            <BiClipboard />
                                                                        </CopyToClipboard>
                                                                    </p>
                                                                </td>
                                                                <td className="px-1 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                                        {utils.formatEther(transaction.gasPrice)}
                                                                    </p>
                                                                </td>
                                                                <td className="px-1 py-5 border-b border-gray-200 bg-white text-sm border-r">
                                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                                        {transaction.value}
                                                                    </p>
                                                                </td>
                                                                <td className="px-1 py-5 border-b border-gray-200 bg-white text-sm border-r">
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
                                <div className="rounded-md flex items-center jusitfy-between px-5 py-4 mt-2 border border-sky-500 text-sky-500">
                                    <div className="w-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className=" w-6 h-6 mr-2" viewBox="0 0 1792 1792">
                                            <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
                                            </path>
                                        </svg>
                                        <p>We use public APIs to collect your information. If your history does not appear in a few seconds, refresh the page</p>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div >
    )
}

DashboardApi.propTypes = {
    walletAddress: PropTypes.string
}

export default DashboardApi;
