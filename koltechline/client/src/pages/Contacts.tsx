import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Users, 
  Search, 
  Phone, 
  MessageCircle, 
  Check, 
  X, 
  Shield,
  Clock,
  User
} from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { contactApi, chatApi } from '../utils/api';

interface Contact {
  _id: string;
  requester: any;
  recipient: any;
  status: 'pending' | 'accepted' | 'blocked' | 'declined';
  note?: string;
  createdAt: string;
}

const Contacts = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'contacts' | 'pending' | 'search'>('contacts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadContacts();
      loadPendingRequests();
    }
  }, [isAuthenticated]);

  const loadContacts = async () => {
    try {
      const response = await contactApi.getContacts('accepted');
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await contactApi.getContacts('pending');
      setPendingRequests(response.data.contacts);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;

    try {
      const response = await contactApi.searchUsers(searchQuery);
      setSearchResults(response.data.users);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSendRequest = async (userId: string) => {
    const note = prompt('Add a note to your contact request (optional):');
    try {
      await contactApi.sendRequest(userId, note || undefined);
      alert('Contact request sent successfully!');
      
      // Update search results to reflect sent status
      setSearchResults(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, contactStatus: 'pending' }
          : user
      ));
    } catch (error) {
      console.error('Error sending contact request:', error);
      alert('Error sending contact request. Please try again.');
    }
  };

  const handleRespondToRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      await contactApi.respondToRequest(requestId, action);
      
      if (action === 'accept') {
        // Move from pending to contacts
        const request = pendingRequests.find(r => r._id === requestId);
        if (request) {
          setContacts(prev => [...prev, request]);
        }
      }
      
      // Remove from pending
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      
      alert(`Contact request ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing contact request:`, error);
      alert(`Error ${action}ing request. Please try again.`);
    }
  };

  const handleStartChat = async (contactUserId: string) => {
    console.log('🚀 Starting chat with contact:', contactUserId);
    try {
      const response = await chatApi.createPrivateChat(contactUserId);
      console.log('📥 Chat created:', response);
      
      if (response?.data?.chat?._id) {
        console.log('✅ Navigating to chat:', response.data.chat._id);
        navigate(`/chat/${response.data.chat._id}`);
      } else {
        console.error('❌ Invalid chat response:', response);
        alert('Error starting chat. Invalid response.');
      }
    } catch (error: any) {
      console.error('❌ Error starting chat:', error);
      alert(`Error starting chat: ${error.message || 'Please try again.'}`);
    }
  };

  const getContactDisplayName = (contact: Contact) => {
    const otherUser = contact.requester._id === user?._id ? contact.recipient : contact.requester;
    return `${otherUser.firstName} ${otherUser.lastName}`.trim() || otherUser.username;
  };

  const getContactAvatar = (contact: Contact) => {
    const otherUser = contact.requester._id === user?._id ? contact.recipient : contact.requester;
    return otherUser.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
            <p className="text-gray-400">Please log in to manage your contacts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
            <p className="text-gray-400">Manage your professional network on KolTech</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for professionals by name, username, or email..."
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-dark-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'contacts'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>My Contacts ({contacts.length})</span>
              </button>
              
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'pending'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Pending ({pendingRequests.length})</span>
              </button>
              
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'search'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Find People</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-6">
            {/* My Contacts */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No contacts yet</h3>
                    <p className="text-gray-400">Start building your professional network by searching for people above.</p>
                  </div>
                ) : (
                  contacts.map(contact => (
                    <div key={contact._id} className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={getContactAvatar(contact)}
                            alt={getContactDisplayName(contact)}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-white font-semibold">{getContactDisplayName(contact)}</h3>
                            <p className="text-gray-400 text-sm">Connected since {new Date(contact.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleStartChat(contact.requester._id === user?._id ? contact.recipient._id : contact.requester._id)}
                            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                            title="Start Chat"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          
                          <button
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            title="Voice Call"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Requests */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No pending requests</h3>
                    <p className="text-gray-400">You'll see contact requests from other professionals here.</p>
                  </div>
                ) : (
                  pendingRequests.map(request => (
                    <div key={request._id} className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={request.requester.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'}
                            alt={`${request.requester.firstName} ${request.requester.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-white font-semibold">
                              {`${request.requester.firstName} ${request.requester.lastName}`.trim() || request.requester.username}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Sent {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            {request.note && (
                              <p className="text-gray-300 text-sm mt-1 italic">"{request.note}"</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleRespondToRequest(request._id, 'accept')}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleRespondToRequest(request._id, 'decline')}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Decline"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Search Results */}
            {activeTab === 'search' && (
              <div className="space-y-4">
                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Find Professionals</h3>
                    <p className="text-gray-400">Search for professionals to add to your network.</p>
                  </div>
                ) : (
                  searchResults.map(searchUser => (
                    <div key={searchUser._id} className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={searchUser.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'}
                            alt={`${searchUser.firstName} ${searchUser.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-white font-semibold">
                              {`${searchUser.firstName} ${searchUser.lastName}`.trim() || searchUser.username}
                            </h3>
                            {searchUser.username && (
                              <p className="text-gray-400 text-sm">@{searchUser.username}</p>
                            )}
                            {searchUser.bio && (
                              <p className="text-gray-300 text-sm mt-1">{searchUser.bio}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {searchUser.contactStatus === 'none' && (
                            <button
                              onClick={() => handleSendRequest(searchUser._id)}
                              className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>Connect</span>
                            </button>
                          )}
                          
                          {searchUser.contactStatus === 'pending' && (
                            <span className="flex items-center space-x-2 text-yellow-400 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>Request Sent</span>
                            </span>
                          )}
                          
                          {searchUser.contactStatus === 'accepted' && (
                            <span className="flex items-center space-x-2 text-green-400 text-sm">
                              <Check className="w-4 h-4" />
                              <span>Connected</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;