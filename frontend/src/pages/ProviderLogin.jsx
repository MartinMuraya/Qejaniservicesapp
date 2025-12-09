import { useState } from "react";
import { providerLogin } from "../api/authApi";

export default function ProviderLogin() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await providerLogin(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "provider");
      localStorage.setItem("providerId", res.data.provider._id);

      window.location.href = "/dashboard/provider";
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={submit}
        className="bg-white p-6 rounded shadow max-w-sm w-full space-y-3">

        <h1 className="text-xl font-bold">Provider Login</h1>

        <input name="phone" placeholder="Phone"
          className="border p-2 rounded w-full"
          onChange={handleChange} required />

        <input name="password" placeholder="Password" type="password"
          className="border p-2 rounded w-full"
          onChange={handleChange} required />

        {msg && <div className="text-red-600 text-sm">{msg}</div>}

        <button className="bg-indigo-600 text-white w-full p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
