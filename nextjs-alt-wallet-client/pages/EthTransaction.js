import DashboardApi from '../components/DashboardApi';
import Navbar from '../components/Navbar';
import SendTransaction from "../components/SendTransaction";
import { useState } from 'react';

const EthTransaction = () => {
    const [walletAddressFromParent, setWalletAddressFromParent] = useState();

    return (
        <div>
            <Navbar />
            <SendTransaction setWalletAddressFromParent={setWalletAddressFromParent} />
            <DashboardApi walletAddress={walletAddressFromParent} />
        </div>
    )
}

export default EthTransaction;
