import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import MultiSend from '../components/MultiSend';
import PropTypes from 'prop-types';

const DashboardWalletERC20 = ({ erc20TokenAddress }) => {

    const [walletERC20Informations, setWalletERC20Informations] = useState({
        tokenName: "",
        userAccount: "",
        erc20TokenBalance: "",
        walletNetworkUse: ""
    })

    const getBalance = useCallback(async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(erc20TokenAddress, Token.abi, provider)
                console.log({ account });
                let balance = await contract.balanceOf(account);
                const network = await provider.getNetwork();
                const contractName = await contract.name();

                balance = balance.toString();


                setWalletERC20Informations({
                    tokenName: contractName,
                    userAccount: account,
                    erc20TokenBalance: balance,
                    walletNetworkUse: network.name
                })
            }
        } catch (err) {
            console.log(err.message);
        }
    },
        [erc20TokenAddress],
    )

    /**
     * * Get account from metamask
     */
    const requestAccount = useCallback(
        () => {
            if (typeof window.ethereum == 'undefined') {
                window.ethereum.request({ method: 'eth_requestAccounts' });
            } else {
                getBalance();
            }
        },
        [getBalance],
    )



    useEffect(() => {
        requestAccount();
    }, [erc20TokenAddress, requestAccount]);

    return (
        <div>
            <div className="flex flex-col bg-gray-100 p-4 m-4 shadow-lg dark:bg-gray-800">
                {walletERC20Informations.erc20TokenBalance ?
                    <div>
                        <p className="text-2xl w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                            Your wallet informations
                        </p>

                        <div className="dark:text-white">

                            <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Your wallet address :
                                </p>
                                <div className="flex items-end text-xs">
                                    {walletERC20Informations.userAccount}
                                </div>
                            </div>

                            <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Your {walletERC20Informations.tokenName} balance :
                                </p>
                                <div className="flex items-end text-xs">
                                    {walletERC20Informations.erc20TokenBalance}
                                </div>
                            </div>

                            <div className="flex items-center pb-2 mb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200">
                                <p>
                                    Network connected :
                                </p>
                                <div className="flex items-end text-xs">
                                    {walletERC20Informations.walletNetworkUse}
                                </div>
                            </div>

                        </div>
                        <MultiSend tokenAddress={erc20TokenAddress} />
                    </div>
                    : <div>
                        <h2>Waiting for information from your wallet...</h2>
                    </div>
                }

            </div>


        </div>
    )
}

DashboardWalletERC20.propTypes = {
    erc20TokenAddress: PropTypes.string
}

export default DashboardWalletERC20;
