import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ChevronRight, 
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { applicationService } from '../api/applicationService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationService.getMyApplications(0, 50);
        setApplications(res.data.content || []);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return app.status === 'APPLIED' || app.status === 'UNDER_REVIEW';
    if (activeTab === 'SHORTLISTED') return app.status === 'SHORTLISTED' || app.status === 'INTERVIEW_SCHEDULED';
    if (activeTab === 'DECIDED') return app.status === 'ACCEPTED' || app.status === 'REJECTED';
    return true;
  });

  if (loading) return <LoadingSpinner message="Retrieving your application history..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Job Applications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track status updates, interview schedules, and recruiter communications
          </p>
        </div>
        <Link
          to="/jobs"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          Find More Jobs
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {[
          { key: 'ALL', label: `All (${applications.length})` },
          { key: 'ACTIVE', label: 'In Progress' },
          { key: 'SHORTLISTED', label: 'Shortlisted & Interviews' },
          { key: 'DECIDED', label: 'Offers / Closed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          title="No applications in this category"
          description="You haven't submitted any applications under this filter status yet."
          actionLabel="Browse Available Jobs"
          onAction={() => window.location.assign('/jobs')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-slate-100 text-indigo-600 flex items-center justify-center font-bold overflow-hidden shrink-0">
                  {app.companyLogo ? (
                    <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600">{app.companyName}</span>
                    <StatusBadge status={app.status} />
                    <StatusBadge status={app.jobType} />
                  </div>
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors block"
                  >
                    {app.jobTitle}
                  </Link>
                  <p className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {app.jobLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Status / Recruiter Feedback Note */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {app.notes && (
                  <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 max-w-xs">
                    <p className="font-semibold text-slate-800 flex items-center gap-1 mb-0.5">
                      <MessageSquare className="w-3 h-3 text-indigo-600" />
                      Recruiter Feedback:
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{app.notes}</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold transition-colors shrink-0"
                >
                  View Submission
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">Application Detail</span>
                <h3 className="text-lg font-bold truncate mt-0.5">{selectedApp.jobTitle}</h3>
                <p className="text-xs text-slate-300">{selectedApp.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-500">Current Status:</span>
                <StatusBadge status={selectedApp.status} />
              </div>

              {selectedApp.notes && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                  <span className="font-bold text-indigo-900">Notes from Recruiter:</span>
                  <p className="text-slate-700">{selectedApp.notes}</p>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-800 block mb-1">Cover Letter:</span>
                <p className="p-3 bg-slate-50 rounded-xl whitespace-pre-line text-slate-600 leading-relaxed border border-slate-100">
                  {selectedApp.coverLetter || 'No cover letter was attached.'}
                </p>
              </div>

              {selectedApp.resumeUrl && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Attached Resume:</span>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-100"
                  >
                    <FileText className="w-4 h-4" />
                    Download / Preview Attached Resume PDF ↗
                  </a>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium text-xs text-slate-800"
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

export default MyApplicationsPage;

