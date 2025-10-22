import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { fileApi } from '../../utils/api';
import toast from 'react-hot-toast';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProject: any) => void;
  project: {
    _id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    tags: string[];
    skills: string[];
    images?: string[];
    videos?: string[];
    externalLinks?: { title: string; url: string; }[];
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
      currency: string;
      deadline: string;
    };
    visibility: string;
    location?: string;
    urgency: string;
    difficulty: string;
  };
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web_development',
    type: 'internal',
    tags: [] as string[],
    skills: [] as string[],
    images: [] as string[],
    videos: [] as string[],
    externalLinks: [] as { title: string; url: string; }[],
    budget: {
      type: 'fixed',
      amount: 0,
      currency: 'USD',
      hourlyRate: undefined as number | undefined
    },
    timeline: {
      startDate: undefined as string | undefined,
      endDate: undefined as string | undefined,
      estimatedHours: undefined as number | undefined
    },
    funding: {
      goal: 0,
      currency: 'USD',
      deadline: ''
    },
    visibility: 'public',
    location: '',
    urgency: 'medium',
    difficulty: 'intermediate'
  });

  const [newTag, setNewTag] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || 'web_development',
        type: project.type || 'internal',
        tags: project.tags || [],
        skills: project.skills || [],
        images: project.images || [],
        videos: project.videos || [],
        externalLinks: project.externalLinks || [],
        budget: {
          type: project.budget?.type || 'fixed',
          amount: project.budget?.amount || 0,
          currency: project.budget?.currency || 'USD',
          hourlyRate: project.budget?.hourlyRate || undefined
        },
        timeline: {
          startDate: project.timeline?.startDate || undefined,
          endDate: project.timeline?.endDate || undefined,
          estimatedHours: project.timeline?.estimatedHours || undefined
        },
        funding: project.funding || {
          goal: 0,
          currency: 'USD',
          deadline: ''
        },
        visibility: project.visibility || 'public',
        location: project.location || '',
        urgency: project.urgency || 'medium',
        difficulty: project.difficulty || 'intermediate'
      });
    }
  }, [project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (files: FileList, type: 'image' | 'video') => {
    if (!files.length) return;

    const currentFiles = type === 'image' ? formData.images : formData.videos;
    if (currentFiles.length + files.length > 7) {
      toast.error(`Can only upload up to 7 ${type}s`);
      return;
    }

    setUploading(true);
    const uploadedFiles: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const response = type === 'image' 
          ? await fileApi.uploadImage(file)
          : await fileApi.uploadVideo(file);
        
        if (response.success) {
          uploadedFiles.push(response.data.path);
        }
      }

      setFormData(prev => ({
        ...prev,
        [type === 'image' ? 'images' : 'videos']: [...currentFiles, ...uploadedFiles]
      }));

      toast.success(`${uploadedFiles.length} ${type}(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(`Failed to upload ${type}: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number, type: 'image' | 'video') => {
    const key = type === 'image' ? 'images' : 'videos';
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addExternalLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        externalLinks: [...prev.externalLinks, { ...newLink }]
      }));
      setNewLink({ title: '', url: '' });
    }
  };

  const removeExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        ...formData,
        // Only include non-empty optional fields
        ...(formData.location?.trim() && { location: formData.location.trim() }),
        ...(formData.budget.amount > 0 && { budget: formData.budget }),
        ...(formData.timeline.estimatedHours && { timeline: formData.timeline }),
        ...(formData.funding.goal > 0 && formData.type === 'crowdfunding' && { funding: formData.funding })
      };

      const response = await import('../../utils/api').then(api => 
        api.projectApi.updateProject(project._id, updateData)
      );

      if (response.success) {
        toast.success('Project updated successfully');
        onSuccess(response.data.project);
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="glass-effect-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500/20 rounded-lg mr-3">
              <Plus className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Edit Project</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-primary"
                  required
                >
                  <option value="web_development">Web Development</option>
                  <option value="mobile_app">Mobile App</option>
                  <option value="ai_ml">AI/ML</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="iot">IoT</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-primary h-32 resize-none"
                placeholder="Describe your project in detail"
                required
              />
            </div>

            {/* Project Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="internal">Internal</option>
                  <option value="freelance">Freelance</option>
                  <option value="crowdfunding">Crowdfunding</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-primary-300 hover:text-primary-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="input-primary flex-1"
                  placeholder="Add tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-accent-purple/20 text-accent-purple px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-accent-purple/70 hover:text-accent-purple"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="input-primary flex-1"
                  placeholder="Add skill"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-secondary"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* External Links */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                External Links
              </label>
              <div className="space-y-2 mb-4">
                {formData.externalLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 bg-dark-700 p-3 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{link.title}</div>
                      <div className="text-gray-400 text-xs">{link.url}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExternalLink(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  className="input-primary"
                  placeholder="Link title"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    className="input-primary flex-1"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={addExternalLink}
                    className="btn-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Images ({formData.images.length}/7)
                </label>
                <div className="space-y-2">
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'image')}
                      className="hidden"
                      disabled={uploading || formData.images.length >= 7}
                    />
                    <div className="border-2 border-dashed border-dark-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 transition-colors">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">Upload Images</p>
                    </div>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`http://localhost:5005${image}`}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'image')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Videos */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Videos ({formData.videos.length}/7)
                </label>
                <div className="space-y-2">
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'video')}
                      className="hidden"
                      disabled={uploading || formData.videos.length >= 7}
                    />
                    <div className="border-2 border-dashed border-dark-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 transition-colors">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-400">Upload Videos</p>
                    </div>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video
                          src={`http://localhost:5005${video}`}
                          className="w-full h-20 object-cover rounded-lg"
                          muted
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'video')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="invited_only">Invited Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-primary"
                  placeholder="Project location"
                />
              </div>
            </div>

            {/* Budget (if freelance) */}
            {formData.type === 'freelance' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Budget Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Budget Type
                    </label>
                    <select
                      name="budget.type"
                      value={formData.budget.type}
                      onChange={handleInputChange}
                      className="input-primary"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="hourly">Hourly Rate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="budget.amount"
                      value={formData.budget.amount}
                      onChange={handleInputChange}
                      className="input-primary"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      name="budget.currency"
                      value={formData.budget.currency}
                      onChange={handleInputChange}
                      className="input-primary"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-dark-600">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading || uploading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update Project'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProjectModal;