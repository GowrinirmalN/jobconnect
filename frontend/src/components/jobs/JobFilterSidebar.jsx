import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const JobFilterSidebar = ({ filters, onChange, onReset }) => {
  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'REMOTE', label: 'Remote' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          Filter Jobs
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Job Title or Keyword
        </label>
        <input
          type="text"
          value={filters.keyword || ''}
          onChange={(e) => onChange('keyword', e.target.value)}
          placeholder="e.g. Java, React, DevOps"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Location
        </label>
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="e.g. San Francisco, Remote, London"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      {/* Employment Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Employment Type
        </label>
        <div className="space-y-1.5">
          {jobTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
            >
              <input
                type="radio"
                name="jobType"
                value={type.value}
                checked={filters.jobType === type.value}
                onChange={(e) => onChange('jobType', e.target.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Minimum Annual Salary (USD)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Min ($)</span>
            <input
              type="number"
              value={filters.minSalary || ''}
              onChange={(e) => onChange('minSalary', e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Max ($)</span>
            <input
              type="number"
              value={filters.maxSalary || ''}
              onChange={(e) => onChange('maxSalary', e.target.value)}
              placeholder="e.g. 150000"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilterSidebar;

