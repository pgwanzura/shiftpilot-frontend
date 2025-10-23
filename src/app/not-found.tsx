'use client';

import { useEffect, useState } from 'react';
import { AppLink, GradientLine, Icon, Button } from '@/app/components/ui';
import { AppIconType } from './config/icons';

const useMockAuth = () => {
  return {
    user: { name: 'John Doe' },
    role: 'recruiter',
    isAuthenticated: true,
  };
};

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
}

export default function NotFound() {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const { user, role, isAuthenticated } = useMockAuth();

  useEffect(() => {
    const generatedShapes: FloatingShape[] = Array.from(
      { length: 8 },
      (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 60 + Math.random() * 100,
        speed: 25 + Math.random() * 20,
        delay: Math.random() * 3,
        opacity: 0.03 + Math.random() * 0.05,
      })
    );
    setShapes(generatedShapes);
  }, []);

  const getQuickActions = () => {
    if (!isAuthenticated) {
      return [
        { href: '/login', label: 'Sign In', icon: 'logIn' },
        { href: '/register', label: 'Create Account', icon: 'userPlus' },
      ];
    }

    const baseActions = [
      { href: '/dashboard', label: 'Dashboard', icon: 'layoutDashboard' },
    ];

    switch (role) {
      case 'agency':
        return [
          ...baseActions,
          { href: '/candidates', label: 'Candidates', icon: 'search' },
          {
            href: '/references',
            label: 'Reference Requests',
            icon: 'fileText',
          },
        ];
      case 'agency_admin':
        return [
          ...baseActions,
          { href: '/team', label: 'Manage Team', icon: 'settings' },
          { href: '/billing', label: 'Billing & Plans', icon: 'creditCard' },
          { href: '/analytics', label: 'Analytics', icon: 'barChart' },
        ];
      case 'employer':
        return [
          ...baseActions,
          {
            href: '/references/pending',
            label: 'Pending Requests',
            icon: 'inbox',
          },
        ];
      default:
        return baseActions;
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute rounded-full"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: `rgba(59, 130, 246, ${shape.opacity})`,
              animation: `float ${shape.speed}s infinite ease-in-out`,
              animationDelay: `${shape.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="relative mb-12">
          <div className="text-8xl sm:text-9xl font-bold text-slate-800 tracking-tight mb-6">
            404
          </div>

          <div className="max-w-xs mx-auto mb-8">
            <GradientLine height="lg" className="rounded-full" />
          </div>
        </div>

        <div className="rounded-2xl p-10 sm:p-12 shadow-md relative">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Page Not Found
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto">
                {`We couldn't find the page you're looking for. The link may be
                broken or the page may have been removed.`}
              </p>

              {isAuthenticated && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-slate-700">
                    Welcome back,{' '}
                    <span className="font-semibold text-slate-900">
                      {user?.name}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {isAuthenticated && quickActions.length > 0 && (
              <div className="space-y-4 pt-2">
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Suggested Pages
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {quickActions.map((action, index) => (
                    <AppLink
                      key={index}
                      href={action.href}
                      variant="ghost"
                      size="sm"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-all duration-200"
                    >
                      <Icon
                        name={action.icon as AppIconType}
                        className="w-4 h-4"
                      />
                      {action.label}
                    </AppLink>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <AppLink
                href="/"
                variant="gradient"
                size="lg"
                icon="home"
                className="flex-1 justify-center shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                Return to Home
              </AppLink>
              <Button
                variant="primary-outline"
                onClick={() => window.history.back()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium transition-all duration-200"
              >
                <Icon name="arrowLeft" className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Need assistance?{' '}
                <AppLink
                  href="mailto:support@referencescope.com"
                  variant="ghost"
                  size="sm"
                  className="inlin  e text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium transition-colors duration-200"
                >
                  Contact Support
                </AppLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
