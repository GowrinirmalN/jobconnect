import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft 
} from 'lucide-react';
import { jobService } from '../api/jobService';
import { useNotifications } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PostJobPage = () => {
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get('edit');
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    jobType: 'FULL_TIME',
    location: '',
    experienceLevel: 'Mid Level (2-5 years)',
    salaryMin: '',
    salaryMax: '',
    isSalaryNegotiable: false,
    skillsRequired: '',
    status: 'ACTIVE',
    vacancies: 1,
    applicationDeadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editJobId) {
      const loadJob = async () => {
        setLoading(true);
        try {
          const res = await jobService.getJobById(editJobId);
          const j = res.data;
          setFormData({
            title: j.title || '',
            description: j.description || '',
            requirements: j.requirements || '',
            responsibilities: j.responsibilities || '',
            jobType: j.jobType || 'FULL_TIME',
            location: j.location || '',
            experienceLevel: j.experienceLevel || 'Mid Level',
            salaryMin: j.salaryMin || '',
            salaryMax: j.salaryMax || '',
            isSalaryNegotiable: j.isSalaryNegotiable || false,
            skillsRequired: j.skillsRequired || '',
            status: j.status || 'ACTIVE',
            vacancies: j.vacancies || 1,
            applicationDeadline: j.applicationDeadline || '',
          });
        } catch (err) {
          setError('Failed to fetch job data for editing.');
        } finally {
          setLoading(false);
        }
      };
      loadJob();
    }
  }, [editJobId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      vacancies: Number(formData.vacancies),
      applicationDeadline: formData.applicationDeadline || null,
    };

    try {
      if (editJobId) {
        await jobService.updateJob(editJobId, payload);
        showToast('Job posting updated successfully!', 'success');
      } else {
        await jobService.createJob(payload);
        showToast('New job vacancy published successfully!', 'success');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.message || 'Failed to submit job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job posting editor..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Manage Jobs
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {editJobId ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h1>
            <p className="text-xs text-slate-500">
              Define the requirements, compensation package, and ideal candidate profile
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Core Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Java Full Stack Developer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Employment Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                  <option value="Mid Level (2-5 years)">Mid Level (2-5 years)</option>
                  <option value="Senior Level (5-8 years)">Senior Level (5-8 years)</option>
                  <option value="Lead / Staff (8+ years)">Lead / Staff (8+ years)</option>
                </select>
              </div>
            </div>

            {/* Compensation & Openings */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Min Salary ($ USD)</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="100000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Salary ($ USD)</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="140000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Open Vacancies</label>
                <input
                  type="number"
                  min="1"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isSalaryNegotiable"
                name="isSalaryNegotiable"
                checked={formData.isSalaryNegotiable}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="isSalaryNegotiable" className="text-xs text-slate-700 font-medium cursor-pointer">
                Compensation is negotiable based on candidate experience
              </label>
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="Java, Spring Boot, React, MySQL, Docker, REST APIs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Job Description & Overview <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="5"
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the role, team context, and product impact..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Key Responsibilities
            </label>
            <textarea
              rows="4"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="• Architect and deploy Spring Boot microservices&#10;• Collaborate with frontend developers and product managers&#10;• Participate in code reviews and CI/CD releases"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Qualifications & Requirements
            </label>
            <textarea
              rows="4"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="• 3+ years experience with Java enterprise frameworks&#10;• Proficiency in SQL query design and Hibernate/JPA&#10;• Experience with modern containerization (Docker, Kubernetes)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/recruiter/jobs"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : editJobId ? 'Save Changes' : 'Publish Job Posting'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;

