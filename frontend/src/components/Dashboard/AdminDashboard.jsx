import { useEffect, useState } from "react";
import { getAdminEarnings } from "../../api/mpesa";

const AdminDashboard = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      const data = await getAdminEarnings();
      setEarnings(data || []);
    };
    fetchEarnings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul>
        {earnings.map(e => (
          <li key={e._id}>
            Provider {e.providerId} — Commission: {e.amount} KES
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
