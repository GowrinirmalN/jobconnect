import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const getStyle = () => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'UNDER_REVIEW':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SHORTLISTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'FULL_TIME':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'PART_TIME':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'CONTRACT':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'INTERNSHIP':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'REMOTE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'FULL_TIME': return 'Full Time';
      case 'PART_TIME': return 'Part Time';
      case 'UNDER_REVIEW': return 'Under Review';
      case 'INTERVIEW_SCHEDULED': return 'Interview';
      default:
        return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}
    >
      {getLabel()}
    </span>
  );
};

export default StatusBadge;

