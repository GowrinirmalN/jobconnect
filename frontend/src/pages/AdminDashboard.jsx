import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  PieChart,
  UserCheck
} from 'lucide-react';
import { adminService } from '../api/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating system analytics..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            JobConnect System Metrics & Control
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Real-time platform overview of registered users, recruitment pipelines, and jobs moderation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/jobs"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
          >
            Moderate Jobs
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</p>
            <p className="text-xs font-medium text-slate-400">Total Users</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats?.totalJobs || 0}</p>
            <p className="text-xs font-medium text-slate-400">Jobs Posted</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats?.totalApplications || 0}</p>
            <p className="text-xs font-medium text-slate-400">Applications</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats?.hiredApplications || 0}</p>
            <p className="text-xs font-medium text-slate-400">Hired Candidates</p>
          </div>
        </div>
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>User Demographics</span>
            <Link to="/admin/users" className="text-xs text-indigo-600 hover:underline">Manage</Link>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Job Seekers:</span>
              <span className="font-bold text-slate-800">{stats?.totalJobSeekers || 0}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Employer Recruiters:</span>
              <span className="font-bold text-slate-800">{stats?.totalRecruiters || 0}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Admins:</span>
              <span className="font-bold text-slate-800">1</span>
            </div>
          </div>
        </div>

        {/* Jobs Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Jobs by Employment Type</span>
            <Link to="/admin/jobs" className="text-xs text-indigo-600 hover:underline">Review</Link>
          </h3>
          <div className="space-y-2 text-xs">
            {stats?.jobsByType &&
              Object.entries(stats.jobsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between py-1">
                  <span className="text-slate-500 capitalize">{type.toLowerCase().replace('_', ' ')}:</span>
                  <span className="font-bold text-slate-800">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Application Stages */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Application Pipelines</span>
            <Link to="/admin/applications" className="text-xs text-indigo-600 hover:underline">Audit</Link>
          </h3>
          <div className="space-y-2 text-xs">
            {stats?.applicationsByStatus &&
              Object.entries(stats.applicationsByStatus).map(([st, count]) => (
                <div key={st} className="flex items-center justify-between py-1">
                  <span className="text-slate-500 capitalize">{st.toLowerCase().replace('_', ' ')}:</span>
                  <span className="font-bold text-slate-800">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

