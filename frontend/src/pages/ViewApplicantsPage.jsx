import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Download, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Filter, 
  Mail, 
  Phone,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { applicationService } from '../api/applicationService';
import { jobService } from '../api/jobService';
import { useNotifications } from '../context/NotificationContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const ViewApplicantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Update Modal State
  const [activeAppForUpdate, setActiveAppForUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Cover Letter View Modal
  const [viewingCoverLetterApp, setViewingCoverLetterApp] = useState(null);

  const { showToast } = useNotifications();

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const res = await jobService.getRecruiterJobs(0, 100);
        setJobs(res.data.content || []);
      } catch (err) {
        console.error('Failed to load jobs filter', err);
      }
    };
    fetchRecruiterJobs();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const jobIdParam = selectedJobId ? Number(selectedJobId) : null;
      const statusParam = selectedStatus || null;
      const res = await applicationService.getRecruiterApplications(jobIdParam, statusParam, 0, 100);
      setApplications(res.data.content || []);
    } catch (err) {
      console.error('Failed to load applicants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId, selectedStatus]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeAppForUpdate) return;

    setUpdating(true);
    try {
      const res = await applicationService.updateApplicationStatus(
        activeAppForUpdate.id,
        newStatus,
        notes
      );

      setApplications((prev) =>
        prev.map((a) => (a.id === activeAppForUpdate.id ? res.data : a))
      );

      showToast(`Status updated to ${newStatus}. Candidate notified via email.`, 'success');
      setActiveAppForUpdate(null);
      setNotes('');
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Applicant Tracking & Review
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Evaluate candidates, inspect PDF resumes, and advance candidates through recruitment stages
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Job Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setSearchParams(e.target.value ? { jobId: e.target.value } : {});
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Job Postings</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Stage:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="ACCEPTED">Offer Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-medium text-slate-500">
          Total Candidates: <strong className="text-slate-800">{applications.length}</strong>
        </span>
      </div>

      {/* Applicant Cards / Table */}
      {loading ? (
        <LoadingSpinner message="Loading candidate records..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description="There are currently no candidates matching the selected job posting or review stage."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-indigo-200 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.applicantName}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">
                    Position: <span className="font-bold text-slate-800">{app.jobTitle}</span>
                  </p>
                </div>

                <div className="text-xs text-slate-400">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${app.applicantEmail}`} className="hover:text-indigo-600 truncate">
                    {app.applicantEmail}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{app.applicantPhone || 'Phone not provided'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Experience: {app.experienceYears || 0} years</span>
                </div>
              </div>

              {/* Headline & Skills */}
              {app.applicantHeadline && (
                <p className="text-xs font-medium text-slate-700 italic">
                  "{app.applicantHeadline}"
                </p>
              )}

              {app.applicantSkills && (
                <div className="flex flex-wrap gap-1.5">
                  {app.applicantSkills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Recruiter Notes if any */}
              {app.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Recruiter Notes:</span>
                  <p>{app.notes}</p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {app.resumeUrl ? (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume (PDF)</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No resume attached</span>
                  )}

                  {app.coverLetter && (
                    <button
                      onClick={() => setViewingCoverLetterApp(app)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Cover Letter</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveAppForUpdate(app);
                      setNewStatus(app.status);
                      setNotes(app.notes || '');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    Update Stage & Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stage Update Modal */}
      {activeAppForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">Candidate Evaluation</span>
                <h3 className="text-base font-bold mt-0.5">{activeAppForUpdate.applicantName}</h3>
                <p className="text-xs text-slate-300">{activeAppForUpdate.jobTitle}</p>
              </div>
              <button
                onClick={() => setActiveAppForUpdate(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Recruitment Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted for Screening</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="ACCEPTED">Offer Accepted / Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feedback / Interview Schedule Notes</label>
                <textarea
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Technical interview scheduled for next Tuesday at 2 PM PST via Google Meet..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Candidate will automatically receive an email and in-app notification with this update.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveAppForUpdate(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save & Notify Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cover Letter Modal */}
      {viewingCoverLetterApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">Candidate Cover Letter</span>
                <h3 className="text-base font-bold mt-0.5">{viewingCoverLetterApp.applicantName}</h3>
              </div>
              <button
                onClick={() => setViewingCoverLetterApp(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50">
              {viewingCoverLetterApp.coverLetter}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingCoverLetterApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-semibold text-xs text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplicantsPage;

