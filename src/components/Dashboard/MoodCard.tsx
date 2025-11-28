import { Edit2, Trash2, Tag } from 'lucide-react';

interface Mood {
  id: string;
  emoji: string;
  reason: string;
  tag: string;
  created_at: string;
}

interface MoodCardProps {
  mood: Mood;
  onEdit: () => void;
  onDelete: () => void;
}

export function MoodCard({ mood, onEdit, onDelete }: MoodCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Emoji */}
        <div className="text-5xl flex-shrink-0">{mood.emoji}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 mb-2 break-words">{mood.reason}</p>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{formatDate(mood.created_at)}</span>
            {mood.tag && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span className="text-purple-600">{mood.tag}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-purple-50 text-purple-600 transition-colors"
            aria-label="Edit mood"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            aria-label="Delete mood"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
