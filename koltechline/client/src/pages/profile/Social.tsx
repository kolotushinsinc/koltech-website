import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Send, Image as ImageIcon, Video, FileText, Smile, Hash,
  MessageCircle, Share2, Eye, MoreHorizontal, Edit, Trash2, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { postsAPI, fileApi } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import ReactionPicker from '../../components/ui/ReactionPicker';
import ShareModal from '../../components/ui/ShareModal';
import ImageGalleryModal from '../../components/ui/ImageGalleryModal';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatar?: string;
  };
  content?: string;
  images?: string[];
  videos?: string[];
  documents?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  tags: string[];
  reactions: {
    user: string;
    type: string;
    createdAt: string;
  }[];
  reactionsCount: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
    total: number;
  };
  commentsCount: number;
  viewsCount: number;
  visibility: string;
  type: string;
  createdAt: string;
}

const Social = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPost, setNewPost] = useState({
    content: '',
    images: [] as string[],
    videos: [] as string[],
    documents: [] as { filename: string; url: string; type: string; size: number }[]
  });
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [imageGallery, setImageGallery] = useState<{
    isOpen: boolean;
    images: { url: string; type: 'image' | 'video' }[];
    initialIndex: number;
    author: { username: string; avatar: string };
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (page = 1, reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setHasMorePosts(true);
      } else {
        setLoadingMore(true);
      }

      const response = await postsAPI.getFeed(page, 10);
      
      if (response.success) {
        const newPosts = response.data.posts || [];
        
        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }

        setCurrentPage(page);
        setHasMorePosts(
          response.data.pagination ? page < response.data.pagination.pages : false
        );

        // Track views for posts
        newPosts.forEach((post: Post) => {
          if (post.author._id !== user?._id) {
            postsAPI.trackView(post._id).catch(console.error);
          }
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    if (loadingMore || !hasMorePosts) return;
    fetchPosts(currentPage + 1, false);
  };

  const handleFileUpload = async (files: FileList, type: 'image' | 'video' | 'document') => {
    if (!files.length) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (type === 'document') {
          const docData = {
            filename: file.name,
            url: `/uploads/documents/${Date.now()}-${file.name}`,
            type: file.type,
            size: file.size
          };
          setNewPost(prev => ({
            ...prev,
            documents: [...prev.documents, docData]
          }));
        } else {
          const response = type === 'image' 
            ? await fileApi.uploadImage(file)
            : await fileApi.uploadVideo(file);
          
          if (response.success) {
            setNewPost(prev => ({
              ...prev,
              [type === 'image' ? 'images' : 'videos']: [
                ...prev[type === 'image' ? 'images' : 'videos'],
                response.data.path
              ]
            }));
          }
        }
      }
      toast.success(`${files.length} ${type}(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(`Failed to upload ${type}: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async () => {
    const hasContent = newPost.content.trim().length > 0;
    const hasMedia = newPost.images.length > 0 || newPost.videos.length > 0 || newPost.documents.length > 0;

    if (!hasContent && !hasMedia) {
      toast.error('Post must have at least some content, media, or files');
      return;
    }

    setPosting(true);
    try {
      const response = await postsAPI.createPost({
        ...newPost,
        content: newPost.content || undefined
      });

      if (response.success) {
        toast.success('Post created successfully!');
        setNewPost({
          content: '',
          images: [],
          videos: [],
          documents: []
        });
        fetchPosts(1, true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      const response = await postsAPI.reactToPost(postId, reactionType);
      if (response.success) {
        setPosts(prev => prev.map(post =>
          post._id === postId
            ? {
                ...post,
                reactionsCount: response.data.reactionsCount,
                reactions: post.reactions.filter(r => r.user !== user?._id).concat(
                  response.data.userReaction ? [{
                    user: user!._id,
                    type: response.data.userReaction,
                    createdAt: new Date().toISOString()
                  }] : []
                )
              }
            : post
        ));
      }
    } catch (error: any) {
      toast.error('Failed to update reaction');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const openImageGallery = (post: Post, initialIndex: number = 0) => {
    const allMedia = [
      ...(post.images?.map(img => ({ url: img, type: 'image' as const })) || []),
      ...(post.videos?.map(vid => ({ url: vid, type: 'video' as const })) || [])
    ];

    if (allMedia.length === 0) return;

    setImageGallery({
      isOpen: true,
      images: allMedia,
      initialIndex,
      author: {
        username: `${post.author.firstName} ${post.author.lastName}`,
        avatar: post.author.avatar ?
          `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${post.author.avatar}` :
          `https://ui-avatars.com/api/?name=${post.author.firstName}+${post.author.lastName}&background=6366f1&color=ffffff&size=32`
      }
    });
  };

  const removeFile = (index: number, type: 'image' | 'video' | 'document') => {
    setNewPost(prev => ({
      ...prev,
      [type === 'image' ? 'images' : type === 'video' ? 'videos' : 'documents']: 
        prev[type === 'image' ? 'images' : type === 'video' ? 'videos' : 'documents'].filter((_, i) => i !== index)
    }));
  };

  const addEmoji = (emoji: string) => {
    setNewPost(prev => ({
      ...prev,
      content: prev.content + emoji
    }));
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'];

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-dark-800/50 rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-dark-600 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-dark-600 rounded w-32"></div>
                    <div className="h-3 bg-dark-600 rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-dark-600 rounded w-full"></div>
                  <div className="h-4 bg-dark-600 rounded w-3/4"></div>
                </div>
                <div className="h-32 bg-dark-600 rounded mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 pb-32">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to Social</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Share your thoughts, projects, and achievements with the KolTech community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post._id}
                className="bg-dark-800/80 rounded-2xl p-6 border border-dark-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Link to={`/user/${post.author._id}`}>
                      <img
                        src={post.author.avatar ?
                          `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${post.author.avatar}` :
                          `https://ui-avatars.com/api/?name=${post.author.firstName}+${post.author.lastName}&background=6366f1&color=ffffff&size=48`
                        }
                        alt={`${post.author.firstName} ${post.author.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link to={`/user/${post.author._id}`}>
                        <h3 className="text-white font-medium hover:text-primary-400 hover:underline">
                          {post.author.firstName} {post.author.lastName}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-xs">{formatTime(post.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                {post.content && (
                  <div className="mb-4">
                    <p className="text-gray-300 leading-relaxed">{post.content}</p>
                  </div>
                )}

                {/* Media */}
                {(post.images?.length || post.videos?.length) ? (
                  <div className="mb-4">
                    <div className="grid gap-2 grid-cols-2">
                      {post.images?.map((image, index) => (
                        <img
                          key={index}
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${image}`}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-xl cursor-pointer"
                          onClick={() => openImageGallery(post, index)}
                        />
                      ))}
                      {post.videos?.map((video, index) => (
                        <video
                          key={index}
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${video}`}
                          className="w-full h-48 object-cover rounded-xl cursor-pointer"
                          onClick={() => openImageGallery(post, (post.images?.length || 0) + index)}
                          muted
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                  <div className="flex items-center gap-6">
                    <ReactionPicker
                      onReaction={(reactionType) => handleReaction(post._id, reactionType)}
                      currentReaction={post.reactions.find(r => r.user === user?._id)?.type || null}
                      reactions={post.reactionsCount}
                    />
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.commentsCount}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-green-400">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewsCount} views</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {hasMorePosts && (
            <div className="text-center">
              <button
                onClick={loadMorePosts}
                disabled={loadingMore}
                className="px-6 py-3 rounded-xl bg-dark-700 text-gray-300 hover:bg-dark-600 border border-dark-600"
              >
                {loadingMore ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Post Creation Form */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-md border-t border-dark-700 p-4 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-700 rounded-2xl p-4 border border-dark-600">
            
            {/* Media Previews */}
            {(newPost.images.length > 0 || newPost.videos.length > 0 || newPost.documents.length > 0) && (
              <div className="mb-4 grid grid-cols-4 gap-3">
                {newPost.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${image}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index, 'image')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {newPost.videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <video
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${video}`}
                      className="w-full h-20 object-cover rounded-lg"
                      muted
                    />
                    <button
                      onClick={() => removeFile(index, 'video')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-4">
              <img
                src={user?.avatar ?
                  `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` :
                  `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6366f1&color=ffffff&size=40`
                }
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/30"
              />
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's on your mind?"
                  className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none h-[60px]"
                  rows={2}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-600">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Array.from(files).forEach(file => {
                        const fileList = new DataTransfer();
                        fileList.items.add(file);
                        
                        if (file.type.startsWith('image/')) {
                          handleFileUpload(fileList.files, 'image');
                        } else if (file.type.startsWith('video/')) {
                          handleFileUpload(fileList.files, 'video');
                        } else {
                          handleFileUpload(fileList.files, 'document');
                        }
                      });
                    }
                  }}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 text-gray-400 hover:text-blue-400 rounded-lg"
                  title="Upload Images"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 text-gray-400 hover:text-purple-400 rounded-lg"
                  title="Upload Videos"
                >
                  <Video className="w-5 h-5" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 text-gray-400 hover:text-green-400 rounded-lg"
                  title="Upload Documents"
                >
                  <FileText className="w-5 h-5" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-400 hover:text-yellow-400 rounded-lg"
                    title="Add Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 bg-dark-600 border border-dark-500 rounded-lg p-3 grid grid-cols-8 gap-1 max-w-xs">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="text-xl hover:bg-dark-500 p-1 rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={posting || uploading || (!newPost.content.trim() && newPost.images.length === 0 && newPost.videos.length === 0 && newPost.documents.length === 0)}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {imageGallery && (
        <ImageGalleryModal
          isOpen={imageGallery.isOpen}
          onClose={() => setImageGallery(null)}
          images={imageGallery.images}
          initialIndex={imageGallery.initialIndex}
          author={imageGallery.author}
          autoRotate={false}
        />
      )}
    </div>
  );
};

export default Social;