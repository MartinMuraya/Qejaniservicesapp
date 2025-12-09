import { useState } from "react";
import { stkPushPayment } from "../api/mpesa";

const PaymentForm = ({ providerId }) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handlePayment = async () => {
    try {
      const res = await stkPushPayment(providerId, phone, Number(amount));
      setStatus(res.success ? "STK Push sent! Check your phone." : res.message);
    } catch (err) {
      setStatus("Payment failed: " + err.message);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">Make a Payment</h2>
      <input
        type="text"
        placeholder="Phone (07xxxxxxxx)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handlePayment}
        className="bg-indigo-600 text-white p-2 rounded w-full"
      >
        Pay
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default PaymentForm;
