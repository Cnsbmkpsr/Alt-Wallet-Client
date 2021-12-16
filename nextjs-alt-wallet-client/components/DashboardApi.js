import React from 'react'
import Dashboard from './Dashboard';

const DashboardApi = () => {
    return (
        <div className="flex flex-col justify-center text-center">
            <div class="shadow-lg px-4 py-6 bg-gray-100 dark:bg-gray-800 relative m-4">
                <h1 className="text-4xl">API Dashboard</h1>
                <Dashboard />
            </div>
        </div>
    )
}

export default DashboardApi;
