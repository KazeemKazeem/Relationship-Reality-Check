
import React, { useEffect, useState } from 'react';
import { EvaluationResult } from '../types.ts';
import { SCORE_LABELS } from '../constants.ts';
import { RefreshCw, Info, Sparkles, LayoutDashboard, UserPlus } from 'lucide-react';
import { generateNeutralAdvice } from '../services/geminiService.ts';
import { Link } from 'react-router-dom';

interface ResultsViewProps {
  result: EvaluationResult;
  isSaved: boolean;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, isSaved }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showBars, setShowBars] = useState(false);

  useEffect(() => {
    const loadAdvice = async () => {
      setLoadingAdvice(true);
      const text = await generateNeutralAdvice(result);
      setAdvice(text);
      setLoadingAdvice(false);
    };
    loadAdvice();
    
    // Trigger progress bar animation after component mount
    const timer = setTimeout(() => setShowBars(true), 100);
    return () => clearTimeout(timer);
  }, [result]);

  const activeLabel = SCORE_LABELS.find(
    l => result.totalScore >= l.range[0] && result.totalScore <= l.range[1]
  ) || SCORE_LABELS[SCORE_LABELS.length - 1];

  // Circle calculations
  const size = 192;
  const center = size / 2;
  const strokeWidth = 14;
  const radius = (size - strokeWidth - 10) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8 animate-in fade-in duration-700">
      {/* Hero Score Section */}
      <div className="text-center space-y-8">
        <div className="relative inline-block p-2">
          <svg 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 overflow-visible"
          >
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-slate-100"
            />
            {/* Progress Bar */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={showBars ? circumference * (1 - result.totalScore / 100) : circumference}
              className={`${activeLabel.color} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-slate-800 tracking-tight">{result.totalScore}%</span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">Overall Score</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className={`text-3xl font-bold ${activeLabel.color}`}>
            {activeLabel.label}
          </h2>
          <p className="text-slate-500">Reflecting on your connection with <span className="font-semibold text-slate-700">{result.relationshipLabel}</span></p>
        </div>
      </div>

      {/* Persistence Notice */}
      <div className="flex justify-center">
        {!isSaved ? (
          <div className="px-5 py-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-sm flex flex-col items-center gap-3 max-w-sm text-center">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" /> 
              <span className="font-semibold text-amber-800 underline decoration-amber-200">Guest Mode Active</span>
            </div>
            <p className="text-xs">Results won't be saved after you leave this page.</p>
            <Link to="/auth" className="flex items-center gap-2 bg-amber-600 text-white px-4 py-1.5 rounded-full font-bold hover:bg-amber-700 transition-colors">
              <UserPlus className="w-3.5 h-3.5" />
              Save History
            </Link>
          </div>
        ) : (
          <div className="px-4 py-2 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-sm flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Result successfully saved to your dashboard.
          </div>
        )}
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.categoryBreakdown.map((cat, idx) => (
          <div 
            key={idx} 
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">{cat.name}</h3>
              <span className="text-lg font-bold text-slate-800">{cat.score}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-1000 ease-out" 
                style={{ 
                  width: showBars ? `${cat.score}%` : '0%',
                  transitionDelay: `${idx * 150}ms`
                }}
              />
            </div>
            <p className="text-xs text-slate-400 font-medium">Metric Weight: {Math.round(cat.weight * 100)}%</p>
          </div>
        ))}
      </div>

      {/* Neutral Advice Section (Gemini Powered) */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-teal-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">Reflective Insight</h3>
        </div>
        
        {loadingAdvice ? (
          <div className="flex flex-col gap-4">
            <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse delay-75"></div>
            <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse delay-150"></div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {advice}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-slate-600 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Start New Evaluation
        </button>
        {isSaved && (
          <Link 
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-50"
          >
            <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
