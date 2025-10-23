// @/app/components/layouts/Header.tsx
'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/app/components/ui';
import Image from 'next/image';
import { User, Briefcase } from 'lucide-react';
import GradientLine from '@/app/components/ui/GradientLine';
import { UserRole } from '@/lib/utils/roles';
import { User as UserType } from '@/lib/api/types/auth';
import { logoutAction } from '@/lib/actions/auth-actions';

interface HeaderProps {
  role: UserRole;
  user?: UserType;
  onMenuToggle?: () => void;
}

export default function Header({ role, user, onMenuToggle }: HeaderProps) {
  const pathname = usePathname();

  const displayName = user?.name;
  const displayEmail = user?.email;
  const avatarUrl =
    user?.avatar || 'https://randomuser.me/api/portraits/women/44.jpg';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onMenuToggle}
          >
            <Icon name="menu" className="text-lg" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="relative inline-block w-6 h-6">
                <User className="absolute inset-0" size={24} />
                <Briefcase className="absolute -bottom-1 -right-1 w-3 h-3" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-none">
                {role.charAt(0).toUpperCase() + role.slice(1)} Portal
              </h1>
              <p className="hidden md:block text-sm text-gray-500 font-medium">
                {pathname === '/'
                  ? 'Welcome back'
                  : 'Manage your workflow efficiently'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative group">
            <button className="flex items-center justify-center p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-colors duration-200 relative">
              <Icon name="bell" className="text-lg" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                3
              </span>
            </button>

            {/* Remove mt-2 and use pt-2 instead */}
            <div className="absolute right-0 top-full pt-2 w-80 bg-transparent border-none shadow-none opacity-0 scale-95 origin-top-right translate-y-1 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Notifications
                    </p>
                    <p className="text-xs text-gray-500">3 unread</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="flex items-start px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Icon
                            name="userCheck"
                            className="text-indigo-600 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">Reference Completed</p>
                        <p className="text-xs text-gray-500 truncate">
                          John Smith submitted your reference
                        </p>
                        <p className="text-xs text-indigo-500 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon name="mail" className="text-blue-600 text-xs" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">New Message</p>
                        <p className="text-xs text-gray-500 truncate">
                          You have a new message from recruiter
                        </p>
                        <p className="text-xs text-indigo-500 mt-1">
                          5 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Icon
                            name="checkCircle"
                            className="text-green-600 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">Application Updated</p>
                        <p className="text-xs text-gray-500 truncate">
                          Your application status has changed
                        </p>
                        <p className="text-xs text-indigo-500 mt-1">
                          1 day ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-100">
                    <button className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 py-2">
                      View All Notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
              <div className="relative">
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              <Icon
                name="chevronDown"
                className="hidden sm:block text-gray-400 text-xs transition-transform duration-200 group-hover:rotate-180"
              />
            </button>

            {/* Remove mt-2 and use pt-2 instead */}
            <div className="absolute right-0 top-full pt-2 w-48 sm:w-56 bg-transparent border-none shadow-none opacity-0 scale-95 origin-top-right translate-y-1 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500">{displayEmail}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  >
                    <Icon name="userCog" className="text-gray-400 mr-2" />
                    Profile
                  </Link>
                  <Link
                    href="/help"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  >
                    <Icon name="helpCircle" className="text-gray-400 mr-2" />
                    Help Center
                  </Link>
                  <button
                    onClick={async () => {
                      await logoutAction();
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                  >
                    <Icon name="logout" className="text-red-400 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GradientLine />
    </header>
  );
}
