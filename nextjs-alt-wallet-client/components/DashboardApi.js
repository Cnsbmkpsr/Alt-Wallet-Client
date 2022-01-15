import { useState, useEffect, useCallback } from 'react';
import { utils } from 'ethers';
import { ethers } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BiClipboard } from "react-icons/bi"

const DashboardApi = () => {

    const [apiStatus, setApiStatus] = useState(null);
    const apiUrl = "http://34.78.56.8:7546/"
    let apiConnexionTimeout = 10;
    const [transactionsHistory, setTransactionsHistory] = useState(null);
    const [signerAddress, setSignerAddress] = useState();


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
                throw new Error(err);
            }
        })
    }, [])

    const testConnexionToApi = async () => {
        try {
            apiConnexionTimeout -= 1;
            if (apiConnexionTimeout <= 0) {
                setApiStatus(null);
            }
            const apiResponse = await apiRequestBuilder("", "GET", "", "text");
            setApiStatus(apiResponse);
        } catch (err) {
            throw new Error(err);
        }
    }

    const getWalletInformation = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let walletAddress = (await signer.getAddress());
            setSignerAddress(signerAddress);
            getTransactionHistory(walletAddress);
            await window.ethereum.send("eth_requestAccounts");
        } catch (err) {
            console.log(err);
        }
    }

    const getTransactionHistory = useCallback(
        async (walletAddress) => {
            try {
                let params = "publicKey=" + walletAddress
                const apiResponse = await apiRequestBuilder("wallet/transactionsHistory", "GET", params, "json");
                setTransactionsHistory(apiResponse);
                console.log(apiResponse[0])

            } catch (err) {
                throw new Error(err);                    //console.log(err);
            }
        },
        [apiRequestBuilder],
    )

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
    )
}

export default DashboardApi;
