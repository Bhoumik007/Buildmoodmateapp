import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Mood {
  id: string;
  emoji: string;
  reason: string;
  tag: string;
  created_at: string;
}

interface MoodFormProps {
  mood?: Mood | null;
  onClose: () => void;
  onSubmit: (data: { emoji: string; reason: string; tag: string }) => Promise<void>;
}

const MOOD_EMOJIS = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😊', label: 'Content' },
  { emoji: '😔', label: 'Down' }
];

export function MoodForm({ mood, onClose, onSubmit }: MoodFormProps) {
  const [formData, setFormData] = useState({
    emoji: mood?.emoji || '',
    reason: mood?.reason || '',
    tag: mood?.tag || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (mood) {
      setFormData({
        emoji: mood.emoji,
        reason: mood.reason,
        tag: mood.tag
      });
    }
  }, [mood]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.emoji) {
      newErrors.emoji = 'Please select a mood';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please describe how you feel';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl text-gray-900">
            {mood ? 'Edit Mood Entry' : 'How are you feeling?'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-gray-700 mb-3">
              Select Your Mood
            </label>
            <div className="grid grid-cols-4 gap-3">
              {MOOD_EMOJIS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji: item.emoji })}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    formData.emoji === item.emoji
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </button>
              ))}
            </div>
            {errors.emoji && <p className="text-red-500 text-sm mt-2">{errors.emoji}</p>}
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-gray-700 mb-2">
              Why do you feel this way?
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none ${
                errors.reason ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Express your feelings..."
            />
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
          </div>

          {/* Tag */}
          <div>
            <label htmlFor="tag" className="block text-gray-700 mb-2">
              Tag (Optional)
            </label>
            <input
              id="tag"
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="e.g. Work, Family, Exercise"
            />
            <p className="text-gray-500 text-sm mt-1">
              Help categorize your mood for better insights
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                mood ? 'Update Entry' : 'Save Entry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
