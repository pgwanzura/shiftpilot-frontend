export interface User {
  id: string;
  role: string;
  email: string;
  name: string;
}

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export interface UserMenu {
  menuItems: MenuItem[];
}
