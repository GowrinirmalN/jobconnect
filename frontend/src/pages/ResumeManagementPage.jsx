import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { jobSeekerService } from '../api/jobSeekerService';
import { useNotifications } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ResumeManagementPage = () => {
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showToast } = useNotifications();

  const loadData = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        jobSeekerService.getProfile(),
        jobSeekerService.getResumes(),
      ]);
      setProfile(pRes.data);
      setResumes(rRes.data || []);
    } catch (err) {
      setError('Failed to load resume documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must not exceed 10MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const res = await jobSeekerService.uploadResume(selectedFile);
      setProfile(res.data);
      setSelectedFile(null);
      showToast('Resume uploaded and set as active profile resume!', 'success');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your resume documents..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Resume Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload and manage your CVs for rapid one-click application submissions
        </p>
      </div>

      {/* Active Resume Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Current Active Resume
        </h2>

        {profile?.resumeUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {profile.resumeOriginalFilename || 'Main_Resume.pdf'}
                </h4>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  ✓ Linked to candidate profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View / Download PDF</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
            <p className="text-xs font-semibold text-slate-700">No active resume on file</p>
            <p className="text-[11px] text-slate-400">Upload a PDF below so recruiters can evaluate your background.</p>
          </div>
        )}
      </div>

      {/* Upload New Resume */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <UploadCloud className="w-5 h-5 text-indigo-600" />
          Upload New Document
        </h2>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-8 text-center cursor-pointer transition-colors relative bg-slate-50/50">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 text-indigo-600">
                <FileText className="w-8 h-8" />
                <span className="text-sm font-bold text-slate-800">{selectedFile.name}</span>
                <span className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(0)} KB • Ready to submit</span>
              </div>
            ) : (
              <div className="space-y-2">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">
                  Click to select or drag and drop your resume
                </p>
                <p className="text-xs text-slate-400">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-40 transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload & Set as Active'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded History Table */}
      {resumes.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Upload History
          </h2>

          <div className="divide-y divide-slate-100">
            {resumes.map((r) => (
              <div key={r.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="font-semibold text-slate-800">{r.originalName}</span>
                    <span className="text-slate-400 ml-2">
                      ({r.fileSize ? (r.fileSize / 1024).toFixed(0) : 0} KB)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(r.uploadedAt).toLocaleDateString()}
                  </span>
                  <a
                    href={r.fileDownloadUri}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManagementPage;

