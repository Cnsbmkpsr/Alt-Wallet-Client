import Dashboard from './Dashboard';
import React, { useState, useEffect } from 'react';

const DashboardApi = ({ props }) => {

    const [apiStatus, setApiStatus] = useState(null);
    const apiUrl = "http://localhost:7546/"
    const apiConnexionTimeout = 10;
    const [transactionsHistory, setTransactionsHistory] = useState(null);

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

    const getTransactionHistory = async (props) => {
        try {
            let params = "publicKey=" + "0x86B8582BFA4deE84802e9FB6609BBAf065209E3A"
            const apiResponse = await apiRequestBuilder("wallet/transactionsHistory", "GET", params, "json");
            setTransactionsHistory(apiResponse);
            console.log(apiResponse[0])

        } catch (err) {
            throw new Error(err);                    //console.log(err);
        }
    }

    useEffect(() => {
        try {
            testConnexionToApi();
            setInterval(testConnexionToApi, 1000);
            getTransactionHistory(props);
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
                    transactionsHistory &&
                    <div>
                        <h1>Transactions: </h1>
                        {transactionsHistory.map((transaction) =>
                            <div>
                                <p>Transaction number: {transaction.nonce - 1}</p>
                                <p>Transaction hash: {transaction.hash}</p>
                                <p>Transaction index: {transaction.transactionIndex}</p>
                                <p>Transaction done at {transaction.timestamp}</p>
                                <p>Transaction done to {transaction.to}</p>
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default DashboardApi;
