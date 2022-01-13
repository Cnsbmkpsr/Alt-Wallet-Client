import { useState, useEffect, useCallback } from 'react';
import Navbar from "../components/Navbar";
import DashboardWalletERC20 from '../components/DashboardWalletERC20';
import DashboardTokenERC20 from '../components/DashboardTokenERC20';


const CustomTokenTransaction = () => {
    const [tokenAddress, setTokenAddress] = useState();

    const handleTokenChange = useCallback(
        (tokenAddress) => {
            setTokenAddress(tokenAddress);
        },
        [],
    )

    return (
        <div>
            <Navbar />
            <DashboardTokenERC20 onTokenChange={handleTokenChange} />
            <DashboardWalletERC20 erc20TokenAddress={tokenAddress} />
        </div>
    )
}

export default CustomTokenTransaction;
