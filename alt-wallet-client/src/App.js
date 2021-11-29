import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import Dashboard from "./Dashboard";
import WalletCard from "./WalletCard";
import SendTransaction from "./SendTransaction";




export default function App() {


  return (
    <div>
      <SendTransaction />
      <WalletCard />

    </div>
  );
}
