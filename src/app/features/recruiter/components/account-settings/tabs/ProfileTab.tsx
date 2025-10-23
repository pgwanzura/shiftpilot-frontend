// components/AccountSettings/tabs/ProfileTab.tsx
'use client';

import { useState } from 'react';

interface ProfileTabProps {
  isSaving: boolean;
  onSave: () => void;
}

export default function ProfileTab({ isSaving, onSave }: ProfileTabProps) {
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    position: 'Senior Recruiter',
    department: 'Talent Acquisition',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced recruiter with 8+ years in tech talent acquisition. Specialized in UX/UI and product roles.',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden animate-fade-in">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal and professional information
        </p>
      </div>
      <div className="px-6 py-6">
        <div className="flex items-center mb-6">
          <div className="relative group">
            <img
              className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-sm"
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <i className="fas fa-camera text-white"></i>
            </div>
          </div>
          <div className="ml-4">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Change avatar
            </button>
            <p className="text-xs text-gray-500 mt-1">
              JPG, GIF or PNG. Max size of 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={profile.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Position
            </label>
            <input
              type="text"
              name="position"
              id="position"
              value={profile.position}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <input
              type="text"
              name="department"
              id="department"
              value={profile.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={profile.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={profile.bio}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
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
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
