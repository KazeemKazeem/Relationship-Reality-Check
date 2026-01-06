
import React from 'react';
import { ShieldCheck, Heart, Users, LogOut, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userEmail?: string | null;
  onLogout?: () => void;
  onBack?: () => void;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userEmail, onLogout, onBack, title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-1"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
            )}
            <Link to={userEmail ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ShieldCheck className="w-7 h-7 text-teal-600" />
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 hidden sm:block">
                {title || "Relationship Reality Check"}
              </h1>
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 sm:hidden">
                {title || "Reality Check"}
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {userEmail ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link 
                  to="/dashboard" 
                  className="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition-colors flex items-center gap-2"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-semibold">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                <span className="hidden lg:inline text-sm text-slate-500 font-medium">{userEmail}</span>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-sm font-semibold text-teal-600 hover:text-teal-700 px-3 py-2">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        <div className="flex justify-center items-center gap-4 mb-2">
          <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Romantic</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Friendly</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Safe</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Relationship Reality Check. For reflective purposes only.</p>
      </footer>
    </div>
  );
};

export default Layout;
