import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../lib/supabase';
import { publicAnonKey } from '../../utils/supabase/info';

export function FactsSection() {
  const [fact, setFact] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFact();
  }, []);

  const fetchFact = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/fact`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      setFact(data.fact || '');
    } catch (error) {
      console.error('Error fetching fact:', error);
      setFact('Mental health is just as important as physical health.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl text-gray-900">Daily Mental Health Fact</h2>
            <p className="text-gray-600">Learn something new</p>
          </div>
        </div>
        <button
          onClick={fetchFact}
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
          aria-label="Get new fact"
        >
          <RefreshCw className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <p className="text-gray-800 text-lg">{fact}</p>
        )}
      </div>
    </div>
  );
}
