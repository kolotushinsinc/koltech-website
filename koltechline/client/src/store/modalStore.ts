import { create } from 'zustand';

type AuthAction = 'like' | 'comment' | 'post' | 'create_wall' | 'join_wall' | 'report' | 'kolophone' | 'message';

interface ModalState {
  showLogoutModal: boolean;
  showAuthModal: boolean;
  authAction: AuthAction;
  showCreateWallModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
  setShowAuthModal: (show: boolean, action?: AuthAction) => void;
  setShowCreateWallModal: (show: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showLogoutModal: false,
  showAuthModal: false,
  authAction: 'post',
  showCreateWallModal: false,
  setShowLogoutModal: (show: boolean) => set({ showLogoutModal: show }),
  setShowAuthModal: (show: boolean, action: AuthAction = 'post') => set({
    showAuthModal: show,
    authAction: action
  }),
  setShowCreateWallModal: (show: boolean) => set({ showCreateWallModal: show }),
}));