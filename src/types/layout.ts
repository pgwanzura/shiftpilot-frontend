export interface LayoutProps {
  children: React.ReactNode;
}

export interface AuthCookie {
  auth_user: string;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
}

export interface SidebarHandlers {
  onToggleCollapse: () => void;
  onClose: () => void;
  onMenuToggle: () => void;
}
