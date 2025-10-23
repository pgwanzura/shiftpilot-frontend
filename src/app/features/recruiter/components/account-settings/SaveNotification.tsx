// components/AccountSettings/SaveNotification.tsx
interface SaveNotificationProps {
  isVisible: boolean;
}

export default function SaveNotification({ isVisible }: SaveNotificationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 animate-slide-in-right">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <i className="fas fa-check-circle text-green-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Settings saved successfully
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
