'use client';

interface Step {
  number: number;
  title: string;
  description?: string;
}

export interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  showLabels?: boolean;
}

export default function ProgressSteps({
  steps,
  currentStep,
  className = '',
  showLabels = true,
}: ProgressStepsProps) {
  return (
    <div className={`mb-10 ${className}`}>
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {index > 0 && (
              <div
                className={`relative mx-4 h-1 w-12 transition-all duration-1000 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-500'
                    : 'bg-gray-200'
                }`}
              ></div>
            )}

            {/* Step indicator */}
            <div className="flex items-center">
              <div
                className={`relative rounded-full h-10 w-10 flex items-center justify-center transition-all duration-500 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                } ${
                  currentStep === step.number
                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                    : ''
                }`}
              >
                <span className="font-semibold">
                  {currentStep > step.number ? '' : step.number}
                </span>
                {currentStep > step.number && (
                  <svg
                    className="absolute h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Step label (desktop) */}
              {showLabels && (
                <div
                  className={`ml-3 text-sm font-medium transition-colors duration-500 hidden md:block ${
                    currentStep >= step.number
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Step labels for mobile */}
      {showLabels && (
        <div className="mt-4 flex justify-between md:hidden px-2">
          {steps.map((step, index) => (
            <span
              key={step.number}
              className={`text-xs transition-all duration-300 ${
                currentStep >= step.number
                  ? 'text-indigo-600 font-medium'
                  : 'text-gray-400'
              }`}
              style={{
                flex: 1,
                textAlign:
                  index === 0
                    ? 'left'
                    : index === steps.length - 1
                      ? 'right'
                      : 'center',
              }}
            >
              {step.title}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
