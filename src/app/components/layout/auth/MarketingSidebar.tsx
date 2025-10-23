interface MarketingSidebarProps {
  title: string;
  subtitle: string;
  description: string;
  features: ReadonlyArray<{
    title: string;
    description: string;
  }>;
}

export function MarketingSidebar({
  title,
  subtitle,
  description,
  features,
}: MarketingSidebarProps) {
  return (
    <div className="md:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <span className="text-primary-600 font-bold text-xl">SP</span>
          </div>
          <span className="text-2xl font-bold">ShiftPilot</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight drop-shadow-sm">
          {title}
          <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {subtitle}
          </span>
        </h1>

        <p className="text-base md:text-lg opacity-90 mb-2 font-medium">
          Smart Workforce Platform
        </p>

        <p className="text-lg md:text-xl opacity-95 mb-8 leading-relaxed font-light">
          {description}
        </p>
      </div>

      <div className="hidden md:block relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-102 hover:shadow-lg hover:shadow-white/20 cursor-pointer group">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
          <div className="w-5 h-5 bg-white rounded-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div>
          <h3 className="font-bold text-base mb-1 transition-colors duration-300 group-hover:text-white">
            {title}
          </h3>
          <p className="text-xs opacity-90 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
