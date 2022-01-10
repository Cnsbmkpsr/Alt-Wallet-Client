import ErrorMessage from "../components/ErrorMessage";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import { getAddress } from "ethers/lib/utils";

const MultiSend = () => {

    const altTokenAddress = "0xc2BC4Fcc10558868AF6706E4E80bD2dCb50D7034"

    const [error, setError] = useState();
    const [multiDeliveryAddress, setMultiDeliveryAddress] = useState([{ deliveryAddress: "", amount: 0 }])
    const [hasError, setHasError] = useState();

    /**
 * * Get account from metamask
 */
    async function requestAccount() {

        if (typeof window.ethereum == 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
            return (true);
        }


    }


    async function sendCoins() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await requestAccount()
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(altTokenAddress, Token.abi, signer);
                for (let i = 0; i < multiDeliveryAddress.length; i++) {
                    let deliveryAddress = multiDeliveryAddress[i].deliveryAddress;
                    console.log(deliveryAddress);
                    if (isAddress(deliveryAddress)) {
                        setHasError(false);
                        const transaction = await contract.transfer(multiDeliveryAddress[i].deliveryAddress, multiDeliveryAddress[i].amount);
                        //await transaction.wait();
                        console.log(`${multiDeliveryAddress[i].amount} Coins successfully sent to ${multiDeliveryAddress[i].deliveryAddress}`);
                    } else {
                        setHasError("One or many of the distination addresses is not valid. Please check your entries.");
                    }
                }

            }
        } catch (err) {
            setError(err.message);
        }
    }

    let handleChange = (i, e) => {
        let newFormValues = [...multiDeliveryAddress];
        newFormValues[i][e.target.name] = e.target.value;
        if (e.target.name == "amount") {
            let amountToSend = parseInt(e.target.value);
            if (isNaN(amountToSend)) {
                setHasError("Error for the quantity of token requested. Please enter a integer number only.");
            } else {
                setHasError(null);

            }
        }
        setMultiDeliveryAddress(newFormValues);

    }

    let addFormFields = () => {
        setMultiDeliveryAddress([...multiDeliveryAddress, { deliveryAddress: "", amount: "" }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...multiDeliveryAddress];
        newFormValues.splice(i, 1);
        setMultiDeliveryAddress(newFormValues)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        sendCoins();
    }

    function isAddress(address) {
        try {
            getAddress(address);
        } catch (e) { return false; }
        return true;
    }

    return (
        <div>
            {/*
            <input defaultValue={""} onChange={e => setDestinationAddress(e.target.value)} placeholder="Delivery address" class="simpleInput" />
            <input defaultValue={""} onChange={e => setAmount(e.target.value)} placeholder="Amount" class="simpleInput" />

            <ErrorMessage message={error} />

            <div>
                <button onClick={requestAccount} type="button" class="simpleButton m-2 bg-cyan-600">
                    Connect my wallet
                </button>

                <button onClick={getBalance} type="button" class="simpleButton m-2">
                    Get my Balance
                </button>

                <button onClick={sendCoins} type="button" class="simpleButton m-2 bg-green-500">
                    Send the token
                </button>


            </div>
            */}

            <form onSubmit={handleSubmit}>
                {
                    hasError &&
                    <div className="bg-red-300">
                        <p>{hasError}</p>
                    </div>
                }
                {multiDeliveryAddress.map((element, index) => (
                    <div className="form-inline" key={index}>
                        <label>Delivery Address</label>
                        <input type="text" name="deliveryAddress" value={element.deliveryAddress || ""} onChange={e => handleChange(index, e)} className="simpleInput" />
                        <label>Amount</label>
                        <input type="text" name="amount" value={element.amount || ""} onChange={e => handleChange(index, e)} class="simpleInput" />

                        {
                            index ?
                                <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => removeFormFields(index)}>Remove</button>
                                : null
                        }
                    </div>
                ))}
                <div className="button-section">
                    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => addFormFields()}>Add</button>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Send the token</button>
                </div>
            </form >
        </div >
    )
}

export default MultiSend;
