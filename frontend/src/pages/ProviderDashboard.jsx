import { useEffect, useState } from "react";
import {
  fetchProviderData,
  providerWithdraw
} from "../api/providerApi";

export default function ProviderDashboard() {
  const providerId = localStorage.getItem("providerId");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [payments, setPayments] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProviderData();
  }, []);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      const res = await fetchProviderData(providerId);
      setWallet(res.data.walletBalance || 0);
      setPayments(res.data.payments || []);
    } catch (err) {
      setMessage("Failed to load provider data");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage("");

    const amount = Number(withdrawAmount);
    if (!amount || amount < 200) {
      setMessage("Minimum withdrawal is KES 200");
      return;
    }

    if (amount > wallet) {
      setMessage("Insufficient wallet balance");
      return;
    }

    try {
      const res = await providerWithdraw(providerId, { amount });
      setMessage(res.data?.message || "Withdrawal sent!");

      setWithdrawAmount("");
      loadProviderData();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </header>

        {message && (
          <div className="mb-4 text-red-600 text-sm">{message}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4">
            <div className="text-sm text-gray-500">Wallet Balance</div>
            <div className="text-2xl font-bold mt-1">{wallet} KES</div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <div className="text-sm text-gray-500">Total Payments</div>
            <div className="text-2xl font-bold mt-1">{payments.length}</div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <div className="text-sm text-gray-500">Available to Withdraw</div>
            <div className="text-2xl font-bold mt-1">{wallet} KES</div>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-white shadow rounded p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Withdraw</h2>
          <form onSubmit={handleWithdraw} className="flex gap-3">
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border p-2 rounded w-48"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Withdraw
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-2">
            Minimum withdrawal: 200 KES
          </p>
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>

          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600 border-b">
                  <th className="py-2">Amount</th>
                  <th>Commission</th>
                  <th>Net</th>
                  <th>Receipt</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-500 py-4"
                    >
                      No payments yet
                    </td>
                  </tr>
                )}

                {payments.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="py-2">{p.amount} KES</td>
                    <td>{p.commission} KES</td>
                    <td>{p.providerAmount} KES</td>
                    <td>{p.mpesaReceipt}</td>
                    <td className="text-sm">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
