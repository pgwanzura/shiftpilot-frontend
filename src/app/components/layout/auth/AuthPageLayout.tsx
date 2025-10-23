interface AuthPageLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  showMobileLogo?: boolean;
}

export function AuthPageLayout({
  children,
  sidebar,
  showMobileLogo = true,
}: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary-500/10 border border-white/20 overflow-hidden">
            <div className="md:flex">
              {sidebar}

              <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-white">
                <div className="w-full max-w-sm">
                  {showMobileLogo && (
                    <div className="text-center mb-6 md:hidden">
                      <MobileLogo />
                    </div>
                  )}
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileLogo() {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-3">
        <span className="text-white font-bold text-xl">SP</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">ShiftPilot</span>
    </div>
  );
}
