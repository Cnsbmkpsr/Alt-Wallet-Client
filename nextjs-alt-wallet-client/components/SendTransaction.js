import { ethers } from 'ethers';
import Dashboard from './Dashboard';
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { useState } from 'react';
import PropTypes from "prop-types";

const SendTransaction = ({ setWalletAddressFromParent }) => {

    const startPayment = async ({ setError, setTxs, ether, addr }) => {
        try {
            if (!window.ethereum)
                throw new Error("No crypto wallet found. Please install it.");
            else {
                await window.ethereum.send("eth_requestAccounts");
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                ethers.utils.getAddress(addr);
                const tx = await signer.sendTransaction({
                    to: addr,
                    value: ethers.utils.parseEther(ether)
                });
                console.log({ ether, addr });
                console.log("tx", tx);
                setTxs([tx]);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const [error, setError] = useState();
    const [txs, setTxs] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        setError();
        await startPayment({
            setError,
            setTxs,
            ether: data.get("ether"),
            addr: data.get("addr")
        });
    };


    // const handleWalletAddress = useCallback(
    //     (walletAddress) => {
    //         setWalletAddressFromParent(walletAddress);
    //     },
    //     [],
    // )

    const handleWalletAddress =
        (walletAddress) => {
            setWalletAddressFromParent(walletAddress);
        }

    return (
        <div>

            <form className="m-2 gb-gray-600 " onSubmit={handleSubmit}>
                <div className="credit-card w-full lg:w-2/3 sm:w-auto shadow-lg mx-auto rounded-xl bg-gray-100">
                    <main className="mt-4 p-4">

                        <Dashboard walletAddress={handleWalletAddress} />

                        <h1 className="text-xl font-semibold text-gray-700 text-center">
                            Send ETH payment
                        </h1>
                        <div className="">
                            <div className="my-3">
                                <input
                                    type="text"
                                    name="addr"
                                    className="simpleInput w-full bg-white"
                                    placeholder="Recipient Address"
                                />
                            </div>
                            <div className="my-3">
                                <input
                                    name="ether"
                                    type="text"
                                    className="simpleInput w-full bg-white"
                                    placeholder="Amount in ETH"
                                />
                            </div>
                        </div>
                    </main>
                    <ErrorMessage message={error} />
                    <footer className=" flex p-4 justify-center">
                        <button type="submit"
                            className=" px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none ">
                            Send ETH
                        </button>
                        <TxList txs={txs} />
                    </footer>
                </div>
            </form>
        </div>
    )
}

SendTransaction.propTypes = {
    setWalletAddressFromParent: PropTypes.func
}

export default SendTransaction
