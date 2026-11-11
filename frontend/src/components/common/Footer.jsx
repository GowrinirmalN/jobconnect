import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Heart, Layers, ShieldCheck, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Job<span className="text-indigo-400">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern recruitment management ecosystem connecting top engineering talent with innovative companies.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <Layers className="w-4 h-4" />
              <span>Java 21 • Spring Boot 3 • React • MySQL</span>
            </div>
          </div>

          {/* Candidates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">For Candidates</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Browse Job Vacancies</Link>
              </li>
              <li>
                <Link to="/seeker/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link>
              </li>
              <li>
                <Link to="/seeker/resume" className="hover:text-white transition-colors">Upload Resume (PDF)</Link>
              </li>
              <li>
                <Link to="/seeker/applications" className="hover:text-white transition-colors">Track Applications</Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">For Recruiters</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/recruiter/post-job" className="hover:text-white transition-colors">Post Vacancies</Link>
              </li>
              <li>
                <Link to="/recruiter/applicants" className="hover:text-white transition-colors">Review Applicants</Link>
              </li>
              <li>
                <Link to="/recruiter/jobs" className="hover:text-white transition-colors">Manage Postings</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Recruiter Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Platform Info & Developer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Developer & Platform</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>JWT Bearer Security & Role Authorization</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>RESTful Architecture & OpenAPI Docs</span>
              </p>
              <div className="pt-2">
                <a
                  href="http://localhost:8080/swagger-ui.html"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-indigo-400 hover:bg-slate-700 text-xs font-medium"
                >
                  Explore Swagger API Specs ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} JobConnect Recruitment Portal. Engineered for portfolio & enterprise demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Full Stack Engineer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

