import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  Calendar, 
  User, 
  Search, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { adminService } from '../api/adminService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const ApplicationManagementPage = () => {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await adminService.getApplications(page, 20);
        setApplications(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } catch (err) {
        console.error('Failed to load applications for audit', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [page]);

  if (loading) return <LoadingSpinner message="Loading all platform applications..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Audit Log
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          System-wide log of all candidate submissions across every employer and job vacancy
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications recorded"
          description="There are currently no candidate applications in the system."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-4">Applied Job Title</th>
                  <th className="py-4 px-4">Hiring Company</th>
                  <th className="py-4 px-4">Application Status</th>
                  <th className="py-4 px-6 text-right">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 text-sm">{app.applicantName}</p>
                      <p className="text-[11px] text-slate-400">{app.applicantEmail}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {app.jobTitle}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {app.companyName}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-6 text-right text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
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

export default ApplicationManagementPage;

