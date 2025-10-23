// components/AccountSettings/SettingsTabs.tsx
'use client';

import { useState } from 'react';
import SettingsHeader from './SettingsHeader';
import SettingsSidebar from './SettingsSidebar';
import ProfileTab from './tabs/ProfileTab';
import NotificationsTab from './tabs/NotificationsTab';
import SecurityTab from './tabs/SecurityTab';
import BillingTab from './tabs/BillingTab';
import TeamTab from './tabs/TeamTab';
import SaveNotification from './SaveNotification';

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', label: 'Security', icon: 'fas fa-lock' },
    { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card' },
    { id: 'team', label: 'Team', icon: 'fas fa-users' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab isSaving={isSaving} onSave={handleSave} />;
      case 'notifications':
        return <NotificationsTab isSaving={isSaving} onSave={handleSave} />;
      case 'security':
        return <SecurityTab isSaving={isSaving} onSave={handleSave} />;
      case 'billing':
        return <BillingTab />;
      case 'team':
        return <TeamTab />;
      default:
        return <ProfileTab isSaving={isSaving} onSave={handleSave} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <SettingsHeader />

      <div className="flex flex-col lg:flex-row gap-8">
        <SettingsSidebar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="lg:w-3/4 animate-fade-in-right">
          {renderTabContent()}
        </div>
      </div>

      <SaveNotification isVisible={saveSuccess} />
    </div>
  );
}
