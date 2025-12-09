import { useState } from "react";
import { userSignup } from "../api/authApi";

export default function UserSignup() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await userSignup(form);
      setMsg("Account created! Redirecting...");
      setTimeout(() => (window.location.href = "/login/user"), 1200);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={submit}
        className="bg-white p-6 rounded shadow max-w-sm w-full space-y-3">

        <h1 className="text-xl font-bold">User Signup</h1>

        <input name="name" placeholder="Full Name"
          className="border p-2 rounded w-full"
          onChange={handleChange} required />

        <input name="phone" placeholder="Phone (07...)"
          className="border p-2 rounded w-full"
          onChange={handleChange} required />

        <input name="password" placeholder="Password" type="password"
          className="border p-2 rounded w-full"
          onChange={handleChange} required />

        {msg && <div className="text-red-600 text-sm">{msg}</div>}

        <button className="bg-indigo-600 text-white w-full p-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
}
