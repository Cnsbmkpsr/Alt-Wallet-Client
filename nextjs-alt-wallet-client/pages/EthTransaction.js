import DashboardApi from '../components/DashboardApi';
import Navbar from '../components/Navbar';
import SendTransaction from "../components/SendTransaction";

const EthTransaction = () => {
    return (
        <div>
            <Navbar />
            <SendTransaction />
            <DashboardApi />
        </div>
    )
}

export default EthTransaction;
