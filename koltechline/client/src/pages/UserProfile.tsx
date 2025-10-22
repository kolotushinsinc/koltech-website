import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Star, Briefcase, Users,
  MessageCircle, UserPlus, Mail, Phone, Globe, 
  Award, TrendingUp, Target, Eye, Heart
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { userAPI, projectApi, contactApi, chatApi } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface UserProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: string;
  profile?: {
    rating?: number;
    completedProjects?: number;
    skills?: string[];
    portfolio?: {
      title: string;
      url: string;
    }[];
    social?: {
      website?: string;
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
  };
  isActive: boolean;
  lastSeen?: string;
  createdAt: string;
}

interface UserProject {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  images?: string[];
  tags: string[];
  views: number;
  likesCount: number;
  createdAt: string;
}

// Loading Skeleton Component
const UserProfileSkeleton = () => (
  <div className="min-h-screen bg-dark-900">
    <Header />
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <div className="h-4 bg-dark-600 rounded w-32 animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header Skeleton */}
          <motion.div
            className="glass-effect-dark rounded-2xl p-8 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-32 h-32 bg-dark-600 rounded-2xl animate-pulse"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-dark-600 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-dark-600 rounded w-1/2 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-dark-600 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-dark-600 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-24 h-8 bg-dark-600 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Skeleton */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-effect-dark rounded-2xl p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-4 bg-dark-600 rounded w-3/4"></div>
                    <div className="h-4 bg-dark-600 rounded w-1/2"></div>
                    <div className="h-32 bg-dark-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="glass-effect-dark rounded-2xl p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-4 bg-dark-600 rounded w-3/4"></div>
                    <div className="h-4 bg-dark-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserProjects();
      // Scroll to top when opening user profile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [userId]);

  useEffect(() => {
    if (user && authUser) {
      setIsOwnProfile(user._id === authUser._id);
    }
  }, [user, authUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUser(userId!);
      if (response.success) {
        setUser(response.data.user);
      } else {
        toast.error('User not found');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load user profile');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      setProjectsLoading(true);
      // We'll need to add a public user projects endpoint
      const response = await projectApi.getProjects({
        // For now, we'll show all public projects - we need to add user filter
        limit: 6
      });
      if (response.success) {
        // Filter by user ID client-side for now - ideally this should be server-side
        const filteredProjects = response.data.projects?.filter(
          (project: any) => project.owner._id === userId
        ) || [];
        setUserProjects(filteredProjects);
      }
    } catch (error: any) {
      console.error('Failed to fetch user projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!authUser) {
      toast.error('Please login to send messages');
      return;
    }

    try {
      const response = await chatApi.createPrivateChat(userId!);
      if (response.success) {
        navigate(`/chat/${response.data.chat._id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start chat');
    }
  };

  const handleAddContact = async () => {
    if (!authUser) {
      toast.error('Please login to add contacts');
      return;
    }

    try {
      await contactApi.sendRequest(userId!);
      toast.success('Contact request sent successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send contact request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      startup: 'text-purple-400',
      freelancer: 'text-blue-400', 
      investor: 'text-green-400',
      universal: 'text-orange-400',
      admin: 'text-red-400'
    };
    return colors[role] || 'text-gray-400';
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      startup: 'Стартапер',
      freelancer: 'Фрилансер',
      investor: 'Инвестор', 
      universal: 'Все везде и сразу',
      admin: 'Администратор'
    };
    return labels[role] || role;
  };

  if (loading) {
    return <UserProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Header />
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
            <Link to="/" className="btn-primary">
              Back to Home
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

          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              className="glass-effect-dark rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <img
                    src={user.avatar ? 
                      `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` : 
                      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=128`
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-primary-500/30"
                  />
                  {user.isActive && (
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-dark-800"></div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {user.firstName} {user.lastName}
                      </h1>
                      
                      {user.username && (
                        <p className="text-primary-400 text-lg mb-2">@{user.username}</p>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium bg-dark-700 ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>

                        {user.profile?.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-yellow-400 font-medium">{user.profile.rating}</span>
                          </div>
                        )}

                        {user.location && (
                          <div className="flex items-center text-gray-400">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{user.location}</span>
                          </div>
                        )}
                      </div>

                      {user.bio && (
                        <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
                          {user.bio}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Joined {formatDate(user.createdAt)}
                        </span>

                        {user.profile?.completedProjects && (
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {user.profile.completedProjects} projects
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!isOwnProfile && authUser && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleSendMessage}
                          className="btn-primary flex items-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </button>
                        <button
                          onClick={handleAddContact}
                          className="btn-secondary flex items-center"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Contact
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {user.profile?.skills && user.profile.skills.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-300 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.profile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-accent-purple/20 text-accent-purple px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content - Projects */}
              <div className="md:col-span-2">
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-primary-400" />
                    Public Projects
                  </h3>

                  {projectsLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-dark-700/50 rounded-xl p-4 animate-pulse">
                          <div className="space-y-3">
                            <div className="h-4 bg-dark-600 rounded w-3/4"></div>
                            <div className="h-20 bg-dark-600 rounded"></div>
                            <div className="flex gap-2">
                              {Array.from({ length: 3 }).map((_, j) => (
                                <div key={j} className="h-6 bg-dark-600 rounded w-16"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No public projects yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProjects.map((project) => (
                        <div
                          key={project._id}
                          className="bg-dark-700/50 rounded-xl p-4 hover:bg-dark-700/70 transition-colors border border-dark-600 hover:border-primary-500/30"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <Link
                              to={`/project/${project._id}`}
                              className="text-lg font-bold text-white hover:text-primary-400 transition-colors"
                            >
                              {project.title}
                            </Link>
                            <span className="text-xs text-gray-400">
                              {formatDate(project.createdAt)}
                            </span>
                          </div>

                          {project.images && project.images.length > 0 && (
                            <div className="mb-3">
                              <img
                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${project.images[0]}`}
                                alt={project.title}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}

                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {project.views}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {project.likesCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar - User Info */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
                  
                  <div className="space-y-3">
                    {user.profile?.social?.website && (
                      <a
                        href={user.profile.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        <Globe className="w-4 h-4 mr-3" />
                        Website
                      </a>
                    )}

                    {user.profile?.social?.linkedin && (
                      <a
                        href={user.profile.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}

                    {user.profile?.social?.github && (
                      <a
                        href={user.profile.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* Portfolio */}
                {user.profile?.portfolio && user.profile.portfolio.length > 0 && (
                  <div className="glass-effect-dark rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Portfolio</h3>
                    <div className="space-y-3">
                      {user.profile.portfolio.map((item, index) => (
                        <a
                          key={index}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-dark-700/50 p-3 rounded-lg hover:bg-dark-700/70 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{item.title}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Stats</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Projects</span>
                      <span className="text-white font-medium">{userProjects.length}</span>
                    </div>
                    
                    {user.profile?.completedProjects && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Completed</span>
                        <span className="text-accent-green font-medium">{user.profile.completedProjects}</span>
                      </div>
                    )}

                    {user.profile?.rating && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Rating</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-yellow-400 font-medium">{user.profile.rating}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-300">Member Since</span>
                      <span className="text-white font-medium">
                        {new Date(user.createdAt).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;