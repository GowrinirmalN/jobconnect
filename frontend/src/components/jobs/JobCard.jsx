import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Building2, Users } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const JobCard = ({ job, onApply }) => {
  const formattedSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${Number(job.salaryMin).toLocaleString()} - $${Number(job.salaryMax).toLocaleString()}`;
    }
    if (job.salaryMin) {
      return `From $${Number(job.salaryMin).toLocaleString()}`;
    }
    return job.isSalaryNegotiable ? 'Negotiable' : 'Competitive';
  };

  const skillsList = job.skillsRequired
    ? job.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header with Company Logo and Badges */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-indigo-50 border border-slate-200/60 flex items-center justify-center text-indigo-600 font-bold text-lg overflow-hidden shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-indigo-500" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 block">
                {job.companyName || 'Verified Employer'}
              </span>
              <Link
                to={`/jobs/${job.id}`}
                className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
            </div>
          </div>
          <StatusBadge status={job.jobType} />
        </div>

        {/* Location & Meta info */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-slate-500 my-3">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{formattedSalary()}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.applicantCount || 0} applicant{job.applicantCount === 1 ? '' : 's'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.experienceLevel || 'Mid Level'}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {skillsList.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
            >
              {skill}
            </span>
          ))}
          {skillsList.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-medium">
              +{skillsList.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          to={`/jobs/${job.id}`}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          View Details →
        </Link>

        {job.hasApplied ? (
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            ✓ Applied
          </span>
        ) : (
          <button
            onClick={() => onApply && onApply(job)}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-all"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;

