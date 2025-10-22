import React, { useState } from 'react';
import { X, Plus, DollarSign, Calendar, Target, Settings, Upload, Link2, Trash2, Image, Video } from 'lucide-react';
import { projectApi, fileApi } from '../../utils/api';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web_development',
    type: 'internal',
    tags: '',
    skills: '',
    visibility: 'public',
    location: '',
    urgency: 'medium',
    difficulty: 'intermediate',
    // Budget fields
    budgetType: 'fixed',
    budgetAmount: '',
    currency: 'USD',
    hourlyRate: '',
    // Timeline fields
    startDate: '',
    endDate: '',
    estimatedHours: '',
    // Crowdfunding fields
    fundingGoal: '',
    fundingDeadline: '',
    fundingTiers: [],
    // Media fields
    externalLinks: [{ title: '', url: '' }]
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const projectData: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        images: uploadedImages,
        videos: uploadedVideos,
        externalLinks: formData.externalLinks.filter(link => link.title && link.url),
        visibility: formData.visibility,
        location: formData.location || undefined,
        urgency: formData.urgency,
        difficulty: formData.difficulty
      };

      // Add budget if provided
      if (formData.budgetAmount) {
        projectData.budget = {
          type: formData.budgetType,
          amount: Number(formData.budgetAmount),
          currency: formData.currency
        };

        if (formData.budgetType === 'hourly' && formData.hourlyRate) {
          projectData.budget.hourlyRate = Number(formData.hourlyRate);
        }
      }

      // Add timeline if provided
      if (formData.startDate || formData.endDate || formData.estimatedHours) {
        projectData.timeline = {};
        if (formData.startDate) projectData.timeline.startDate = new Date(formData.startDate);
        if (formData.endDate) projectData.timeline.endDate = new Date(formData.endDate);
        if (formData.estimatedHours) projectData.timeline.estimatedHours = Number(formData.estimatedHours);
      }

      // Add crowdfunding data if applicable
      if (formData.type === 'crowdfunding' && formData.fundingGoal) {
        projectData.funding = {
          goal: Number(formData.fundingGoal),
          currency: formData.currency,
          deadline: new Date(formData.fundingDeadline),
          tiers: []
        };
      }

      const response = await projectApi.createProject(projectData);

      if (response.success) {
        toast.success('Project created successfully!');
        onProjectCreated();
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'web_development',
          type: 'internal',
          tags: '',
          skills: '',
          visibility: 'public',
          location: '',
          urgency: 'medium',
          difficulty: 'intermediate',
          budgetType: 'fixed',
          budgetAmount: '',
          currency: 'USD',
          hourlyRate: '',
          startDate: '',
          endDate: '',
          estimatedHours: '',
          fundingGoal: '',
          fundingDeadline: '',
          fundingTiers: [],
          externalLinks: [{ title: '', url: '' }]
        });
        setUploadedImages([]);
        setUploadedVideos([]);
      } else {
        toast.error(response.message || 'Failed to create project');
      }
    } catch (error: any) {
      console.error('Create project error:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check limits
    if (uploadedImages.length + files.length > 7) {
      toast.error('Maximum 7 images allowed');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not a valid image file`);
        }
        const response = await fileApi.uploadImage(file);
        if (response.success) {
          return response.data.path;
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      });

      const uploadedPaths = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploadedPaths]);
      toast.success(`${uploadedPaths.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check limits
    if (uploadedVideos.length + files.length > 7) {
      toast.error('Maximum 7 videos allowed');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('video/')) {
          throw new Error(`${file.name} is not a valid video file`);
        }
        const response = await fileApi.uploadVideo(file);
        if (response.success) {
          return response.data.path;
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      });

      const uploadedPaths = await Promise.all(uploadPromises);
      setUploadedVideos(prev => [...prev, ...uploadedPaths]);
      toast.success(`${uploadedPaths.length} video(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Video upload error:', error);
      toast.error(error.message || 'Failed to upload videos');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addExternalLink = () => {
    setFormData(prev => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { title: '', url: '' }]
    }));
  };

  const removeExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-dark-600">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500/20 rounded-lg mr-3">
              <Plus className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Create New Project</h2>
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                className="input-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project in detail..."
                rows={4}
                className="input-primary resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-primary"
                  required
                >
                  <option value="internal">Portfolio Project</option>
                  <option value="freelance">Freelance Work</option>
                  <option value="crowdfunding">Crowdfunding</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="react, javascript, frontend"
                  className="input-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  className="input-primary"
                />
              </div>
            </div>
          </div>

          {/* Project Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary-400" />
              Project Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Urgency</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location (optional)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Remote, New York, London..."
                className="input-primary"
              />
            </div>
          </div>

          {/* Budget Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-accent-green" />
              Budget (optional)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Budget Type</label>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {formData.budgetType === 'fixed' ? 'Total Budget' : 'Max Budget'}
                </label>
                <input
                  type="number"
                  name="budgetAmount"
                  value={formData.budgetAmount}
                  onChange={handleInputChange}
                  placeholder="5000"
                  className="input-primary"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="input-primary"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>

            {formData.budgetType === 'hourly' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  placeholder="50"
                  className="input-primary"
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-accent-purple" />
              Timeline (optional)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="input-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Hours</label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  placeholder="40"
                  className="input-primary"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Crowdfunding Section */}
          {formData.type === 'crowdfunding' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent-orange" />
                Crowdfunding Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal</label>
                  <input
                    type="number"
                    name="fundingGoal"
                    value={formData.fundingGoal}
                    onChange={handleInputChange}
                    placeholder="10000"
                    className="input-primary"
                    min="100"
                    required={formData.type === 'crowdfunding'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Deadline</label>
                  <input
                    type="date"
                    name="fundingDeadline"
                    value={formData.fundingDeadline}
                    onChange={handleInputChange}
                    className="input-primary"
                    required={formData.type === 'crowdfunding'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Upload className="w-5 h-5 mr-2 text-accent-blue" />
              Project Media
            </h3>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Images ({uploadedImages.length}/7)
              </label>
              <div className="space-y-3">
                {uploadedImages.length < 7 && (
                  <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-dark-600 rounded-xl hover:border-primary-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="text-center">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {uploading ? 'Uploading...' : 'Click to upload images (max 7)'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Select multiple files at once
                      </p>
                    </div>
                  </label>
                )}
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${image}`}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-dark-600"
                          onError={(e) => {
                            console.error('Image failed to load:', image);
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDJINUMzLjkgMiAzIDIuOSAzIDRWMjBDMyAyMS4xIDMuOSAyMiA1IDIySDIxQzIyLjEgMjIgMjMgMjEuMSAyMyAyMFY0QzIzIDIuOSAyMi4xIDIgMjEgMlpNNSA0SDIxVjE0TDE4IDE0TDE1IDE3TDkgMTFMMTQgNkgxNFY0WiIgZmlsbD0iIzRGNEY0RiIvPgo8L3N2Zz4K';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Videos ({uploadedVideos.length}/7)
              </label>
              <div className="space-y-3">
                {uploadedVideos.length < 7 && (
                  <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-dark-600 rounded-xl hover:border-primary-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {uploading ? 'Uploading...' : 'Click to upload videos (max 7)'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Select multiple files at once
                      </p>
                    </div>
                  </label>
                )}
                
                {uploadedVideos.length > 0 && (
                  <div className="space-y-2">
                    {uploadedVideos.map((video, index) => (
                      <div key={index} className="relative bg-dark-800/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Video className="w-4 h-4 text-accent-purple mr-2" />
                            <span className="text-white text-sm">Video {index + 1}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Video preview */}
                        <div className="mt-2">
                          <video
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${video}`}
                            className="w-full h-32 object-cover rounded border border-dark-600"
                            muted
                            onError={(e) => {
                              console.error('Video failed to load:', video);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* External Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">External Links</label>
                <button
                  type="button"
                  onClick={addExternalLink}
                  className="text-sm text-primary-400 hover:text-primary-300 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.externalLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-dark-800/30 rounded-lg">
                    <input
                      type="text"
                      placeholder="Link title (e.g., Live Demo)"
                      value={link.title}
                      onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                      className="input-primary"
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        className="input-primary flex-1"
                      />
                      {formData.externalLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExternalLink(index)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-dark-600">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;