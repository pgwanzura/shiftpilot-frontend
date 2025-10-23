import { Icon } from '@/app/components/ui/Icons';

export interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextButtonLabel?: string;
  showSubmitButton?: boolean;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

export default function NavigationButtons({
  currentStep,
  onBack,
  onNext,
  isNextDisabled = false,
  nextButtonLabel = 'Continue',
  showSubmitButton = false,
  isSubmitting = false,
  onSubmit,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        {currentStep === 1 ? 'Back to Candidates' : 'Back'}
      </button>

      {showSubmitButton ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:opacity-90 disabled:opacity-50 transition-all duration-200 flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending Request...
            </>
          ) : (
            <>
              <Icon name="send" className="mr-2 h-4 w-4" />
              Send Reference Request
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:opacity-90 disabled:opacity-50 transition-all duration-200 flex items-center"
        >
          {nextButtonLabel}
          <Icon name="chevronRight" className="ml-2 h-4 w-4" />
        </button>
      )}
    </div>
  );
}
