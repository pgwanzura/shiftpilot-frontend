import { ForgotPasswordForm } from '@/app/features/auth/components/ForgotPasswordForm';
import { Icon } from '@/app/components/ui';
import Link from 'next/link';
import { Logo } from '@/app/components/ui/Logo';

export default function ForgotPasswordPage() {
  async function handleForgotPassword(data: { email: string }) {
    'use server';
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            reset_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : 'Failed to send reset email',
      };
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 py-8 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-500/5 border border-white/40 overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:shadow-indigo-500/10">
          <div className="md:flex min-h-[550px]">
            {/* Left Side - Brand Experience - 50% width */}
            <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5" />

              {/* Floating elements */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-white/30 rounded-full animate-bounce delay-75" />
              <div className="absolute top-16 right-12 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-300" />
              <div className="absolute bottom-20 left-16 w-2 h-2 bg-white/15 rounded-full animate-bounce delay-500" />

              {/* Animated orbs */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-400/15 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700 delay-200" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <Logo
                    variant="white"
                    size="xl"
                    backgroundColor="transparent"
                    showText={true}
                    className="text-white drop-shadow-lg"
                  />
                  <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <Icon name="lock" size="xs" className="text-white/80" />
                    <span className="text-xs font-medium text-white/80">
                      Secure
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
                    <Icon name="key" size="sm" className="text-white" />
                    <span className="text-sm font-semibold">
                      Password Recovery
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-sm">
                    Regain
                    <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mt-2">
                      Access
                    </span>
                  </h1>

                  <p className="text-lg opacity-95 leading-relaxed font-light">
                    Secure password recovery for your professional trust
                    profile.
                  </p>
                </div>
              </div>

              {/* Enhanced feature cards - Side by side */}
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 transition-all duration-500 hover:bg-white/15 hover:scale-102 hover:shadow-2xl hover:shadow-white/10 group/card">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon
                          name="shieldCheck"
                          size="md"
                          className="text-white drop-shadow-sm"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1 text-white">
                          Military-Grade Security
                        </h3>
                        <p className="text-white/80 text-xs leading-relaxed">
                          Encrypted reset process
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 transition-all duration-500 hover:bg-white/15 hover:scale-102 hover:shadow-2xl hover:shadow-white/10 group/card">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon
                          name="zap"
                          size="md"
                          className="text-white drop-shadow-sm"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1 text-white">
                          Instant Recovery
                        </h3>
                        <p className="text-white/80 text-xs leading-relaxed">
                          Get back in minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Reset Form - 50% width */}
            <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="w-full max-w-sm">
                <div className="text-center mb-8 md:hidden">
                  <Logo
                    size="lg"
                    backgroundColor="transparent"
                    showText={true}
                    className="justify-center"
                  />
                </div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4 shadow-lg">
                    <Icon name="mail" size="xl" className="text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Reset Your Password
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Enter your email address and we'll send you secure
                    instructions to reset your password
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 shadow-lg shadow-indigo-500/5 mb-6">
                  <ForgotPasswordForm onSubmit={handleForgotPassword} />
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
                    <div className="h-px w-8 bg-gray-300"></div>
                    <span className="text-sm">Quick navigation</span>
                    <div className="h-px w-8 bg-gray-300"></div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Remember your password?{' '}
                    <Link
                      href="/login"
                      className="text-indigo-600 font-semibold hover:text-indigo-500 ml-1 transition-all duration-200 hover:underline underline-offset-4"
                    >
                      Sign in to your account
                    </Link>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Need help?{' '}
                    <Link
                      href="/support"
                      className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Contact our support team
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
