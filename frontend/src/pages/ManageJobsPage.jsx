import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Users, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { jobService } from '../api/jobService';
import { useNotifications } from '../context/NotificationContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionJobId, setActionJobId] = useState(null);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getRecruiterJobs(0, 50);
      setJobs(res.data.content || []);
    } catch (err) {
      console.error('Failed to load recruiter jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await jobService.toggleJobStatus(job.id, nextStatus);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
      );
      showToast(`Job status changed to ${nextStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update job status', 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      showToast('Job posting deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete job', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving your job listings..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Job Postings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, edit, toggle active status, or review applicants for your vacancies
          </p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Job</span>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No job postings yet"
          description="Create your first job listing to start receiving qualified applicants."
          actionLabel="Create First Job Posting"
          onAction={() => navigate('/recruiter/post-job')}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Job Title & Location</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Applicants</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Posted Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block text-sm"
                      >
                        {job.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {job.location} • {job.vacancies} open position{job.vacancies > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={job.jobType} />
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        to={`/recruiter/applicants?jobId=${job.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount || 0} Review</span>
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <StatusBadge status={job.status} />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/recruiter/post-job?edit=${job.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Job"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;

