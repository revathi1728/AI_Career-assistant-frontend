import React, { useEffect, useState } from 'react';
import resumeAPI, { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [respResumes, respDashboard] = await Promise.all([
          resumeAPI.getResumes(),
          userAPI.getDashboard()
        ]);

        if (mounted) {
          setResumes(respResumes.data.resumes || []);
          setDashboard(respDashboard.data.dashboard || null);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const avgScore = () => {
    const scores = resumes.map(r => (r.aiAnalysis && r.aiAnalysis.score) || 0).filter(Boolean);
    if (!scores.length) return 0;
    return Math.round(scores.reduce((a,b) => a+b,0)/scores.length);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome back{user && user.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>

      <section className="mb-6">
        <div className="bg-white shadow rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Career Summary</h2>
              <p className="text-sm text-gray-600">Profile completion and quick metrics</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{dashboard ? `${dashboard.stats?.avgScore || 0}/100` : `${avgScore()}/100`}</div>
              <div className="text-sm text-gray-500">Average resume score</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <div className="bg-white shadow rounded p-4">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary">Upload New Resume</button>
              <button className="btn-outline">View Career Suggestions</button>
              <button className="btn-outline">Get Skill Gap Analysis</button>
              <button className="btn-outline">Download Career Report (PDF)</button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="font-semibold mb-2">Profile</h3>
            <div className="text-sm text-gray-700">{user ? user.email : 'Not signed in'}</div>
            <div className="mt-2">Profile completion: <span className="font-medium">80%</span></div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">Uploaded Resumes</h3>
          {loading ? <div>Loading...</div> : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th>Filename</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {resumes.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.originalFileName}</td>
                    <td className="py-2">{(r.aiAnalysis && r.aiAnalysis.score) || '—'}</td>
                    <td className="py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="py-2"><button className="text-blue-600">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {dashboard && (
        <section className="mb-6">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold mb-2">Suggested Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium">Top Missing Skills</h4>
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  {(dashboard.recentSuggestions && dashboard.recentSuggestions.length > 0) ? (
                    dashboard.recentSuggestions.slice(0,5).map(s => (
                      <li key={s.id}>{s.resumeName}: {s.suggestionsCount} suggestions</li>
                    ))
                  ) : (
                    <li>No suggestions yet</li>
                  )}
                </ul>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-medium">Recommended Career Paths</h4>
                <p className="text-sm text-gray-700 mt-2">Top roles and learning links will appear here once AI analysis runs.</p>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-medium">Certifications</h4>
                <p className="text-sm text-gray-700 mt-2">Suggested certifications and resources will appear here.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">Activity</h3>
          <div className="text-sm text-gray-600">Recent uploads and analyses will appear here.</div>
        </div>
      </section>
    </div>
  );
}
