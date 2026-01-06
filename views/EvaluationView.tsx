
import React, { useState } from 'react';
import { RelationshipCategory, EvaluationResult, EvaluationResponse, AnswerScale } from '../types';
import { QUESTIONS, WEIGHTS } from '../constants';
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

interface EvaluationViewProps {
  relationship: { label: string, category: RelationshipCategory };
  onComplete: (result: EvaluationResult) => void;
}

const EvaluationView: React.FC<EvaluationViewProps> = ({ relationship, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<EvaluationResponse[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const questions = QUESTIONS[relationship.category] || [];
  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (value: number) => {
    const newResponses = [...responses];
    const existingIndex = newResponses.findIndex(r => r.questionId === currentQuestion.id);
    
    if (existingIndex > -1) {
      newResponses[existingIndex].answerValue = value;
    } else {
      newResponses.push({ questionId: currentQuestion.id, answerValue: value });
    }
    
    setResponses(newResponses);

    // Auto-advance if not on the last question
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const calculateResults = () => {
    setIsCalculating(true);
    
    // Ensure we have all responses. If not, don't proceed.
    if (responses.length < questions.length) {
      setIsCalculating(false);
      return;
    }

    try {
      const categoryWeights = WEIGHTS[relationship.category];
      const categories = Object.keys(categoryWeights);
      
      const breakdown = categories.map(catName => {
        const catQuestions = questions.filter(q => q.category === catName);
        const weight = (categoryWeights as any)[catName] || 0;

        if (catQuestions.length === 0) {
          return { 
            name: catName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 
            score: 0, 
            weight 
          };
        }
        
        const sum = catQuestions.reduce((acc, q) => {
          const response = responses.find(r => r.questionId === q.id);
          // Map 1-5 scale to 0-100% ( (val - 1) / 4 * 100 )
          const scoreValue = response ? ((response.answerValue - 1) / 4) * 100 : 0;
          return acc + scoreValue;
        }, 0);
        
        return {
          name: catName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          score: Math.round(sum / catQuestions.length),
          weight
        };
      });

      const totalScore = Math.round(breakdown.reduce((acc, cat) => acc + (cat.score * cat.weight), 0));

      onComplete({
        id: Math.random().toString(36).substr(2, 9),
        totalScore: Math.min(100, Math.max(0, totalScore)), // Clamp between 0-100
        categoryBreakdown: breakdown,
        timestamp: new Date().toISOString(),
        relationshipLabel: relationship.label,
        relationshipCategory: relationship.category
      });
    } catch (error) {
      console.error("Calculation error:", error);
      setIsCalculating(false);
    }
  };

  const answerOptions = [
    { label: 'Strongly Agree', value: AnswerScale.STRONGLY_AGREE, color: 'hover:bg-emerald-50 hover:border-emerald-200' },
    { label: 'Agree', value: AnswerScale.AGREE, color: 'hover:bg-teal-50 hover:border-teal-200' },
    { label: 'Neutral', value: AnswerScale.NEUTRAL, color: 'hover:bg-slate-50 hover:border-slate-200' },
    { label: 'Disagree', value: AnswerScale.DISAGREE, color: 'hover:bg-orange-50 hover:border-orange-200' },
    { label: 'Strongly Disagree', value: AnswerScale.STRONGLY_DISAGREE, color: 'hover:bg-rose-50 hover:border-rose-200' },
  ];

  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress */}
      <div className="mb-12 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-teal-600 font-bold text-sm uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
            <h2 className="text-xl font-bold text-slate-800">{relationship.label}'s Evaluation</h2>
          </div>
          <span className="text-slate-400 font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10 animate-in slide-in-from-bottom-4 duration-300">
        <h3 className="text-2xl font-semibold text-slate-800 text-center leading-relaxed">
          "{currentQuestion.text}"
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {answerOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`p-4 rounded-2xl border-2 text-left font-medium transition-all flex justify-between items-center ${
                currentResponse?.answerValue === opt.value 
                  ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-200' 
                  : `bg-white border-slate-100 text-slate-600 ${opt.color}`
              }`}
            >
              <span>{opt.label}</span>
              {currentResponse?.answerValue === opt.value && <CheckCircle2 className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || isCalculating}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 disabled:opacity-0 transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={calculateResults}
            disabled={responses.length < questions.length || isCalculating}
            className="flex items-center gap-2 bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-teal-200"
          >
            {isCalculating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isCalculating ? 'Processing...' : 'Show Results'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            disabled={!currentResponse}
            className="flex items-center gap-2 text-teal-600 font-bold hover:translate-x-1 transition-all disabled:opacity-30 disabled:translate-x-0"
          >
            Next Question <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EvaluationView;
