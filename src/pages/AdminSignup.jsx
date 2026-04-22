import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function AdminSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await authAPI.adminSignup({ name, email, password, adminSecret });
  const { token, user } = resp.data;
  setAuthData(token, user);
  navigate('/dashboard/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Admin Signup</h2>
      {error && <div className="p-2 bg-red-50 text-red-700 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full p-3 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-3 border rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input className="w-full p-3 border rounded" placeholder="Admin secret" value={adminSecret} onChange={e => setAdminSecret(e.target.value)} />
        <button className="btn-primary w-full">Create Admin</button>
      </form>
    </div>
  );
}
