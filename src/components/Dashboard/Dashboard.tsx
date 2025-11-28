import { useState, useEffect } from 'react';
import { Plus, LogOut, Heart, Filter, Search } from 'lucide-react';
import { API_BASE_URL, supabase } from '../../lib/supabase';
import { MoodForm } from './MoodForm';
import { MoodCard } from './MoodCard';
import { TipsSection } from './TipsSection';
import { FactsSection } from './FactsSection';
import { toast } from 'sonner@2.0.3';

interface Mood {
  id: string;
  emoji: string;
  reason: string;
  tag: string;
  created_at: string;
}

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function Dashboard({ accessToken, onLogout }: DashboardProps) {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [filteredMoods, setFilteredMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMood, setEditingMood] = useState<Mood | null>(null);
  const [searchTag, setSearchTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    if (searchTag.trim()) {
      setFilteredMoods(
        moods.filter(mood => 
          mood.tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      );
    } else {
      setFilteredMoods(moods);
    }
  }, [searchTag, moods]);

  const fetchMoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/moods`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch moods');
      }

      const data = await response.json();
      setMoods(data.moods || []);
    } catch (error) {
      console.error('Error fetching moods:', error);
      toast.error('Failed to load mood entries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMood = async (data: { emoji: string; reason: string; tag: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create mood');
      }

      toast.success('Mood entry saved!');
      await fetchMoods();
    } catch (error) {
      console.error('Error creating mood:', error);
      toast.error('Failed to save mood entry');
      throw error;
    }
  };

  const handleUpdateMood = async (data: { emoji: string; reason: string; tag: string }) => {
    if (!editingMood) return;

    try {
      const response = await fetch(`${API_BASE_URL}/moods/${editingMood.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update mood');
      }

      toast.success('Mood entry updated!');
      setEditingMood(null);
      await fetchMoods();
    } catch (error) {
      console.error('Error updating mood:', error);
      toast.error('Failed to update mood entry');
      throw error;
    }
  };

  const handleDeleteMood = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/moods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete mood');
      }

      toast.success('Mood entry deleted');
      setShowDeleteConfirm(null);
      await fetchMoods();
    } catch (error) {
      console.error('Error deleting mood:', error);
      toast.error('Failed to delete mood entry');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    toast.success('Logged out successfully');
  };

  const uniqueTags = Array.from(new Set(moods.map(m => m.tag).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl text-gray-800">MoodMate</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600 text-lg">How are you feeling today?</p>
        </div>

        {/* Add Mood Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-3xl hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
        >
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-xl">Add New Mood Entry</span>
        </button>

        {/* Tips Section */}
        <div className="mb-8">
          <TipsSection />
        </div>

        {/* Facts Section */}
        <div className="mb-8">
          <FactsSection />
        </div>

        {/* Filter Section */}
        {uniqueTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="w-5 h-5" />
                <span>Filter by tag:</span>
              </div>
              <button
                onClick={() => setSearchTag('')}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  !searchTag
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {uniqueTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchTag(tag)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    searchTag === tag
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Moods List */}
        <div>
          <h2 className="text-2xl text-gray-900 mb-4">Your Mood Journal</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredMoods.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">
                {searchTag ? 'No entries found' : 'No mood entries yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTag 
                  ? `No entries with tag "${searchTag}"`
                  : 'Start tracking your mood by adding your first entry'
                }
              </p>
              {searchTag && (
                <button
                  onClick={() => setSearchTag('')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMoods.map((mood) => (
                <MoodCard
                  key={mood.id}
                  mood={mood}
                  onEdit={() => {
                    setEditingMood(mood);
                    setShowForm(true);
                  }}
                  onDelete={() => setShowDeleteConfirm(mood.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mood Form Modal */}
      {showForm && (
        <MoodForm
          mood={editingMood}
          onClose={() => {
            setShowForm(false);
            setEditingMood(null);
          }}
          onSubmit={editingMood ? handleUpdateMood : handleCreateMood}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl text-gray-900 mb-4">Delete Mood Entry?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this mood entry? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMood(showDeleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
