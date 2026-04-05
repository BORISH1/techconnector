import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  expires_at: string;
  profiles?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

interface StoryUser {
  user_id: string;
  profile: {
    id: string;
    name: string;
    avatar_url: string;
  };
  unviewed: boolean;
  story?: Story;
}

interface StoryViewerProps {
  stories: StoryUser[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : stories.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
  };

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {stories.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Story content */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={currentStory.story?.image_url}
          alt={`Story by ${currentStory.profile.name}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Story info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.profile.avatar_url || 'https://via.placeholder.com/40'}
              alt={currentStory.profile.name}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold">{currentStory.profile.name}</p>
              <p className="text-white/70 text-sm">
                {new Date(currentStory.story?.created_at || '').toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        {stories.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};