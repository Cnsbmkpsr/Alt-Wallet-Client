import React from 'react'
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import SendTransaction from "../components/SendTransaction";

const EthTransaction = () => {
    return (
        <div>
            <Header />
            <SendTransaction />
        </div>
    )
}

export default EthTransaction;
