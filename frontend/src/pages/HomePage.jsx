import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Building2, 
  Sparkles,
  CheckCircle,
  FileCheck,
  Send
} from 'lucide-react';
import { jobService } from '../api/jobService';
import JobCard from '../components/jobs/JobCard';
import ApplyModal from '../components/jobs/ApplyModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getFeaturedJobs();
        setFeaturedJobs(res.data || []);
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { title: 'Software Engineering', count: '1,240+ jobs', icon: Briefcase },
    { title: 'Cloud & DevOps', count: '850+ jobs', icon: TrendingUp },
    { title: 'UI/UX & Product Design', count: '620+ jobs', icon: Sparkles },
    { title: 'Data Science & AI', count: '480+ jobs', icon: Users },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900/10 via-slate-50 to-white pt-16 pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Over 10,000+ Verified Tech Careers Worldwide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Discover Your Next Engineering Breakthrough with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-primary-500 bg-clip-text text-transparent">
              JobConnect
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connecting ambitious software engineers, DevOps specialists, and recruiters in one enterprise-grade platform.
          </p>

          {/* Hero Live Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 max-w-4xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-100/60 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2.5 w-full sm:w-1/2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keywords, or skills..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-5/12 px-3 py-2">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state, or 'Remote'..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Quick Category Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Popular:</span>
            {['Java', 'Spring Boot', 'React', 'Remote', 'Kubernetes', 'Full Stack'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setKeyword(tag);
                  navigate(`/jobs?keyword=${tag}`);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-200/80">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">12,500+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Active Job Postings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">3,400+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Verified Recruiters</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">45,000+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Talented Candidates</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">98%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Recruitment Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explore by Discipline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Targeted roles aligned with current enterprise technology stacks
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(cat.title)}`)}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 transition-all cursor-pointer flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Recent Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top hand-picked vacancies from leading software organizations
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading latest job opportunities..." />
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-sm text-slate-500">No active job listings found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>
        )}
      </section>

      {/* How it Works / Recruitment Flow */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How JobConnect Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Streamlined recruitment pipeline for candidates and hiring managers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white">Create Profile & Resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Register as a Job Seeker, complete your skills portfolio, and upload your PDF resume for instant review.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">Apply with One Click</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter jobs by salary, location, and tech stack. Submit tailored cover letters and track live status.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Get Hired Fast</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive real-time email & in-app updates as recruiters shortlist and schedule your interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-primary-700 p-8 sm:p-12 text-white shadow-xl shadow-indigo-200">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              For Talent Acquisition Teams
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Hiring top engineers? Post vacancies in minutes.
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Target active job seekers, evaluate verified candidate profiles, download resumes, and manage applicant status from a unified recruiter dashboard.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold text-xs sm:text-sm hover:bg-indigo-50 transition-all shadow-sm"
              >
                Register as Recruiter
              </Link>
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl bg-indigo-800/60 hover:bg-indigo-800 text-white font-medium text-xs sm:text-sm border border-indigo-400/30 transition-all"
              >
                Sign In to Post Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            // refresh
            setFeaturedJobs((prev) =>
              prev.map((j) => (j.id === selectedJobForApply.id ? { ...j, hasApplied: true } : j))
            );
          }}
        />
      )}
    </div>
  );
};

export default HomePage;

