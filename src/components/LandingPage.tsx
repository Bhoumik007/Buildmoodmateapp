import { useState, useEffect } from 'react';
import { Smile, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { API_BASE_URL, supabase } from '../lib/supabase';
import { publicAnonKey } from '../utils/supabase/info';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quote`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      setQuote(data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote('Track your feelings. Understand yourself.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="text-2xl text-gray-800">MoodMate</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Your Personal Mental Health Companion</span>
          </div>

          <h1 className="text-5xl md:text-6xl text-gray-900 mb-6">
            Track your feelings.<br />
            Understand yourself.
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            MoodMate helps you build self-awareness through daily mood journaling. 
            Recognize patterns, understand your emotions, and take control of your mental wellbeing.
          </p>

          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Start Logging Now
          </button>

          {/* Inspirational Quote */}
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            {loading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <p className="text-xl text-gray-700 italic mb-2">"{quote}"</p>
                <button
                  onClick={fetchQuote}
                  className="text-purple-600 hover:text-purple-700 mt-2"
                >
                  Get new inspiration →
                </button>
              </>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Smile className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Express Your Emotions</h3>
              <p className="text-gray-600">
                Choose from mood emojis and write about what you're feeling in the moment.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Track Patterns</h3>
              <p className="text-gray-600">
                See how your mood changes over time and identify what affects your wellbeing.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Build Self-Awareness</h3>
              <p className="text-gray-600">
                Understand yourself better through consistent reflection and journaling.
              </p>
            </div>
          </div>

          {/* Why Mood Journaling */}
          <div className="mt-20 text-left bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-xl">
            <h2 className="text-3xl mb-6">Why Mood Journaling Matters</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span>✓</span>
                </div>
                <p><strong>Mental Health:</strong> Regular mood tracking helps identify triggers and patterns in your emotional life.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span>✓</span>
                </div>
                <p><strong>Self-Awareness:</strong> Understanding your emotions is the first step to managing them effectively.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span>✓</span>
                </div>
                <p><strong>Personal Growth:</strong> Reflection helps you make better decisions and improve your quality of life.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>Made with ❤️ for your mental wellbeing</p>
      </footer>
    </div>
  );
}
