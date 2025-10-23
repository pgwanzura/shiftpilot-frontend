// components/AccountSettings/SettingsSidebar.tsx
interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface SettingsSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function SettingsSidebar({
  tabs,
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  return (
    <div className="lg:w-1/4 animate-fade-in-left">
      <div className="bg-white shadow rounded-lg p-4 sticky top-6">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className={`${tab.icon} mr-3 w-5 text-center`}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
            <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
