import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/admin/overview');
        if (mounted) setStats(resp.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h4 className="text-sm text-gray-500">Total users</h4>
          <div className="text-2xl font-bold">{loading ? '—' : stats.totalUsers}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="text-sm text-gray-500">Total resumes</h4>
          <div className="text-2xl font-bold">{loading ? '—' : stats.totalResumes}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="text-sm text-gray-500">Average resume score</h4>
          <div className="text-2xl font-bold">{loading ? '—' : stats.avgScore}</div>
        </div>
      </section>

      <section className="mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">User Management</h3>
          <div className="text-sm text-gray-600">Search and manage user accounts (implement server endpoints to enable actions).</div>
        </div>
      </section>

      <section className="mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">Resume Management</h3>
          <div className="text-sm text-gray-600">View and re-run AI analysis for resumes.</div>
        </div>
      </section>

      <section>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">AI Suggestions Monitor</h3>
          <div className="text-sm text-gray-600">Monitor suggested roles, errors, and retrain triggers.</div>
          {stats?.popularRoles && stats.popularRoles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Popular Suggested Roles</h4>
              <ul className="mt-2 text-sm text-gray-700">
                {stats.popularRoles.map((r, idx) => (
                  <li key={idx}>{r._id} ({r.count})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
