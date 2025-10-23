// components/AccountSettings/tabs/TeamTab.tsx
export default function TeamTab() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden animate-fade-in">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Team Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your recruiting team members and permissions
        </p>
      </div>
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-md font-medium text-gray-900">Team Members</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center">
            <i className="fas fa-plus mr-2"></i>
            Add Member
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Team member"
              />
              <div className="ml-4">
                <p className="font-medium text-gray-900">Michael Chen</p>
                <p className="text-sm text-gray-500">
                  michael.chen@example.com
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Admin
              </span>
              <button className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Team member"
              />
              <div className="ml-4">
                <p className="font-medium text-gray-900">Priya Patel</p>
                <p className="text-sm text-gray-500">priya.patel@example.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Recruiter
              </span>
              <button className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Team member"
              />
              <div className="ml-4">
                <p className="font-medium text-gray-900">David Kim</p>
                <p className="text-sm text-gray-500">david.kim@example.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Recruiter
              </span>
              <button className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
