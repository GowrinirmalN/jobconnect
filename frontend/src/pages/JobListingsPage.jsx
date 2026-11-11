import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { jobService } from '../api/jobService';
import JobCard from '../components/jobs/JobCard';
import JobFilterSidebar from '../components/jobs/JobFilterSidebar';
import ApplyModal from '../components/jobs/ApplyModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const JobListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    minSalary: searchParams.get('minSalary') || '',
    maxSalary: searchParams.get('maxSalary') || '',
    page: parseInt(searchParams.get('page') || '0', 10),
    size: 9,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: filters.keyword || undefined,
        location: filters.location || undefined,
        jobType: filters.jobType || undefined,
        minSalary: filters.minSalary || undefined,
        maxSalary: filters.maxSalary || undefined,
        page: filters.page,
        size: filters.size,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      };

      const res = await jobService.searchJobs(params);
      const data = res.data;
      setJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0, // Reset to page 0 on filter change
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      jobType: '',
      minSalary: '',
      maxSalary: '',
      page: 0,
      size: 9,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Search Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Explore Open Engineering Positions
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl">
          Browse verified technical vacancies, filter by compensation, work arrangement, and tech stack.
        </p>

        {/* Search Inputs */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              placeholder="Search by title, skill, or company..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Location or 'Remote'..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={fetchJobs}
              className="w-full h-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1">
          <JobFilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">{totalElements} jobs found</span>
        </div>

        {mobileFilterOpen && (
          <div className="lg:hidden mb-4">
            <JobFilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Jobs Listing Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <p className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-800">{jobs.length}</span> of{' '}
              <span className="font-bold text-slate-800">{totalElements}</span> vacancies
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={`${filters.sortBy}-${filters.sortDir}`}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split('-');
                  setFilters((prev) => ({ ...prev, sortBy, sortDir, page: 0 }));
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none text-xs"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="salaryMax-desc">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <LoadingSpinner message="Searching vacancies..." />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No matching jobs found"
              description="Try adjusting your keywords, widening the salary range, or clearing location filters."
              actionLabel="Clear All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              <button
                disabled={filters.page === 0}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>

              <span className="text-xs text-slate-600 px-3">
                Page {filters.page + 1} of {totalPages}
              </span>

              <button
                disabled={filters.page >= totalPages - 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            setJobs((prev) =>
              prev.map((j) => (j.id === selectedJobForApply.id ? { ...j, hasApplied: true } : j))
            );
          }}
        />
      )}
    </div>
  );
};

export default JobListingsPage;
