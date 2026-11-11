import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Briefcase, 
  Users, 
  Clock, 
  Globe, 
  ArrowLeft,
  Share2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { jobService } from '../api/jobService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import StatusBadge from '../components/common/StatusBadge';
import ApplyModal from '../components/jobs/ApplyModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { isAuthenticated, isJobSeeker } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobById(id);
      setJob(res.data);
    } catch (err) {
      console.error('Failed to fetch job details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Job posting link copied to clipboard!', 'info');
  };

  if (loading) return <LoadingSpinner message="Loading job specifications..." />;
  if (!job) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-xs text-slate-500">The requested job listing may have been removed or closed.</p>
        <Link to="/jobs" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Return to All Jobs
        </Link>
      </div>
    );
  }

  const formattedSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${Number(job.salaryMin).toLocaleString()} - $${Number(job.salaryMax).toLocaleString()} USD`;
    }
    if (job.salaryMin) {
      return `From $${Number(job.salaryMin).toLocaleString()} USD`;
    }
    return job.isSalaryNegotiable ? 'Negotiable Compensation' : 'Competitive Enterprise Salary';
  };

  const skillsList = job.skillsRequired
    ? job.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Listings
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-2xl overflow-hidden shrink-0 shadow-sm">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-indigo-600" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {job.companyName}
                </span>
                <StatusBadge status={job.jobType} />
                <StatusBadge status={job.status} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  <strong className="text-slate-800">{formattedSalary()}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {job.applicantCount || 0} Applicants
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleCopyLink}
              className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {job.hasApplied ? (
              <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 transition-all text-center"
              >
                Apply for this Position
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Description + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Role Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Key Responsibilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Candidate Qualifications & Requirements
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Skills Required */}
          {skillsList.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Required Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100/60 text-indigo-700 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Job Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Job Snapshot
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Experience:</span>
                <span className="font-semibold text-slate-800">{job.experienceLevel || 'Mid-Senior'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Vacancies:</span>
                <span className="font-semibold text-slate-800">{job.vacancies} open</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Arrangement:</span>
                <span className="font-semibold text-slate-800">{job.jobType?.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Application Deadline:</span>
                <span className="font-semibold text-slate-800">
                  {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Rolling'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Date Posted:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              About the Company
            </h3>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{job.companyName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Recruiter: {job.recruiterName}</p>
            </div>
            {job.companyWebsite && (
              <a
                href={job.companyWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                Visit Official Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplyModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            setJob((prev) => ({ ...prev, hasApplied: true, applicantCount: (prev.applicantCount || 0) + 1 }));
          }}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;

