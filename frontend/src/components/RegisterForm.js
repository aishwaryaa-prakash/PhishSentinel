import React, { useState } from "react";
import { registerUser } from "../api";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      console.log("✅ Registration success:", res.data);
      setMessage(res.data.message || "Registration successful");
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        <input
          name="username"
          placeholder="Username"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600"
        >
          Register
        </button>

        {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
