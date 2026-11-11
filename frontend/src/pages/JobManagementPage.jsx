import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Trash2, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import { adminService } from '../api/adminService';
import { useNotifications } from '../context/NotificationContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const { showToast } = useNotifications();

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getJobs(page, 20);
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load jobs for admin moderation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, [page]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to moderate and remove this job posting? This action cannot be reversed.')) {
      return;
    }

    try {
      await adminService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      showToast('Job posting removed successfully by administrator', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete job', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Loading all platform jobs for moderation..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Job Moderation & Platform Listings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review all postings across all registered companies and remove non-compliant content
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs to display"
          description="There are currently no job postings in the database."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-4">Company & Recruiter</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Applicants</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 block text-sm"
                      >
                        {job.title}
                      </Link>
                      <span className="text-[11px] text-slate-400">ID #{job.id}</span>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-800">{job.companyName}</p>
                      <p className="text-[11px] text-slate-400">{job.recruiterName}</p>
                    </td>

                    <td className="py-4 px-4 text-slate-600">{job.location}</td>

                    <td className="py-4 px-4">
                      <StatusBadge status={job.jobType} />
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-800">
                      {job.applicantCount || 0}
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        title="Remove Inappropriate Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
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

export default JobManagementPage;

