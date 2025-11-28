import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../lib/supabase';
import { publicAnonKey } from '../../utils/supabase/info';

interface Tip {
  category: string;
  content: string;
}

export function TipsSection() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [displayedTips, setDisplayedTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tips`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      setTips(data.tips || []);
      shuffleTips(data.tips || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleTips = (tipsArray: Tip[]) => {
    const shuffled = [...tipsArray].sort(() => Math.random() - 0.5);
    setDisplayedTips(shuffled.slice(0, 3));
  };

  const handleRefresh = () => {
    shuffleTips(tips);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl text-gray-900">Mood Boosting Tips</h2>
            <p className="text-gray-600">Try these to feel better</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-amber-100 transition-colors"
          aria-label="Refresh tips"
        >
          <RefreshCw className="w-5 h-5 text-amber-600" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {displayedTips.map((tip, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm mb-3">
              {tip.category}
            </div>
            <p className="text-gray-700">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
