# KolTech Line - Professional Social Platform API Documentation

## Overview
KolTech Line is a comprehensive social platform for freelancers, startups, entrepreneurs, and investors. It provides real-time communication, video conferencing, and professional networking capabilities.

## 🏗️ Architecture

### Core Components
- **Walls/Communities**: Topic-based discussion spaces
- **Real-time Messaging**: Live chat with 200k+ participant support
- **Kolophone Video Calls**: WebRTC-based video conferencing (up to 50+ participants)
- **Contact Management**: Professional networking with friend requests
- **Notification System**: Comprehensive notification management
- **File Upload System**: Media attachments with image processing
- **Advanced Search**: Full-text search across all platform content

## 🚀 Quick Start

### Prerequisites
```bash
# Install dependencies
cd server && npm install
cd ../client && npm install
```

### Required Environment Variables
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/koltech

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=5005
NODE_ENV=development
```

### Start Development
```bash
# Backend (Terminal 1)
cd server && npm run dev

# Frontend (Terminal 2)
cd client && npm run dev
```

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register          # Email/password registration
POST /api/auth/register-anonymous # LTMROW registration
POST /api/auth/login             # Login (email/username/LTMROW)
POST /api/auth/logout            # Logout
GET  /api/auth/me                # Get current user
```

### Walls Management
```
GET    /api/walls                # Get all walls (with filtering)
POST   /api/walls                # Create new wall [AUTH]
GET    /api/walls/:id            # Get wall details
POST   /api/walls/:id/join       # Join wall [AUTH]
POST   /api/walls/:id/leave      # Leave wall [AUTH]
PUT    /api/walls/:id            # Update wall [ADMIN]
DELETE /api/walls/:id            # Delete wall [CREATOR]
GET    /api/walls/my-walls       # Get user's walls [AUTH]

# Wall Administration
GET    /api/walls/:id/requests                   # Get join requests [ADMIN]
POST   /api/walls/:id/requests/:requestId/respond # Approve/reject requests [ADMIN]
POST   /api/walls/:id/promote/:userId            # Promote to admin [ADMIN]
DELETE /api/walls/:id/members/:userId            # Remove member [ADMIN]
```

### Messages & Posts
```
POST   /api/messages                    # Create wall post [AUTH]
GET    /api/messages/wall/:wallId       # Get wall messages
POST   /api/messages/:id/like           # Like/unlike message [AUTH]
POST   /api/messages/:id/comments       # Add comment [AUTH]
GET    /api/messages/:id/comments       # Get comments
PUT    /api/messages/:id               # Edit message [AUTHOR]
DELETE /api/messages/:id               # Delete message [AUTHOR/ADMIN]
POST   /api/messages/:id/pin           # Pin message [ADMIN]
POST   /api/messages/:id/report        # Report message [AUTH]
```

### Contacts & Networking
```
POST   /api/contacts/request           # Send contact request [AUTH]
POST   /api/contacts/:id/respond       # Respond to request [AUTH]
GET    /api/contacts                   # Get contacts [AUTH]
DELETE /api/contacts/:id              # Remove contact [AUTH]
POST   /api/contacts/block/:userId     # Block user [AUTH]
POST   /api/contacts/unblock/:userId   # Unblock user [AUTH]
GET    /api/contacts/status/:userId    # Get connection status [AUTH]
GET    /api/contacts/search            # Search users [AUTH]
```

### Private & Group Chats
```
POST   /api/chats/private             # Create/get private chat [AUTH]
POST   /api/chats/group               # Create group chat [AUTH]
GET    /api/chats                     # Get user's chats [AUTH]
GET    /api/chats/:id/messages        # Get chat messages [AUTH]
POST   /api/chats/:id/messages        # Send message [AUTH]
POST   /api/chats/:id/read            # Mark as read [AUTH]
POST   /api/chats/:id/participants    # Add participants [ADMIN]
POST   /api/chats/:id/leave           # Leave chat [AUTH]
```

### Kolophone Video Calls
```
POST   /api/kolophone/start           # Start video call [AUTH]
POST   /api/kolophone/:callId/join    # Join call [AUTH]
POST   /api/kolophone/:callId/leave   # Leave call [AUTH]
POST   /api/kolophone/:callId/end     # End call [INITIATOR]
GET    /api/kolophone/:callId         # Get call details [AUTH]
GET    /api/kolophone/active          # Get active calls [AUTH]
GET    /api/kolophone/history         # Get call history [AUTH]
PUT    /api/kolophone/:callId/settings # Update settings [INITIATOR]
GET    /api/kolophone/stats           # Get call statistics [AUTH]
```

### Notifications
```
GET    /api/notifications             # Get notifications [AUTH]
PUT    /api/notifications/:id/read    # Mark as read [AUTH]
PUT    /api/notifications/read-all    # Mark all as read [AUTH]
DELETE /api/notifications/:id         # Delete notification [AUTH]
GET    /api/notifications/preferences # Get preferences [AUTH]
PUT    /api/notifications/preferences # Update preferences [AUTH]
GET    /api/notifications/unread-count # Get unread count [AUTH]
DELETE /api/notifications/clear-old   # Clear old notifications [AUTH]
```

### Tags Management
```
GET    /api/tags                     # Get all tags
GET    /api/tags/popular             # Get popular tags
GET    /api/tags/trending            # Get trending tags
GET    /api/tags/search              # Search tags
POST   /api/tags/related             # Get related tags
GET    /api/tags/stats               # Get tag statistics
POST   /api/tags                     # Create/update tag [AUTH]
GET    /api/tags/:identifier         # Get tag by name/slug
PUT    /api/tags/:id                 # Update tag [ADMIN]
DELETE /api/tags/:id                 # Delete tag [ADMIN]
```

### File Uploads
```
POST   /api/files/image              # Upload image [AUTH]
POST   /api/files/avatar             # Upload avatar [AUTH]
POST   /api/files/video              # Upload video [AUTH]
POST   /api/files/document           # Upload document [AUTH]
POST   /api/files/multiple/:type     # Upload multiple files [AUTH]
DELETE /api/files/:filename          # Delete file [AUTH]
GET    /api/files/info/:filename     # Get file info
GET    /api/files/config             # Get upload configuration
```

### Search & Discovery
```
GET    /api/search/global            # Global search
POST   /api/search/advanced          # Advanced search with filters
GET    /api/search/suggestions       # Get search suggestions
GET    /api/search/trending          # Get trending searches
```

## 🏠 Default Walls

### Freelance Hub
- **Category**: `freelance`
- **Subcategories**: Frontend, Backend, Mobile, DevOps
- **Members**: Up to 50,000
- **Features**: Open posting, Kolophone enabled

### Startup Valley
- **Category**: `startups`
- **Focus**: Entrepreneurship, crowdfunding, innovation
- **Members**: Up to 75,000
- **Features**: Open posting, investor connections

### Investment Zone
- **Category**: `investments`
- **Focus**: Professional investor network
- **Members**: Up to 25,000
- **Features**: Approval required, admin-only Kolophone

## 🔐 Authentication & Authorization

### User Roles
- **User**: Basic platform access
- **Freelancer**: Enhanced profile features
- **Startup**: Startup-specific tools
- **Admin**: Platform administration

### Permission Levels
- **Public**: View walls and messages
- **Authenticated**: Post, like, comment, create walls
- **Member**: Wall-specific permissions
- **Admin**: Wall administration
- **Creator**: Full wall control

## 📱 Real-Time Features

### WebSocket Events

#### Wall Events
```javascript
// Join wall for updates
socket.emit('join_wall', wallId);

// Real-time message posting
socket.on('new_wall_message', (data) => {
  // Handle new message
});

// Typing indicators
socket.emit('wall_message_typing', { wallId, isTyping: true });
```

#### Chat Events
```javascript
// Join chat
socket.emit('join_chat', chatId);

// Send message
socket.emit('chat_typing_start', chatId);
socket.on('new_message', (data) => {
  // Handle new message
});
```

#### Kolophone Events
```javascript
// Start video call
socket.emit('kolophone_start_call', {
  type: 'wall', // 'private' | 'group'
  targetId: wallId,
  callId: 'unique-call-id'
});

// WebRTC signaling
socket.emit('kolophone_offer', { callId, offer, targetUserId });
socket.emit('kolophone_answer', { callId, answer, targetUserId });
socket.emit('kolophone_ice_candidate', { callId, candidate });
```

## 🎯 Key Features

### 1. Wall Management
- Create topic-based communities
- Role-based permissions (public/members/admins)
- Join requests for private walls
- Tag-based categorization
- Member administration

### 2. Real-Time Messaging
- Live message posting
- Like/unlike with real-time updates
- Comment threads
- File attachments (images, videos, documents)
- Message pinning and moderation

### 3. Professional Networking
- Contact requests and management
- Private messaging
- Group chats (up to 200k participants)
- User search and discovery
- Connection status tracking

### 4. Kolophone Video Calling
- WebRTC-based video conferencing
- Wall-level calls (public/member)
- Private 1-on-1 calls
- Group video conferences
- Call history and statistics

### 5. Advanced Search
- Global full-text search
- Category-based filtering
- Tag-based discovery
- User search with skills
- Trending content detection

### 6. Notification System
- Granular notification preferences
- Real-time push notifications
- Email notifications
- Notification history
- Read/unread status management

## 🔧 Technical Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** REST API
- **Socket.IO** for real-time features
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Multer** + **Sharp** for file processing
- **Joi** validation
- **Nodemailer** for emails

### Frontend
- **React** with TypeScript
- **Vite** build tool
- **Tailwind CSS** styling
- **Zustand** state management
- **Lucide React** icons

### Features
- **WebRTC** video calling
- **Real-time messaging**
- **File upload with processing**
- **Advanced search and filtering**
- **Comprehensive notification system**

## 🚀 Deployment Notes

### Production Considerations
1. **Database Scaling**: Consider MongoDB sharding for large user bases
2. **Media Storage**: Implement cloud storage (AWS S3) for file uploads
3. **WebRTC Scaling**: Use media servers (Janus, Kurento) for large video calls
4. **Search Optimization**: Consider Elasticsearch for advanced search
5. **Caching**: Implement Redis for session management and caching
6. **CDN**: Use CDN for static assets and media files

### Security Features
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- File type and size restrictions
- SQL injection prevention
- XSS protection

## 📊 Database Schema

### Collections
- `users` - User profiles and authentication
- `walls` - Community/topic spaces
- `messages` - Posts and comments
- `contacts` - Friend relationships
- `chats` - Private and group conversations
- `notifications` - User notifications
- `tags` - Content categorization
- `kolophone` - Video call records
- `walljoinrequests` - Wall membership requests

### Indexes
- Text search indexes on content fields
- Compound indexes for efficient queries
- User-specific indexes for fast lookups
- Date-based indexes for timeline queries

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Dark theme throughout
- Gradient accents (primary/accent-purple)
- Smooth animations and transitions

### Accessibility
- Keyboard navigation support
- Screen reader compatible
- High contrast ratios
- Clear visual hierarchy

### User Experience
- Contextual authentication prompts
- Real-time updates without page refresh
- Intuitive navigation and filtering
- Professional networking focus

This comprehensive platform provides all the tools needed for professional collaboration, networking, and community building in the modern digital workspace.