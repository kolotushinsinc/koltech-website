import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Calendar, DollarSign, Eye, Heart, Users,
  Clock, Target, Briefcase, ExternalLink
} from 'lucide-react';
import { projectApi } from '../../utils/api';
import CreateProjectModal from '../../components/ui/CreateProjectModal';
import toast from 'react-hot-toast';

interface Project {
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
  };
  timeline?: {
    startDate?: string;
    endDate?: string;
  };
  views: number;
  likesCount: number;
  urgency: string;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (page = 1, reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setHasMoreProjects(true);
      } else {
        setLoadingMore(true);
      }

      const response = await projectApi.getMyProjects({
        page,
        limit: 6 // Load 6 projects per page
      });

      if (response.success) {
        const newProjects = response.data.projects || [];
        
        if (reset) {
          setProjects(newProjects);
        } else {
          setProjects(prev => [...prev, ...newProjects]);
        }

        // Update pagination state
        setCurrentPage(page);
        setTotalProjects(response.pagination?.total || 0);
        setHasMoreProjects(
          response.pagination ? page < response.pagination.pages : false
        );
      } else {
        toast.error('Failed to load projects');
      }
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProjects = () => {
    if (loadingMore || !hasMoreProjects) return;
    fetchProjects(currentPage + 1, false);
  };

  const handleProjectCreated = () => {
    fetchProjects(1, true); // Reset to first page and reload
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="glass-effect-dark rounded-2xl p-6">
        <div className="text-center py-8">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-effect-dark rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Projects</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start building your portfolio by creating your first project. Share your work, attract clients, and showcase your skills.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">
                Showing {projects.length} of {totalProjects} projects
              </p>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-dark-800/50 rounded-xl overflow-hidden hover:bg-dark-800/70 transition-colors border border-dark-700 hover:border-primary-500/30"
                >
                {/* Main Image Preview */}
                {project.images && project.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${project.images[0]}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-dark-800/80 text-white px-2 py-1 rounded-full text-xs">
                      {project.images.length} images
                      {project.videos && project.videos.length > 0 && ` • ${project.videos.length} videos`}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/project/${project._id}`}
                          className="text-xl font-bold text-white hover:text-primary-400 transition-colors"
                        >
                          {project.title}
                        </Link>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className={`flex items-center ${getCategoryColor(project.category)}`}>
                          <Briefcase className="w-4 h-4 mr-1" />
                          {project.category.replace('_', ' ')}
                        </span>
                        
                        {project.budget && (
                          <span className="flex items-center text-accent-green">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {project.budget.currency} {(project.budget.amount || 0).toLocaleString()}
                          </span>
                        )}
                        
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {project.views}
                        </span>
                        
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {project.likesCount}
                        </span>
                        
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/project/${project._id}`}
                      className="btn-ghost text-sm flex items-center ml-4"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </div>

                  {/* External Links */}
                  {project.externalLinks && project.externalLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.externalLinks.slice(0, 3).map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full hover:bg-blue-500/30 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {link.title}
                        </a>
                      ))}
                      {project.externalLinks.length > 3 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{project.externalLinks.length - 3} more links
                        </span>
                      )}
                    </div>
                  )}

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {project.tags.length > 5 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{project.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreProjects && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMoreProjects}
                  disabled={loadingMore}
                  className={`px-8 py-3 rounded-xl transition-all ${
                    loadingMore
                      ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white border border-dark-600 hover:border-primary-500/50'
                  }`}
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading more projects...
                    </div>
                  ) : (
                    `Load More Projects (${totalProjects - projects.length} remaining)`
                  )}
                </button>
              </div>
            )}

            {!hasMoreProjects && projects.length > 6 && (
              <div className="text-center pt-6">
                <p className="text-gray-500 text-sm">You've reached the end of your projects</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
};

export default Projects;