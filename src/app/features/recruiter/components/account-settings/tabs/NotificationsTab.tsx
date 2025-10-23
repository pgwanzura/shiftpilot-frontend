// components/AccountSettings/tabs/NotificationsTab.tsx
'use client';

import { useState } from 'react';

interface NotificationsTabProps {
  isSaving: boolean;
  onSave: () => void;
}

export default function NotificationsTab({
  isSaving,
  onSave,
}: NotificationsTabProps) {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    candidateUpdates: true,
    referenceCompleted: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden animate-fade-in">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Notification Preferences
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage how you receive notifications and alerts
        </p>
      </div>
      <div className="px-6 py-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Email Notifications
            </h3>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex-grow">
                    <label
                      htmlFor={key}
                      className="font-medium text-gray-700 capitalize"
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      {key === 'emailAlerts' &&
                        'Receive email alerts for new candidate matches'}
                      {key === 'candidateUpdates' &&
                        'Get notified when candidates update their profiles'}
                      {key === 'referenceCompleted' &&
                        'Notify me when references are completed'}
                      {key === 'weeklyDigest' &&
                        'Receive a weekly summary of recruiting activity'}
                      {key === 'marketingEmails' &&
                        'Send me marketing emails and product updates'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="form-switch">
                      <input
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={value}
                        onChange={handleNotificationChange}
                        className="sr-only"
                      />
                      <div
                        className={`form-switch-box w-12 h-6 rounded-full relative transition-colors duration-200 ${
                          value ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                            value ? 'transform translate-x-6' : ''
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Push Notifications
            </h3>
            <div className="flex items-center justify-between py-2">
              <div className="flex-grow">
                <label
                  htmlFor="pushNotifications"
                  className="font-medium text-gray-700"
                >
                  Browser notifications
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Receive notifications in your browser
                </p>
              </div>
              <div className="flex items-center">
                <div className="form-switch">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    className="sr-only"
                  />
                  <div className="form-switch-box w-12 h-6 rounded-full bg-gray-300 relative">
                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 transition-colors duration-200 flex items-center"
        >
          {isSaving ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save mr-2"></i>
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}
