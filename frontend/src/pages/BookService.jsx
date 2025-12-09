import { useState } from "react";

export default function BookService() {
  const [service, setService] = useState("");
  const [provider, setProvider] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [stkSent, setStkSent] = useState(false);

  const handlePayment = () => {
    if (!service || !provider || !date) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    // Simulate sending STK
    setTimeout(() => {
      setStkSent(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Book a Service</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <div>
          <label className="block mb-1 font-medium">Select Provider</label>
          <select
            className="w-full border p-2 rounded"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="">-- Choose Provider --</option>
            <option value="provider1">John Doe (Plumber)</option>
            <option value="provider2">Mary Ann (Electrician)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Service Type</label>
          <select
            className="w-full border p-2 rounded"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">-- Choose Service --</option>
            <option value="water">Water Repair</option>
            <option value="electrical">Electrical Fix</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Service Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Additional Details</label>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Describe the issue..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Sending STK Push..." : "Pay via M-Pesa (STK Push)"}
        </button>

        {stkSent && (
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
            <p className="font-medium">STK Push sent!</p>
            <p>Please check your phone and enter your M-Pesa PIN.</p>
          </div>
        )}
      </div>
    </div>
  );
}
