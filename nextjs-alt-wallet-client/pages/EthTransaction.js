import React from 'react'
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SendTransaction from "../components/SendTransaction";

const EthTransaction = () => {
    return (
        <div>
            <Navbar />
            <SendTransaction />
        </div>
    )
}

export default EthTransaction;
