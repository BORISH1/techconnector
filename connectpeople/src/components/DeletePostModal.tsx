import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

interface DeletePostModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeletePostModal: React.FC<DeletePostModalProps> = ({
  isOpen,
  post,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!post) return;

    setLoading(true);
    try {
      // Delete likes associated with the post
      await supabase.from('likes').delete().eq('post_id', post.id);

      // Delete comments associated with the post
      await supabase.from('comments').delete().eq('post_id', post.id);

      // Delete the post itself
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      // Delete post image from storage if it exists
      if (post.image_url) {
        try {
          const fileName = post.image_url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('images')
              .remove([`posts/${fileName}`]);
          }
        } catch (err) {
          console.error('Error deleting image from storage:', err);
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Delete Post?
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 max-h-32 overflow-hidden">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {post.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
