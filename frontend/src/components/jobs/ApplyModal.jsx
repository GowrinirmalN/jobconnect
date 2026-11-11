import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { applicationService } from '../../api/applicationService';
import { jobSeekerService } from '../../api/jobSeekerService';
import { useNavigate } from 'react-router-dom';

const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated, isJobSeeker } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isJobSeeker) {
      setError('Only candidates with a Job Seeker account can apply.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let customResumeUrl = null;

      // If candidate attached a fresh resume file in this modal
      if (selectedFile) {
        setUploadingResume(true);
        const uploadRes = await jobSeekerService.uploadResume(selectedFile);
        customResumeUrl = uploadRes.data?.resumeUrl;
        setUploadingResume(false);
      }

      await applicationService.applyForJob(job.id, coverLetter, customResumeUrl);
      showToast('Application submitted successfully! Recruiter has been notified.', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
      setUploadingResume(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
              Application Submission
            </span>
            <h3 className="text-lg font-bold truncate max-w-sm mt-0.5">{job.title}</h3>
            <p className="text-xs text-slate-300">{job.companyName} • {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isAuthenticated && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs text-center space-y-2">
              <p className="font-semibold">Sign in required to apply</p>
              <p className="text-slate-600">Please sign in or create a job seeker account to submit your application.</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
              >
                Sign In Now
              </button>
            </div>
          )}

          {isAuthenticated && (
            <>
              {/* Applicant Info Summary */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <p>
                  <span className="font-semibold text-slate-800">Applying as:</span> {user.firstName} {user.lastName} ({user.email})
                </p>
              </div>

              {/* Resume Upload / Override */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Resume (PDF / DOC)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium text-xs">
                      <FileText className="w-5 h-5" />
                      <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-medium text-slate-700">
                        Upload custom resume or use saved profile resume
                      </p>
                      <p className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Cover Letter / Note to Recruiter
                </label>
                <textarea
                  rows="4"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, highlight relevant achievements, and explain why you're a strong fit for this role..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed"
                />
              </div>
            </>
          )}

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            {isAuthenticated && (
              <button
                type="submit"
                disabled={submitting || uploadingResume}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Confirm & Apply'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;

