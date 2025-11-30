import React, { useState } from "react";
import apiClient from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await apiClient.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    // store access_token correctly
    localStorage.setItem("token", response.data.access_token);

    toast.success("Login successful! 🎉");
    if (onLoginSuccess) onLoginSuccess();
    navigate("/dashboard");
  } catch (err) {
    toast.error(err.response?.data?.detail || "Login failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
     <PageWrapper>
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    </PageWrapper>
  );
};

export default Login;
