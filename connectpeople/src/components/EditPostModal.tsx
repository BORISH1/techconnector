import React, { useState, useRef } from 'react';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

interface EditPostModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  post,
  onClose,
  onSuccess,
}) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (post) {
      setContent(post.content);
      setImagePreview(post.image_url || null);
      setImage(null);
    }
  }, [post, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!post || !content.trim()) {
      alert('Please write something for your post');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = post.image_url;

      // Upload new image if selected
      if (image) {
        // Validate file
        const maxSize = 10 * 1024 * 1024; // 10MB
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (image.size > maxSize) {
          alert('Image size must be less than 10MB');
          setLoading(false);
          return;
        }

        if (!validTypes.includes(image.type)) {
          alert('Only JPG, PNG, GIF, and WebP images are allowed');
          setLoading(false);
          return;
        }

        const fileExt = image.name.split('.').pop();
        const fileName = `${post.id}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        console.log('Uploading post image to:', filePath);

        // Delete old image if exists
        if (post.image_url) {
          try {
            const oldFileName = post.image_url.split('/').pop();
            if (oldFileName) {
              await supabase.storage
                .from('images')
                .remove([`posts/${oldFileName}`]);
            }
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }

        // Upload new image
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, image, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Update the post
      const { error } = await supabase
        .from('posts')
        .update({
          content: content.trim(),
          image_url: imageUrl,
        })
        .eq('id', post.id);

      if (error) throw error;

      setContent('');
      setImage(null);
      setImagePreview(null);
      onSuccess();
      onClose();
      alert('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to update post: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Post
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Content textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Post Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full min-h-[120px] px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Change Image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

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
              onClick={handleUpdate}
              disabled={loading || !content.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
