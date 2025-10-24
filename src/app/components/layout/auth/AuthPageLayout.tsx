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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden transition-all duration-300">
            <div className="md:flex">
              {/* Sidebar */}
              {sidebar}

              {/* Auth content */}
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
      <div className="w-12 h-12 bg-[#0077b6] rounded-xl flex items-center justify-center mr-3 shadow-md">
        <span className="text-white font-semibold text-xl">SP</span>
      </div>
      <span className="text-2xl font-bold text-gray-900 tracking-tight">
        ShiftPilot
      </span>
    </div>
  );
}
