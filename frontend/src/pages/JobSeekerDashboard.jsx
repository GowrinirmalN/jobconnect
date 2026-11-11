import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  User, 
  Search, 
  ArrowRight, 
  Sparkles,
  Building2,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../api/applicationService';
import { jobSeekerService } from '../api/jobSeekerService';
import { jobService } from '../api/jobService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileRes, appRes, jobsRes] = await Promise.all([
          jobSeekerService.getProfile(),
          applicationService.getMyApplications(0, 5),
          jobService.getFeaturedJobs(),
        ]);
        setProfile(profileRes.data);
        setApplications(appRes.data.content || []);
        setRecommendedJobs(jobsRes.data?.slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to load seeker dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading candidate dashboard..." />;

  const stats = {
    total: applications.length,
    underReview: applications.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'APPLIED').length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    interviews: applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
            Candidate Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {profile?.headline || 'Explore vacancies, update your portfolio, and track hiring decisions.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/jobs"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Jobs</span>
          </Link>
          <Link
            to="/seeker/profile"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
            <p className="text-xs font-medium text-slate-400">Total Applied</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.underReview}</p>
            <p className="text-xs font-medium text-slate-400">Under Review</p>
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
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.interviews}</p>
            <p className="text-xs font-medium text-slate-400">Interviews</p>
          </div>
        </div>
      </div>

      {/* Grid: Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
            <Link
              to="/seeker/applications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <p>You haven't submitted any applications yet.</p>
                <Link to="/jobs" className="text-indigo-600 font-semibold underline">
                  Explore open vacancies
                </Link>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{app.jobTitle}</h4>
                      <p className="text-xs text-slate-500">{app.companyName} • {app.jobLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Card & Recommended Jobs (1 col) */}
        <div className="space-y-6">
          {/* Resume Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              Resume Status
            </h3>
            {profile?.resumeUrl ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                  <p className="font-semibold truncate">✓ {profile.resumeOriginalFilename || 'Active Resume'}</p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">Ready for 1-click job applications</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    View Resume
                  </a>
                  <Link
                    to="/seeker/resume"
                    className="flex-1 text-center py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-xs font-semibold text-indigo-700"
                  >
                    Update
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800 space-y-2">
                <p className="font-semibold">No resume uploaded</p>
                <p className="text-[11px] text-amber-700">Upload your PDF resume to unlock job applications.</p>
                <Link
                  to="/seeker/resume"
                  className="inline-block px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg text-xs"
                >
                  Upload PDF Resume Now
                </Link>
              </div>
            )}
          </div>

          {/* Quick Recommended Jobs */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Recommended Roles
            </h3>
            <div className="space-y-3">
              {recommendedJobs.map((j) => (
                <Link
                  key={j.id}
                  to={`/jobs/${j.id}`}
                  className="block p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all text-xs"
                >
                  <h4 className="font-bold text-slate-800 line-clamp-1">{j.title}</h4>
                  <p className="text-slate-400 mt-0.5">{j.companyName} • {j.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

