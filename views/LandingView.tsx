
import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Users, LayoutDashboard, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { Link } from 'react-router-dom';

interface LandingViewProps {
  onStart: () => void;
  onGuest: () => void;
  onAuth: () => void;
  user: UserProfile | null;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart, onGuest, onAuth, user }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 py-8 animate-in fade-in duration-1000">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3" />
          Powered by Reflective Logic
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          How healthy is your <br className="hidden sm:block" />
          <span className="text-teal-600">Connection?</span>
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
          Gain clarity and perspective with our evidence-based relationship evaluator. 
          A neutral tool designed to help you reflect on your romantic, friendship, and family bonds.
        </p>
        
        <div className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-500 text-sm italic shadow-sm max-w-md mx-auto">
          "The first step toward building a better relationship is understanding its current foundation."
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        {user ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <button 
              onClick={onStart}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 hover:scale-[1.02] transition-all shadow-lg shadow-teal-100 group"
            >
              New Check
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              to="/dashboard"
              className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:scale-[1.02] transition-all shadow-sm"
            >
              <LayoutDashboard className="w-5 h-5 text-teal-600" />
              My History
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button 
              onClick={onAuth}
              className="flex-1 bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 hover:scale-[1.02] transition-all shadow-lg shadow-teal-100"
            >
              Sign Up / Login
            </button>
            <button 
              onClick={onGuest}
              className="flex-1 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:scale-[1.02] transition-all"
            >
              Guest Mode
            </button>
          </div>
        )}
        {!user && (
          <p className="text-xs text-slate-400">Guest mode results aren't saved. Create an account to track trends.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-3 text-left">
          <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800">Balanced Metrics</h3>
          <p className="text-sm text-slate-500">Deep evaluation across communication, trust, emotional safety, and mutual effort.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-3 text-left">
          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800">Specialized Categories</h3>
          <p className="text-sm text-slate-500">Tailored questioning logic for romantic partners, close friends, and family dynamics.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-3 text-left">
          <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800">Privacy First</h3>
          <p className="text-sm text-slate-500">Your data is neutral, securely stored, and entirely under your own control.</p>
        </div>
      </div>

      <div className="max-w-xl text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-8 mt-12">
        <p>
          <strong>Neutral Disclaimer:</strong> Relationship Reality Check is a reflective tool intended for personal insight and does not constitute psychological advice, diagnosis, or therapy. The scoring system is a heuristic based on user input and not a scientific diagnostic. If you are experiencing distress, please consult a licensed mental health professional.
        </p>
      </div>
    </div>
  );
};

export default LandingView;
