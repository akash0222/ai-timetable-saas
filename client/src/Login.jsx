import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API;

export default function Login({ setAuth }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setAuth(true);
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={e => setForm({ ...form, username: e.target.value })}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      /><br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}