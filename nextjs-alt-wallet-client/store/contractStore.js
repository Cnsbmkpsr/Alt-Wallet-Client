import ERC20ABI from '../assets/abi-erc20.json'
import { ethers } from 'ethers';

export function getERC20Contract(tokenAddress, signer) {
    console.log(tokenAddress)
    const contract = new ethers.Contract(tokenAddress, ERC20ABI, signer);
    return contract;
}