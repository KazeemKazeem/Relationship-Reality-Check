
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingView from './views/LandingView';
import AuthView from './views/AuthView';
import SetupView from './views/SetupView';
import EvaluationView from './views/EvaluationView';
import ResultsView from './views/ResultsView';
import DashboardView from './views/DashboardView';
import { UserProfile, EvaluationResult, RelationshipCategory, RelationshipMetadata } from './types';
import { supabase } from './lib/supabase';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const [setupData, setSetupData] = useState<{ label: string, category: RelationshipCategory, metadata: RelationshipMetadata } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Listen for Auth changes
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchHistory(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchHistory(session.user.id);
      } else {
        setUser(null);
        setHistory([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error.message);
      } else if (data) {
        const mapped: EvaluationResult[] = data.map(item => ({
          id: item.id,
          totalScore: item.total_score,
          categoryBreakdown: item.category_breakdown,
          timestamp: item.created_at,
          relationshipLabel: item.relationship_label,
          relationshipCategory: item.relationship_category as RelationshipCategory,
          metadata: item.metadata
        }));
        setHistory(mapped);
      }
    } catch (err) {
      console.error('Unexpected error fetching history:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHistory([]);
    navigate('/');
  };

  const startSetup = () => navigate('/setup');
  
  const startGuestMode = async () => {
    if (user) await supabase.auth.signOut();
    navigate('/setup');
  };

  const handleCompleteSetup = (data: { label: string, category: RelationshipCategory, metadata: RelationshipMetadata }) => {
    setSetupData(data);
    navigate('/evaluate');
  };

  const handleCompleteEvaluation = async (result: EvaluationResult) => {
    const resultWithMeta = { ...result, metadata: setupData?.metadata };
    setCurrentResult(resultWithMeta);
    
    if (user) {
      const payload: any = {
        user_id: user.id,
        relationship_label: resultWithMeta.relationshipLabel,
        relationship_category: resultWithMeta.relationshipCategory,
        total_score: resultWithMeta.totalScore,
        category_breakdown: resultWithMeta.categoryBreakdown,
        metadata: resultWithMeta.metadata 
      };

      // Attempt initial save with metadata
      const { error } = await supabase.from('evaluations').insert(payload);

      if (error) {
        // Detect if the error is related to the 'metadata' column being missing or the schema cache being stale
        const isMetadataError = 
          error.message.toLowerCase().includes('metadata') || 
          error.message.toLowerCase().includes('schema cache') ||
          error.code === '42703';

        if (isMetadataError) {
          console.warn('Metadata column not recognized by Supabase cache. Retrying save without metadata field...');
          // Remove metadata from payload and retry the insert to ensure the evaluation is at least saved
          const { metadata, ...fallbackPayload } = payload;
          const { error: fallbackError } = await supabase.from('evaluations').insert(fallbackPayload);
          
          if (fallbackError) {
            console.error('Save failed even without metadata:', fallbackError.message);
          } else {
            fetchHistory(user.id);
          }
        } else {
          console.error('Error saving result:', error.message);
        }
      } else {
        fetchHistory(user.id);
      }
    }
    navigate('/results');
  };

  const deleteHistoryItem = async (id: string) => {
    const { error } = await supabase.from('evaluations').delete().eq('id', id);
    if (!error) {
      setHistory(prev => prev.filter(item => item.id !== id));
    } else {
      console.error('Error deleting record:', error.message);
    }
  };

  const isBackVisible = location.pathname !== '/' && location.pathname !== '/dashboard';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      userEmail={user?.email} 
      onLogout={handleLogout} 
      onBack={isBackVisible ? () => navigate(-1) : undefined}
      title={location.pathname === '/dashboard' ? "Your History" : undefined}
    >
      <Routes>
        <Route path="/" element={<LandingView onStart={startSetup} onGuest={startGuestMode} onAuth={() => navigate('/auth')} user={user} />} />
        <Route path="/auth" element={<AuthView />} />
        <Route path="/setup" element={<SetupView onComplete={handleCompleteSetup} />} />
        <Route path="/evaluate" element={setupData ? <EvaluationView relationship={setupData} onComplete={handleCompleteEvaluation} /> : <LandingView onStart={startSetup} onGuest={startGuestMode} onAuth={() => navigate('/auth')} user={user} />} />
        <Route path="/results" element={currentResult ? <ResultsView result={currentResult} isSaved={!!user} /> : <LandingView onStart={startSetup} onGuest={startGuestMode} onAuth={() => navigate('/auth')} user={user} />} />
        <Route path="/dashboard" element={user ? <DashboardView history={history} onDelete={deleteHistoryItem} onStart={startSetup} /> : <AuthView />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
