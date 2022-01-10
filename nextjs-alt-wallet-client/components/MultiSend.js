import ErrorMessage from "../components/ErrorMessage";
import { useState, useEffect } from "react";

const MultiSend = () => {

    const [error, setError] = useState();
    const [formValues, setFormValues] = useState([{ deliveryAddress: "", amount: "" }])

    /**
 * * Get account from metamask
 */
    async function requestAccount() {
        if (typeof window.ethereum == 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
            getBalance()
        }
    }

    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(altTokenAddress, Token.abi, provider)
            const balance = await contract.balanceOf(account);
            const network = await provider.getNetwork();
            console.log(destinationAddress);

            balance = balance.toString();
            setUserAccount(account);
            setAltTokenBalance(balance);
            setWalletNetworkUse(network.name);
        }
    }

    async function sendCoins() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await requestAccount()
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(altTokenAddress, Token.abi, signer);
                console.log(destinationAddress);
                const transaction = await contract.transfer(destinationAddress, amount);
                await transaction.wait();
                console.log(`${amount} Coins successfully sent to ${userAccount}`);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    }

    let addFormFields = () => {
        setFormValues([...formValues, { name: "", email: "" }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        alert(JSON.stringify(formValues));
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
                {formValues.map((element, index) => (
                    <div className="form-inline" key={index}>
                        <label>Delivery Address</label>
                        <input type="text" name="name" value={element.name || ""} onChange={e => handleChange(index, e)} className="simpleInput" />
                        <label>Amount</label>
                        <input type="text" name="email" value={element.email || ""} onChange={e => handleChange(index, e)} class="simpleInput" />
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
