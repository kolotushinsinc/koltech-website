import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  
  const isLoggedIn = () => {
    return isAuthenticated && !!user && !!token;
  };

  const hasRole = (role: string | string[]) => {
    if (!isLoggedIn()) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user!.role);
  };

  const canCreateWalls = () => {
    return isLoggedIn() && hasRole(['user', 'freelancer', 'startup', 'admin']);
  };

  const canLikeContent = () => {
    return isLoggedIn();
  };

  const canCommentOnContent = () => {
    return isLoggedIn();
  };

  const canCreatePosts = () => {
    return isLoggedIn();
  };

  const canJoinWalls = () => {
    return isLoggedIn();
  };

  const canManageWall = (wallAdmins?: string[]) => {
    if (!isLoggedIn()) return false;
    if (hasRole('admin')) return true;
    if (wallAdmins && user) {
      return wallAdmins.includes(user._id);
    }
    return false;
  };

  const canReportContent = () => {
    return isLoggedIn();
  };

  const canStartKolophone = () => {
    return isLoggedIn();
  };

  const canSendPrivateMessages = () => {
    return isLoggedIn();
  };

  const canCreateGroupChats = () => {
    return isLoggedIn();
  };

  return {
    user,
    isAuthenticated,
    token,
    isLoggedIn,
    hasRole,
    canCreateWalls,
    canLikeContent,
    canCommentOnContent,
    canCreatePosts,
    canJoinWalls,
    canManageWall,
    canReportContent,
    canStartKolophone,
    canSendPrivateMessages,
    canCreateGroupChats
  };
};