import React, { useState } from 'react';
import { X, Plus, Hash, Users, Globe, Lock, Settings } from 'lucide-react';
import Modal from './Modal';

interface CreateWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wallData: any) => void;
}

const CreateWallModal: React.FC<CreateWallModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'custom',
    tags: [] as string[],
    isPublic: true,
    allowKolophone: true,
    allowMemberKolophone: false,
    requireApproval: false,
    allowInvites: true,
    maxMembers: 200000,
    postPermissions: 'members',
    commentPermissions: 'members'
  });

  const [newTag, setNewTag] = useState('');

  const categories = [
    { id: 'freelance', name: 'Freelance', description: 'For freelance projects and opportunities' },
    { id: 'startups', name: 'Startups', description: 'For startup communities and crowdfunding' },
    { id: 'investments', name: 'Investments', description: 'For investors and investment opportunities' },
    { id: 'technology', name: 'Technology', description: 'For tech discussions and innovations' },
    { id: 'custom', name: 'Custom', description: 'Create your own category' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;
    
    onSubmit(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'custom',
      tags: [],
      isPublic: true,
      allowKolophone: true,
      allowMemberKolophone: false,
      requireApproval: false,
      allowInvites: true,
      maxMembers: 200000,
      postPermissions: 'members',
      commentPermissions: 'members'
    });
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-dark-800 rounded-2xl border border-primary-500/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Wall</h2>
                <p className="text-gray-400 text-sm">Build your community around shared interests</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>

            {/* Wall Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wall Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter wall name..."
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your wall's purpose and community..."
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors h-24 resize-none"
                maxLength={500}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map(category => (
                  <label
                    key={category.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.category === category.id
                        ? 'bg-primary-500/20 border-primary-500 text-white'
                        : 'bg-dark-700 border-dark-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={formData.category === category.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs opacity-70">{category.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add tags..."
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 bg-accent-purple/20 text-accent-purple px-3 py-1 rounded-full text-sm"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy & Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Privacy & Permissions</span>
            </h3>

            {/* Privacy Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-primary-500 border-gray-600 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="text-white font-medium">Public Wall</div>
                  <div className="text-gray-400 text-xs">Anyone can discover and join</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireApproval}
                  onChange={(e) => setFormData(prev => ({ ...prev, requireApproval: e.target.checked }))}
                  className="w-4 h-4 text-primary-500 border-gray-600 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="text-white font-medium">Require Approval</div>
                  <div className="text-gray-400 text-xs">Admins must approve new members</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowKolophone}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowKolophone: e.target.checked }))}
                  className="w-4 h-4 text-primary-500 border-gray-600 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="text-white font-medium">Allow Kolophone</div>
                  <div className="text-gray-400 text-xs">Enable video calls in this wall</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowMemberKolophone}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowMemberKolophone: e.target.checked }))}
                  className="w-4 h-4 text-primary-500 border-gray-600 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="text-white font-medium">Members Can Start Calls</div>
                  <div className="text-gray-400 text-xs">Allow any member to start Kolophone</div>
                </div>
              </label>
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Members
              </label>
              <select
                value={formData.maxMembers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value={100}>100 members</option>
                <option value={500}>500 members</option>
                <option value={1000}>1,000 members</option>
                <option value={5000}>5,000 members</option>
                <option value={10000}>10,000 members</option>
                <option value={50000}>50,000 members</option>
                <option value={200000}>200,000 members</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-dark-700 border border-dark-600 text-gray-300 rounded-lg hover:bg-dark-600 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.description.trim()}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-purple text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Create Wall
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWallModal;