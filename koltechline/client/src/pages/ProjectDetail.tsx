import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, DollarSign, Eye, Heart, Users, Clock,
  Target, Briefcase, User, MapPin, TrendingUp, AlertCircle,
  Star, Edit, Trash2, Share2, ExternalLink
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { projectApi } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';
import EditProjectModal from '../components/ui/EditProjectModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import toast from 'react-hot-toast';

interface ProjectDetailData {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    profile?: {
      rating?: number;
    };
  };
  tags: string[];
  skills: string[];
  images?: string[];
  videos?: string[];
  externalLinks?: {
    title: string;
    url: string;
  }[];
  budget?: {
    type: string;
    amount: number;
    currency: string;
    hourlyRate?: number;
  };
  timeline?: {
    startDate?: string;
    endDate?: string;
    estimatedHours?: number;
  };
  funding?: {
    goal: number;
    raised: number;
    currency: string;
    deadline: string;
  };
  views: number;
  likes: string[];
  likesCount: number;
  urgency: string;
  difficulty: string;
  visibility: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// Skeleton Loading Components
const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={`glass-effect-dark rounded-2xl p-6 animate-pulse ${className || ''}`}>
    <div className="space-y-4">
      <div className="h-4 bg-dark-600 rounded w-3/4"></div>
      <div className="h-4 bg-dark-600 rounded w-1/2"></div>
      <div className="h-4 bg-dark-600 rounded w-5/6"></div>
    </div>
  </div>
);

const ImageSkeleton = ({ className }: { className?: string }) => (
  <div className={`bg-dark-700/50 animate-pulse rounded-xl ${className || 'h-64'} flex items-center justify-center`}>
    <div className="text-gray-500">
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
);

// Beautiful Project Loading Component
const ProjectLoader = () => (
  <div className="min-h-screen bg-dark-900 relative overflow-hidden">
    <Header />
    
    {/* Floating particles background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-primary-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>

    <div className="pt-20 pb-12">
      <div className="container mx-auto px-6">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-dark-600 rounded w-32 animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Project Header Skeleton */}
          <motion.div
            className="glass-effect-dark rounded-2xl p-8 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 bg-dark-600 rounded w-2/3 animate-pulse"></div>
                  <div className="h-6 bg-dark-600 rounded-full w-20 animate-pulse"></div>
                </div>
                
                <div className="flex items-center gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 bg-dark-600 rounded w-16 animate-pulse"></div>
                  ))}
                </div>
                
                {/* Image Carousel Skeleton */}
                <ImageSkeleton className="h-64 mb-6" />
                
                <div className="space-y-2">
                  <div className="h-4 bg-dark-600 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-dark-600 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-dark-600 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>

              <div className="flex gap-3 ml-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-dark-600 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 bg-dark-600 rounded-full w-16 animate-pulse"></div>
              ))}
            </div>
            
            {/* Skills Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-dark-600 rounded w-24 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 bg-dark-600 rounded w-20 animate-pulse"></div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Loading indicator */}
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-primary-400 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading project...
        </motion.p>
      </motion.div>
    </div>

    <Footer />
  </div>
);

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (projectId) {
      fetchProject();
      // Scroll to top when opening project
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [projectId]);

  // Auto-rotate images every 3 seconds (only when modal is closed)
  useEffect(() => {
    if (!project || !project.images || project.images.length <= 1 || showImageModal) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev =>
        prev >= (project.images?.length || 1) - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [project, showImageModal]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getProject(projectId!);
      if (response.success) {
        setProject(response.data.project);
        setIsLiked(response.data.project.likes.includes(authUser?._id));
      } else {
        toast.error('Project not found');
        navigate('/profile/projects');
      }
    } catch (error: any) {
      console.error('Failed to fetch project:', error);
      toast.error('Failed to load project');
      navigate('/profile/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!authUser) {
      toast.error('Please login to like projects');
      return;
    }

    try {
      const response = await projectApi.toggleLike(projectId!);
      if (response.success) {
        setIsLiked(response.data.liked);
        setProject(prev => prev ? {
          ...prev,
          likesCount: response.data.likesCount
        } : null);
      }
    } catch (error: any) {
      toast.error('Failed to update like');
    }
  };

  const handleEditProject = (updatedProject: any) => {
    setProject(updatedProject);
    toast.success('Project updated successfully');
    // Navigate to the updated project page to refresh data
    window.location.reload();
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;

    setDeleting(true);
    try {
      const response = await projectApi.deleteProject(projectId);
      if (response.success) {
        toast.success('Project deleted successfully');
        navigate('/profile/projects');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      web_development: 'text-blue-400',
      mobile_app: 'text-green-400',
      ai_ml: 'text-purple-400',
      design: 'text-pink-400',
      marketing: 'text-orange-400',
      blockchain: 'text-yellow-400',
      iot: 'text-cyan-400',
      other: 'text-gray-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-500/20 text-gray-400',
      active: 'bg-green-500/20 text-green-400',
      in_progress: 'bg-blue-500/20 text-blue-400',
      review: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-purple-500/20 text-purple-400',
      cancelled: 'bg-red-500/20 text-red-400',
      funded: 'bg-accent-green/20 text-accent-green'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: { [key: string]: string } = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-orange-400',
      urgent: 'text-red-400'
    };
    return colors[urgency] || 'text-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOwner = authUser && project && project.owner._id === authUser._id;

  if (loading) {
    return <ProjectLoader />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Header />
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
            <Link to="/profile/projects" className="btn-primary">
              Back to Projects
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
          <Link 
            to="/profile/projects" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>

          <div className="max-w-6xl mx-auto">
            {/* Project Header */}
            <motion.div 
              className="glass-effect-dark rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-400">
                    <span className={`flex items-center ${getCategoryColor(project.category)}`}>
                      <Briefcase className="w-4 h-4 mr-1" />
                      {project.category.replace('_', ' ')}
                    </span>
                    
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {project.views} views
                    </span>
                    
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(project.createdAt)}
                    </span>

                    <span className={`flex items-center ${getUrgencyColor(project.urgency)}`}>
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {project.urgency} priority
                    </span>
                  </div>

                  {/* Media Carousel */}
                  {project.images && project.images.length > 0 && (
                    <div className="mb-6">
                      <div
                        className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => setShowImageModal(true)}
                      >
                        {imageLoading[currentImageIndex] && (
                          <ImageSkeleton className="absolute inset-0" />
                        )}
                        <img
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${project.images[currentImageIndex]}`}
                          alt={`${project.title} - Image ${currentImageIndex + 1}`}
                          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                            imageLoading[currentImageIndex] ? 'opacity-0' : 'opacity-100'
                          }`}
                          onLoadStart={() => setImageLoading(prev => ({ ...prev, [currentImageIndex]: true }))}
                          onLoad={() => setImageLoading(prev => ({ ...prev, [currentImageIndex]: false }))}
                          onError={(e) => {
                            setImageLoading(prev => ({ ...prev, [currentImageIndex]: false }));
                            // Set a fallback placeholder
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDJINUMzLjkgMiAzIDIuOSAzIDRWMjBDMyAyMS4xIDMuOSAyMiA1IDIySDIxQzIyLjEgMjIgMjMgMjEuMSAyMyAyMFY0QzIzIDIuOSAyMi4xIDIgMjEgMlpNNSA0SDIxVjE0TDE4IDE0TDE1IDE3TDkgMTFMMTQgNkgxNFY0WiIgZmlsbD0iIzRGNEY0RiIvPgo8L3N2Zz4K';
                          }}
                        />
                        
                        {/* Image counter */}
                        <div className="absolute top-3 right-3 bg-dark-800/80 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {project.images.length}
                          {project.videos && project.videos.length > 0 && (
                            <span className="ml-2">• {project.videos.length} videos</span>
                          )}
                        </div>

                        {/* Click to view hint */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </div>

                        {/* Dots indicator */}
                        {project.images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {project.images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-300 leading-relaxed">
                    {project.description}
                  </p>

                  {/* External Links */}
                  {project.externalLinks && project.externalLinks.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Project Links:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.externalLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 ml-6">
                  <button
                    onClick={handleLike}
                    className={`btn-ghost flex items-center ${isLiked ? 'text-red-400' : 'text-gray-400'}`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                    {project.likesCount}
                  </button>
                  
                  <button className="btn-ghost">
                    <Share2 className="w-4 h-4" />
                  </button>

                  {isOwner && (
                    <>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="btn-secondary"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="btn-ghost text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Skills */}
              {project.skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300">Required Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-accent-purple/20 text-accent-purple px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Details */}
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Type</h4>
                      <p className="text-white">{project.type.replace('_', ' ')}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Difficulty</h4>
                      <p className="text-white">{project.difficulty}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Visibility</h4>
                      <p className="text-white">{project.visibility.replace('_', ' ')}</p>
                    </div>
                    
                    {project.location && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Location</h4>
                        <p className="text-white flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {project.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget Information */}
                {project.budget && (
                  <div className="glass-effect-dark rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-accent-green" />
                      Budget Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Budget Type</h4>
                        <p className="text-white">{project.budget.type} price</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Amount</h4>
                        <p className="text-accent-green font-bold text-lg">
                          {project.budget.currency} {(project.budget.amount || 0).toLocaleString()}
                        </p>
                      </div>
                      
                      {project.budget.hourlyRate && (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Hourly Rate</h4>
                            <p className="text-white">
                              {project.budget.currency} {project.budget.hourlyRate || 0}/hour
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {project.timeline && (
                  <div className="glass-effect-dark rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-accent-purple" />
                      Timeline
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {project.timeline.startDate && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Start Date</h4>
                          <p className="text-white">{formatDate(project.timeline.startDate)}</p>
                        </div>
                      )}
                      
                      {project.timeline.endDate && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">End Date</h4>
                          <p className="text-white">{formatDate(project.timeline.endDate)}</p>
                        </div>
                      )}
                      
                      {project.timeline.estimatedHours && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Estimated Hours</h4>
                          <p className="text-white">{project.timeline.estimatedHours} hours</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Crowdfunding Info */}
                {project.funding && (
                  <div className="glass-effect-dark rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-accent-orange" />
                      Crowdfunding Campaign
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Funding Progress</span>
                        <span className="text-accent-green font-bold">
                          {project.funding.currency} {(project.funding.raised || 0).toLocaleString()} / {(project.funding.goal || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="w-full bg-dark-600 rounded-full h-3">
                        <div 
                          className="bg-accent-green h-3 rounded-full transition-all"
                          style={{ 
                            width: `${project.funding.goal ? Math.min(((project.funding.raised || 0) / project.funding.goal) * 100, 100) : 0}%`
                          }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{project.funding.goal ? Math.round(((project.funding.raised || 0) / project.funding.goal) * 100) : 0}% funded</span>
                        <span>Ends {formatDate(project.funding.deadline)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Owner */}
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Project Owner</h3>
                  
                  <div className="flex items-start gap-4">
                    <Link to={`/user/${project.owner._id}`} className="relative group">
                      <img
                        src={project.owner.avatar ?
                          `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${project.owner.avatar}` :
                          `https://ui-avatars.com/api/?name=${project.owner.firstName}+${project.owner.lastName}&background=6366f1&color=ffffff&size=64`
                        }
                        alt={`${project.owner.firstName} ${project.owner.lastName}`}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-primary-500/30 group-hover:border-primary-500 transition-colors"
                        onError={(e) => {
                          // Fallback to UI avatars if image fails
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${project.owner.firstName}+${project.owner.lastName}&background=6366f1&color=ffffff&size=64`;
                        }}
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <Link
                        to={`/user/${project.owner._id}`}
                        className="block group"
                      >
                        <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors mb-1">
                          {project.owner.firstName} {project.owner.lastName}
                        </h4>
                      </Link>
                      {project.owner.username && (
                        <Link
                          to={`/user/${project.owner._id}`}
                          className="block group"
                        >
                          <p className="text-primary-400 text-sm mb-2 group-hover:text-primary-300 transition-colors">@{project.owner.username}</p>
                        </Link>
                      )}
                      
                      {project.owner.profile?.rating && (
                        <div className="flex items-center mb-2">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-yellow-400 font-medium">{project.owner.profile.rating}</span>
                        </div>
                      )}
                      
                      {project.owner.location && (
                        <p className="text-gray-400 text-sm flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {project.owner.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {project.owner.bio && (
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      {project.owner.bio}
                    </p>
                  )}

                  {!isOwner && (
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 btn-primary text-sm">
                        Contact Owner
                      </button>
                      <Link to={`/user/${project.owner._id}`} className="btn-secondary text-sm">
                        View Profile
                      </Link>
                    </div>
                  )}
                </div>

                {/* Project Stats */}
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Project Stats</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Views</span>
                      <span className="text-white font-medium">{project.views}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Likes</span>
                      <span className="text-white font-medium">{project.likesCount}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Type</span>
                      <span className="text-white font-medium">{project.type}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Difficulty</span>
                      <span className="text-white font-medium">{project.difficulty}</span>
                    </div>
                  </div>

                  {!isOwner && project.status === 'active' && project.type === 'freelance' && (
                    <button className="w-full btn-primary mt-6">
                      Apply to Project
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Image Gallery Modal */}
      {project && (
        <ImageGalleryModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          images={[
            ...(project.images?.map(img => ({ url: img, type: 'image' as const })) || []),
            ...(project.videos?.map(vid => ({ url: vid, type: 'video' as const })) || [])
          ]}
          initialIndex={currentImageIndex}
          autoRotate={false}
          author={{
            username: `${project.owner.firstName} ${project.owner.lastName}`,
            avatar: project.owner.avatar ?
              `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${project.owner.avatar}` :
              `https://ui-avatars.com/api/?name=${project.owner.firstName}+${project.owner.lastName}&background=6366f1&color=ffffff&size=32`
          }}
        />
      )}

      {/* Edit Project Modal */}
      {project && showEditModal && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditProject}
          project={project}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project?.title}"? This action cannot be undone and all project data will be permanently lost.`}
        itemName={project?.title}
        loading={deleting}
      />
    </div>
  );
};

export default ProjectDetail;