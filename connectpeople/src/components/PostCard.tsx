import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post, Comment } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import { DeletePostModal } from './DeletePostModal';
import { EditPostModal } from './EditPostModal';

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const { user, profile } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likesUsers, setLikesUsers] = useState<any[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwnPost = user?.id === post.user_id;

  const handleLike = async () => {
    if (!user || isLiking) return;
    setIsLiking(true);

    try {
      if (post.user_has_liked) {
        await supabase
          .from('likes')
          .delete()
          .match({ post_id: post.id, user_id: user.id });
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: post.id, user_id: user.id, emoji: 'like' });
      }
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch all profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');

      const profileMap = new Map((profilesData || []).map(p => [p.id, p]));

      // Map profiles to comments
      const commentsWithProfiles = (commentsData || []).map(comment => ({
        ...comment,
        profiles: profileMap.get(comment.user_id),
      }));

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchLikesUsers = async () => {
    setLoadingLikes(true);
    try {
      const { data: likesData, error } = await supabase
        .from('likes')
        .select(`
          user_id,
          profiles:user_id (
            id,
            name,
            avatar_url
          )
        `)
        .eq('post_id', post.id);

      if (error) throw error;
      setLikesUsers(likesData || []);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) throw error;
      setNewComment('');
      fetchComments();
      onUpdate?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
    // Close likes modal when opening comments
    if (showLikes) setShowLikes(false);
  };

  const toggleLikes = () => {
    if (!showLikes) {
      fetchLikesUsers();
    }
    setShowLikes(!showLikes);
    // Close comments when opening likes
    if (showComments) setShowComments(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.profiles?.avatar_url || 'https://via.placeholder.com/40'}
            alt={post.profiles?.name}
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <Link 
              to={`/profile/${post.user_id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {post.profiles?.name}
            </Link>
            <span className="text-xs text-gray-500 block">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors border-t border-gray-200 dark:border-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.image_url && (
        <div className="relative aspect-video bg-gray-100">
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <div className="bg-blue-500 rounded-full p-1">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
          <button
            onClick={toggleLikes}
            className="hover:text-blue-600 transition-colors"
          >
            <span>{post.likes_count || 0} likes</span>
          </button>
        </div>
        <div className="flex gap-3">
          <span>{post.comments_count || 0} comments</span>
          <span>0 shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 flex items-center border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors",
            post.user_has_liked ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Heart className={cn("w-5 h-5", post.user_has_liked && "fill-current")} />
          <span className="font-medium">Like</span>
        </button>
        <button
          onClick={toggleComments}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <div className="space-y-4 mb-4">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.profiles?.avatar_url || 'https://via.placeholder.com/32'}
                    alt={comment.profiles?.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <Link
                        to={`/profile/${comment.user_id}`}
                        className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {comment.profiles?.name}
                      </Link>
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(comment.created_at))}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <img
              src={profile?.avatar_url || 'https://via.placeholder.com/32'}
              alt={profile?.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-gray-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Likes Section */}
      {showLikes && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <h4 className="font-semibold text-gray-900 mb-4">People who liked this</h4>
          <div className="space-y-3">
            {loadingLikes ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : likesUsers.length > 0 ? (
              likesUsers.map((like) => (
                <div key={like.user_id} className="flex items-center gap-3">
                  <img
                    src={like.profiles?.avatar_url || 'https://via.placeholder.com/32'}
                    alt={like.profiles?.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <Link
                    to={`/profile/${like.user_id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {like.profiles?.name}
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">No likes yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Post Modal */}
      <DeletePostModal
        isOpen={showDeleteModal}
        post={post}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => {
          setShowDeleteModal(false);
          onUpdate?.();
        }}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        post={post}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          setShowEditModal(false);
          onUpdate?.();
        }}
      />
    </div>
  );
};
