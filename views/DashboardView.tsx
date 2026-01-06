
import React from 'react';
import { EvaluationResult } from '../types.ts';
import { Trash2, Plus, Calendar, Heart, Users, Home, Loader2, Clock } from 'lucide-react';

interface DashboardViewProps {
  history: EvaluationResult[];
  onDelete: (id: string) => void;
  onStart: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ history, onDelete, onStart }) => {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'romantic': return Heart;
      case 'friend': return Users;
      case 'family': return Home;
      default: return Plus;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-teal-600 bg-teal-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const formatDuration = (months?: number) => {
    if (!months) return '';
    if (months < 12) return `${months}mo`;
    return `${Math.floor(months / 12)}y`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Your History</h2>
          <p className="text-slate-500">Track and reflect on your relationship trends.</p>
        </div>
        <button 
          onClick={onStart}
          className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
        >
          <Plus className="w-5 h-5" /> New Check
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-6">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">No evaluations yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto">Start your first evaluation to see your relationship insights here.</p>
          </div>
          <button 
            onClick={onStart}
            className="text-teal-600 font-bold hover:underline"
          >
            Start first evaluation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => {
            const Icon = getCategoryIcon(item.relationshipCategory);
            const scoreStyle = getScoreColor(item.totalScore);
            const isDeleting = deletingId === item.id;

            return (
              <div 
                key={item.id}
                className={`group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center ${isDeleting ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scoreStyle}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800">{item.relationshipLabel}</h4>
                      {item.metadata?.durationMonths && (
                        <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDuration(item.metadata.durationMonths)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-teal-600">{item.metadata?.subtype || item.relationshipCategory}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${scoreStyle.split(' ')[0]}`}>{item.totalScore}%</span>
                  </div>
                  <button 
                    disabled={isDeleting}
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Record"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardView;
