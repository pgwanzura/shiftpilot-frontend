// components/AccountSettings/tabs/SecurityTab.tsx
'use client';

import { useState } from 'react';

interface SecurityTabProps {
  isSaving: boolean;
  onSave: () => void;
}

export default function SecurityTab({ isSaving, onSave }: SecurityTabProps) {
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: true,
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden animate-fade-in">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your password and security preferences
        </p>
      </div>
      <div className="px-6 py-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={security.currentPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={security.newPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between py-2">
              <div className="flex-grow">
                <label
                  htmlFor="twoFactor"
                  className="font-medium text-gray-700"
                >
                  Enable two-factor authentication
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex items-center">
                <div className="form-switch">
                  <input
                    type="checkbox"
                    id="twoFactor"
                    checked={security.twoFactorAuth}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        twoFactorAuth: e.target.checked,
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`form-switch-box w-12 h-6 rounded-full relative transition-colors duration-200 ${
                      security.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        security.twoFactorAuth ? 'transform translate-x-6' : ''
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Active Sessions
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chrome on Windows</p>
                  <p className="text-sm text-gray-500">
                    San Francisco, CA • Last active: 2 hours ago
                  </p>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200">
                  Revoke
                </button>
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
              Update Security
            </>
          )}
        </button>
      </div>
    </div>
  );
}
