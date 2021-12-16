import React from 'react'
import Dashboard from '../components/Dashboard';
import DashboardApi from '../components/DashboardApi';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SendTransaction from "../components/SendTransaction";

const EthTransaction = () => {
    return (
        <div>
            <Navbar />
            <SendTransaction />
            <DashboardApi props={"0x86B8582BFA4deE84802e9FB6609BBAf065209E3A"} />
        </div>
    )
}

export default EthTransaction;
