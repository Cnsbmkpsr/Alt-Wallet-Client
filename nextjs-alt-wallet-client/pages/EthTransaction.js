import DashboardApi from '../components/DashboardApi';
import Navbar from '../components/Navbar';
import SendTransaction from "../components/SendTransaction";
import { useState, useCallback } from 'react';

const EthTransaction = () => {
    const [walletAddressFromParent, setWalletAddressFromParent] = useState();

    // const handleWalletAddress = useCallback(
    //     (walletAddress) => {
    //         console.log("triggeeer")
    //         setWalletAddress(walletAddress);
    //     },
    //     [],
    // )

    return (
        <div>
            <Navbar />
            <SendTransaction setWalletAddressFromParent={setWalletAddressFromParent} />
            <DashboardApi walletAddress={walletAddressFromParent} />
        </div>
    )
}

export default EthTransaction;
