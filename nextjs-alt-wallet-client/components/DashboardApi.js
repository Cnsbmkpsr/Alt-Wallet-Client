import Dashboard from './Dashboard';
import React, { useState, useEffect } from 'react';

const DashboardApi = ({ props }) => {

    const [apiStatus, setApiStatus] = useState(null);
    const apiUrl = "http://localhost:7546/"

    const apiRequestBuilder = async (ressourcePath, type, params) => {
        return new Promise((resolve, reject) => {
            try {
                var request = new XMLHttpRequest();
                ressourcePath = apiUrl + ressourcePath;
                request.open(type, ressourcePath + "?" + params, true);
                request.timeout = 30000;
                request.responseType = 'json';
                request.onload = function (e) {
                    if (this.status == 200) {
                        console.log(this.response); // JSON response  
                    }
                };
                request.send();
                fetch(apiUrl).then(function (response) {
                    resolve(response);
                });
                request.ontimeout = function () {
                    setApiStatus(null);
                    console.log("[-] Error, timeout for connexion to the API")
                }
            } catch (err) {
                throw new Error(err);
            }
        })
    }

    const testConnexionToApi = async () => {
        try {
            const apiResponse = await apiRequestBuilder("", "GET", "");
            setApiStatus(apiResponse);
        } catch (err) {
            throw new Error(err);                    //console.log(err);
        }
    }

    const getTransactionHistory = async (props) => {
        try {
            let params = "publicKey=" + "0x86B8582BFA4deE84802e9FB6609BBAf065209E3A"
            const apiResponse = await apiRequestBuilder("wallet/transactionsHistory", "GET", params);
            //console.log(apiResponse);
        } catch (err) {
            throw new Error(err);                    //console.log(err);
        }
    }

    useEffect(() => {
        testConnexionToApi();
        //setInterval(testConnexionToApi, 1000);
        getTransactionHistory(props);
    }, []);

    return (
        <div className="flex flex-col justify-center text-center">
            <div class="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                <h1 className="text-4xl">API Dashboard</h1>
                {
                    !apiStatus &&
                    <h1 className="bg-red-600">API Status: Offline</h1>
                }
                {
                    apiStatus &&
                    <h1 className="bg-green-600">API Status: Online</h1>
                }
            </div>
        </div>
    )
}

export default DashboardApi;
