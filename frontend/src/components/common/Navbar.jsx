import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Briefcase, 
  Bell, 
  User, 
  LogOut, 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShieldCheck, 
  Menu, 
  X,
  FileCheck2
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isRecruiter, isJobSeeker, logout } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Primary Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Job<span className="text-indigo-600">Connect</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 -mt-1">
                  Recruitment Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link
                to="/jobs"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/jobs')
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Find Jobs
              </Link>

              {/* Seeker Links */}
              {isJobSeeker && (
                <>
                  <Link
                    to="/seeker/dashboard"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/seeker/dashboard')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/seeker/applications"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/seeker/applications')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/seeker/resume"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/seeker/resume')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    My Resume
                  </Link>
                </>
              )}

              {/* Recruiter Links */}
              {isRecruiter && (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/recruiter/dashboard')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/recruiter/jobs"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/recruiter/jobs')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    Manage Jobs
                  </Link>
                  <Link
                    to="/recruiter/applicants"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/recruiter/applicants')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    Applicants
                  </Link>
                </>
              )}

              {/* Admin Links */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/admin/dashboard')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/admin/users')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/jobs"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/admin/jobs')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    Jobs Moderation
                  </Link>
                  <Link
                    to="/admin/applications"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive('/admin/applications')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    All Applications
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Action Icons & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isRecruiter && (
              <Link
                to="/recruiter/post-job"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Post a Job
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 py-3 z-50">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <span className="text-sm font-semibold text-slate-800">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-600">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                                !n.isRead ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-semibold text-slate-800">{n.title}</h4>
                                {!n.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-600 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 hover:border-slate-300 transition-all bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                      {user.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{user.firstName} {user.lastName}</p>
                      <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider block">
                        {user.role?.replace('ROLE_', '')}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-600 truncate">{user.email}</p>
                      </div>

                      {isJobSeeker && (
                        <Link
                          to="/seeker/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-600" />
                          My Profile
                        </Link>
                      )}

                      {isRecruiter && (
                        <Link
                          to="/recruiter/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-slate-600" />
                          Company Profile
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Find Jobs
          </Link>

          {isJobSeeker && (
            <>
              <Link
                to="/seeker/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/seeker/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Applications
              </Link>
              <Link
                to="/seeker/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Profile
              </Link>
            </>
          )}

          {isRecruiter && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/recruiter/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 bg-indigo-50 font-semibold"
              >
                Post a Job
              </Link>
              <Link
                to="/recruiter/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Manage Jobs
              </Link>
              <Link
                to="/recruiter/applicants"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Applicants
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                User Management
              </Link>
              <Link
                to="/admin/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Job Moderation
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-slate-600">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 font-medium text-sm rounded-lg hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-300 font-medium text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

