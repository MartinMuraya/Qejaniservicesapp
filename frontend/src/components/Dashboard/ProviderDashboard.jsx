import { useEffect, useState } from "react";
import { getProviderPayments } from "../../api/mpesa";
import PaymentForm from "../PaymentForm";

const ProviderDashboard = ({ providerId }) => {
  const [payments, setPayments] = useState([]);
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProviderPayments(providerId);
      setPayments(data.payments || []);
      setWallet(data.walletBalance || 0);
    };
    fetchData();
  }, [providerId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Provider Dashboard</h1>
      <div className="mb-4">Wallet Balance: <strong>{wallet} KES</strong></div>
      <PaymentForm providerId={providerId} />
      <h2 className="text-xl font-bold mt-6 mb-2">Payment History</h2>
      <ul>
        {payments.map(p => (
          <li key={p._id}>{p.amount} KES from {p.phone} — {p.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderDashboard;
