import { useState } from "react";
import { ethers } from 'ethers';
import Token from "../artifacts/contracts/AltToken.sol/AltToken.json";
import { getAddress } from "ethers/lib/utils";
import PropTypes from 'prop-types';
import ErrorMessage from "./ErrorMessage";

const MultiSend = ({ tokenAddress }) => {

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
                const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
                for (let i = 0; i < multiDeliveryAddress.length; i++) {
                    let deliveryAddress = multiDeliveryAddress[i].deliveryAddress;
                    console.log(deliveryAddress);
                    if (isAddress(deliveryAddress)) {
                        setHasError(false);
                        const transaction = await contract.transfer(multiDeliveryAddress[i].deliveryAddress, multiDeliveryAddress[i].amount);
                        console.log({ transaction });
                        //await transaction.wait();
                        console.log(`${multiDeliveryAddress[i].amount} Coins successfully sent to ${multiDeliveryAddress[i].deliveryAddress}`);
                    } else {
                        setHasError("One or many of the distination addresses is not valid. Please check your entries.");
                    }
                }
            }
        } catch (err) {
            setHasError(err.message);
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
            {
                hasError &&
                <ErrorMessage message={hasError} />
            }
            <div className="flex justify-center">
                <form onSubmit={handleSubmit}>
                    {multiDeliveryAddress.map((element, index) => (
                        <div className="form-inline content-around p-1" key={index}>
                            <input type="text" name="deliveryAddress" value={element.deliveryAddress || ""} onChange={e => handleChange(index, e)} className="simpleInput" placeholder="Delivery Address" />
                            <input type="text" name="amount" value={element.amount || ""} onChange={e => handleChange(index, e)} className="simpleInput" placeholder="Amount" />

                            {
                                index ?
                                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => removeFormFields(index)}>Remove</button>
                                    : null
                            }
                        </div>
                    ))}
                    <div>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold m-2 py-2 px-4 rounded" type="button" onClick={() => addFormFields()}>Add Delivery Address</button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded" type="submit">Send the token</button>
                    </div>
                </form >
            </div >
        </div>
    )
}

MultiSend.propTypes = {
    tokenAddress: PropTypes.string
}

export default MultiSend;
