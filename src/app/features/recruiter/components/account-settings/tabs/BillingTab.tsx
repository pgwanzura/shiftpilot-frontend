// components/AccountSettings/tabs/BillingTab.tsx
export default function BillingTab() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden animate-fade-in">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Billing Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and payment methods
        </p>
      </div>
      <div className="px-6 py-6">
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-indigo-800">
                  Professional Plan
                </h3>
                <p className="text-sm text-indigo-600 mt-1">
                  $49/month • Next billing date: May 15, 2023
                </p>
              </div>
              <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 font-medium rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                Change Plan
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Payment Method
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded shadow-sm">
                    <i className="fab fa-cc-visa text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Visa ending in 4567</p>
                    <p className="text-sm text-gray-500">Expires: 05/2024</p>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200">
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Billing History
            </h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Apr 15, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Professional Plan
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $49.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                      <a href="#" className="transition-colors duration-200">
                        Download
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Mar 15, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Professional Plan
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $49.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                      <a href="#" className="transition-colors duration-200">
                        Download
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
