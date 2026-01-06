
import React, { useState } from 'react';
import { RelationshipCategory, RelationshipMetadata } from '../types.ts';
import { Heart, Users, Home, ChevronRight, Info } from 'lucide-react';

interface SetupViewProps {
  onComplete: (data: { label: string, category: RelationshipCategory, metadata: RelationshipMetadata }) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ onComplete }) => {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<RelationshipCategory | null>(null);
  const [subtype, setSubtype] = useState('');
  const [duration, setDuration] = useState<number>(12);
  const [closeness, setCloseness] = useState<number>(7);
  const [livingSituation, setLivingSituation] = useState('Living Apart');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label && category && subtype) {
      onComplete({ 
        label, 
        category, 
        metadata: {
          subtype,
          durationMonths: duration,
          closenessLevel: closeness,
          livingSituation
        } 
      });
    }
  };

  const categories = [
    { id: RelationshipCategory.ROMANTIC, icon: Heart, color: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Romantic Partner' },
    { id: RelationshipCategory.FRIEND, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Close Friend' },
    { id: RelationshipCategory.FAMILY, icon: Home, color: 'bg-teal-50 text-teal-600 border-teal-100', label: 'Family Member' },
  ];

  const livingOptions = ['Living Together', 'Living Apart', 'Long Distance', 'Occasional Contact'];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="space-y-2 mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Relationship Context</h2>
        <p className="text-slate-500">Provide a few details to help personalize your evaluation results.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Relationship Label</label>
            <input 
              type="text" 
              placeholder="e.g. Alex, Best Friend, Mom"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Specific Subtype</label>
            <input 
              type="text" 
              placeholder="e.g. Fiancé, Roommate, Cousin"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              value={subtype}
              onChange={(e) => setSubtype(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Primary Category</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  category === cat.id 
                    ? `${cat.color} border-current ring-4 ring-current/5` 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                <cat.icon className="w-6 h-6" />
                <span className="font-bold text-xs uppercase tracking-wider">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
          {/* Duration & Living */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex justify-between">
                Duration <span>{duration >= 12 ? `${Math.floor(duration/12)}y ${duration%12}m` : `${duration} months`}</span>
              </label>
              <input 
                type="range" min="1" max="120" step="1"
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Living Situation</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
              >
                {livingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Closeness */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex justify-between">
                Current Closeness Level <span>{closeness}/10</span>
              </label>
              <div className="flex gap-1.5">
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCloseness(i + 1)}
                    className={`flex-1 h-8 rounded-md transition-all ${
                      closeness > i ? 'bg-teal-500 shadow-sm shadow-teal-100' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 italic">1 = Very Distant, 10 = Extremely Intimate/Close</p>
            </div>
          </div>
        </div>

        <button 
          disabled={!label || !category || !subtype}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200"
        >
          Begin Evaluation
          <ChevronRight className="w-5 h-5" />
        </button>
      </form>

      <div className="mt-6 flex items-start gap-2 text-slate-400 text-xs px-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>This information is used to weight certain questions more accurately and provide more nuanced reflective feedback. It is never shared with third parties.</p>
      </div>
    </div>
  );
};

export default SetupView;
