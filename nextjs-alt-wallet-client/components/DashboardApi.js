import Dashboard from './Dashboard';
import React, { useState, useEffect } from 'react';

const DashboardApi = () => {

    const [apiStatus, setApiStatus] = useState(null);


    const testConnexionToApi = () => {
        return new Promise((resolve, reject) => {
            try {
                var url = "http://localhost:7546/"
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.timeout = 5000;
                request.responseType = 'text';
                request.send();
                fetch(url).then(function (response) {
                    response.text().then(function (text) {
                        setApiStatus(true);
                        resolve(text);
                    });
                });
                request.ontimeout = function () {
                    setApiStatus(null);
                }
            } catch (err) {
                throw new Error(err);                    //console.log(err);
                setApiStatus(null);
            }
        })
    }

    useEffect(() => {
        testConnexionToApi();
        setInterval(testConnexionToApi, 1000);
    }, [apiStatus]);

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
