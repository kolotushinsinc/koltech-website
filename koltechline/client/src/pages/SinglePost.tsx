import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Share2, Eye, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { postsAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import ReactionPicker from '../components/ui/ReactionPicker';
import ShareModal from '../components/ui/ShareModal';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';
import toast from 'react-hot-toast';

interface SinglePostData {
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
  isRepost?: boolean;
  originalPost?: {
    _id: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    content?: string;
    createdAt: string;
  };
  createdAt: string;
}

const SinglePost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [post, setPost] = useState<SinglePostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageGallery, setImageGallery] = useState<{
    isOpen: boolean;
    images: { url: string; type: 'image' | 'video' }[];
    initialIndex: number;
    author: { username: string; avatar: string };
  } | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPost();
      // Scroll to top and highlight post
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(postId!);
      if (response.success) {
        setPost(response.data.post);
        
        // Track view if not own post
        if (response.data.post.author._id !== user?._id) {
          postsAPI.trackView(postId!).catch(console.error);
        }
      } else {
        toast.error('Post not found');
        navigate('/profile/social');
      }
    } catch (error: any) {
      console.error('Failed to fetch post:', error);
      toast.error('Failed to load post');
      navigate('/profile/social');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType: string) => {
    try {
      const response = await postsAPI.reactToPost(postId!, reactionType);
      if (response.success && post) {
        setPost({
          ...post,
          reactionsCount: response.data.reactionsCount,
          reactions: post.reactions.filter(r => r.user !== user?._id).concat(
            response.data.userReaction ? [{
              user: user!._id,
              type: response.data.userReaction,
              createdAt: new Date().toISOString()
            }] : []
          )
        });
      }
    } catch (error: any) {
      toast.error('Failed to update reaction');
    }
  };

  const openImageGallery = (initialIndex: number = 0) => {
    if (!post) return;
    
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Header />
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Header />
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
            <Link to="/profile/social" className="btn-primary">
              Back to Social
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="max-w-2xl mx-auto">
            {/* Highlighted Post */}
            <motion.div
              className="bg-dark-800/90 rounded-2xl p-8 border-2 border-primary-500/50 shadow-xl shadow-primary-500/10"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Repost Header (if it's a repost) */}
              {post.isRepost && post.originalPost && (
                <div className="mb-6 pb-4 border-b border-dark-700">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Share2 className="w-4 h-4" />
                    <Link 
                      to={`/user/${post.author._id}`}
                      className="hover:text-primary-400 transition-colors"
                    >
                      {post.author.firstName} {post.author.lastName}
                    </Link>
                    <span>reposted</span>
                  </div>
                </div>
              )}

              {/* Post Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Link to={`/user/${post.isRepost ? post.originalPost!.author._id : post.author._id}`} className="group">
                    <img
                      src={(post.isRepost ? post.originalPost!.author.avatar : post.author.avatar) ?
                        `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${post.isRepost ? post.originalPost!.author.avatar : post.author.avatar}` :
                        `https://ui-avatars.com/api/?name=${post.isRepost ? post.originalPost!.author.firstName : post.author.firstName}+${post.isRepost ? post.originalPost!.author.lastName : post.author.lastName}&background=6366f1&color=ffffff&size=56`
                      }
                      alt="Author"
                      className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-primary-500/50 transition-colors"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/user/${post.isRepost ? post.originalPost!.author._id : post.author._id}`}
                      className="group"
                    >
                      <h2 className="text-xl font-bold text-white group-hover:text-primary-400 group-hover:underline transition-all">
                        {post.isRepost ? 
                          `${post.originalPost!.author.firstName} ${post.originalPost!.author.lastName}` :
                          `${post.author.firstName} ${post.author.lastName}`
                        }
                      </h2>
                    </Link>
                    {post.author.username && (
                      <p className="text-primary-400">@{post.author.username}</p>
                    )}
                    <p className="text-gray-400 text-sm">
                      {formatTime(post.isRepost && post.originalPost ? post.originalPost.createdAt : post.createdAt)}
                      {post.type !== 'post' && (
                        <span className="ml-2 bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded text-xs">
                          {post.type.replace('_', ' ')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="mb-6">
                  <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              )}

              {/* Media Attachments */}
              {(post.images?.length || post.videos?.length) ? (
                <div className="mb-6">
                  <div className={`grid gap-3 ${
                    (post.images?.length || 0) + (post.videos?.length || 0) === 1 ? 'grid-cols-1' :
                    (post.images?.length || 0) + (post.videos?.length || 0) === 2 ? 'grid-cols-2' :
                    'grid-cols-2 md:grid-cols-3'
                  }`}>
                    {post.images?.map((image, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openImageGallery(index)}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${image}`}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                    
                    {post.videos?.map((video, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openImageGallery((post.images?.length || 0) + index)}
                      >
                        <video
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${video}`}
                          className="w-full h-64 object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Documents */}
              {post.documents && post.documents.length > 0 && (
                <div className="mb-6 space-y-3">
                  {post.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${doc.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 bg-dark-700/50 p-4 rounded-lg hover:bg-dark-700/70 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{doc.filename}</p>
                        <p className="text-gray-400 text-sm">
                          {(doc.size / (1024 * 1024)).toFixed(1)} MB • {doc.type}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-primary-500/30 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-dark-700">
                <div className="flex items-center gap-8">
                  <ReactionPicker
                    onReaction={handleReaction}
                    currentReaction={post.reactions.find(r => r.user === user?._id)?.type || null}
                    reactions={post.reactionsCount}
                  />
                  
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentsCount}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewsCount} views</span>
                </div>
              </div>
            </motion.div>

            {/* Comments Section (placeholder for future implementation) */}
            <div className="mt-8 bg-dark-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Comments</h3>
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Comments system coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Share Modal */}
      {post && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          postId={post._id}
          postType="social_post"
          postContent={{
            author: post.isRepost && post.originalPost ? post.originalPost.author : post.author,
            content: post.isRepost && post.originalPost ? post.originalPost.content : post.content,
            images: post.images,
            type: post.type
          }}
        />
      )}

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

export default SinglePost;