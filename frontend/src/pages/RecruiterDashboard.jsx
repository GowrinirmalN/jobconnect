import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recruiterService } from '../api/recruiterService';
import { applicationService } from '../api/applicationService';
import { jobService } from '../api/jobService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    interviews: 0,
    hired: 0,
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profRes, statsRes, appRes, jobsRes] = await Promise.all([
          recruiterService.getProfile(),
          recruiterService.getDashboardStats(),
          applicationService.getRecruiterApplications(null, null, 0, 5),
          jobService.getRecruiterJobs(0, 5),
        ]);
        setProfile(profRes.data);
        setStats(statsRes.data || {});
        setRecentApplicants(appRes.data.content || []);
        setRecentJobs(jobsRes.data.content || []);
      } catch (err) {
        console.error('Failed to load recruiter dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading recruiter dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
            Employer Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {profile?.companyName || 'Recruiter Workspace'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Welcome back, {user.firstName}. Review candidate applications and track your open headcount.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/recruiter/post-job"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
          <Link
            to="/recruiter/applicants"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
          >
            Review All Applicants
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.activeJobs}</p>
            <p className="text-xs font-medium text-slate-400">Active Job Postings</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalApplicants}</p>
            <p className="text-xs font-medium text-slate-400">Total Applicants</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.shortlisted}</p>
            <p className="text-xs font-medium text-slate-400">Shortlisted</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.interviews}</p>
            <p className="text-xs font-medium text-slate-400">Interviews Scheduled</p>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Recent Applicants & Active Postings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applicants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Candidate Applications</h2>
            <Link
              to="/recruiter/applicants"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {recentApplicants.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No applicants received yet.
              </div>
            ) : (
              recentApplicants.map((app) => (
                <div key={app.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{app.applicantName}</h4>
                    <p className="text-xs text-indigo-600 font-medium">{app.jobTitle}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {app.experienceYears || 0} yrs exp • {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                    <Link
                      to="/recruiter/applicants"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Open Postings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">My Job Postings</h2>
            <Link
              to="/recruiter/jobs"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <p>No jobs posted yet.</p>
                <Link to="/recruiter/post-job" className="text-indigo-600 font-semibold underline">
                  Post your first vacancy
                </Link>
              </div>
            ) : (
              recentJobs.map((j) => (
                <div key={j.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{j.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {j.location} • {j.applicantCount} applicants
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={j.status} />
                    <Link
                      to={`/jobs/${j.id}`}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
