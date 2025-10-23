'use client';

import { useState } from 'react';

export default function ShareReferencesContent() {
  const referencesData = [
    {
      id: 'reference-1',
      name: 'Michael Brown',
      role: 'Senior Manager at TechCorp',
      trustScore: 92,
    },
    {
      id: 'reference-2',
      name: 'Jane Smith',
      role: 'Product Lead at InnovateCo',
      trustScore: 88,
    },
    {
      id: 'reference-3',
      name: 'David Wilson',
      role: 'CTO at Startup Labs',
      trustScore: 85,
    },
    {
      id: 'reference-4',
      name: 'Sarah Johnson',
      role: 'Engineering Director at CloudTech',
      trustScore: 95,
    },
    {
      id: 'reference-5',
      name: 'Robert Davis',
      role: 'VP of Product at DataSystems',
      trustScore: 90,
    },
    {
      id: 'reference-6',
      name: 'Emily Clark',
      role: 'Lead Designer at CreativeMinds',
      trustScore: 87,
    },
    {
      id: 'reference-7',
      name: 'Thomas Anderson',
      role: 'Senior Developer at CodeWorks',
      trustScore: 89,
    },
    {
      id: 'reference-8',
      name: 'Maria Garcia',
      role: 'Product Manager at InnovateCo',
      trustScore: 91,
    },
    {
      id: 'reference-9',
      name: 'James Wilson',
      role: 'Technical Lead at DevSolutions',
      trustScore: 86,
    },
    {
      id: 'reference-10',
      name: 'Jennifer Lee',
      role: 'UX Director at DesignHub',
      trustScore: 93,
    },
  ];

  const activeLinksData = [
    {
      id: 'link-1',
      name: 'TechCorp Hiring Team',
      status: 'active',
      expires: '2023-05-28',
      views: 3,
      passwordProtected: true,
      references: ['reference-1', 'reference-3', 'reference-5'],
      created: '2023-05-14',
      lastAccessed: '2023-05-20',
    },
    {
      id: 'link-2',
      name: 'General Access',
      status: 'active',
      expires: '2023-06-05',
      views: 12,
      passwordProtected: false,
      references: ['reference-2', 'reference-4'],
      created: '2023-05-10',
      lastAccessed: '2023-05-22',
    },
    {
      id: 'link-3',
      name: 'Startup Labs Recruiter',
      status: 'active',
      expires: '2023-06-12',
      views: 7,
      passwordProtected: true,
      references: ['reference-1', 'reference-6', 'reference-8', 'reference-9'],
      created: '2023-05-18',
      lastAccessed: '2023-05-23',
    },
    {
      id: 'link-4',
      name: 'InnovateCo HR',
      status: 'active',
      expires: '2023-06-01',
      views: 2,
      passwordProtected: true,
      references: ['reference-3', 'reference-7'],
      created: '2023-05-15',
      lastAccessed: '2023-05-19',
    },
  ];

  const expiredLinksData = [
    {
      id: 'link-5',
      name: 'InnovateCo Recruiter',
      status: 'expired',
      expires: '2023-05-15',
      views: 5,
      passwordProtected: false,
      references: ['reference-2', 'reference-5'],
      created: '2023-04-20',
      lastAccessed: '2023-05-14',
    },
    {
      id: 'link-6',
      name: 'TechCorp Initial Screening',
      status: 'expired',
      expires: '2023-05-10',
      views: 8,
      passwordProtected: true,
      references: ['reference-1', 'reference-4', 'reference-8'],
      created: '2023-04-25',
      lastAccessed: '2023-05-09',
    },
  ];

  const [selectedReferences, setSelectedReferences] = useState<string[]>([
    'reference-1',
    'reference-2',
  ]);
  const [expiry, setExpiry] = useState('14');
  const [password, setPassword] = useState('');
  const [recipient, setRecipient] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [activeLinks, setActiveLinks] = useState(activeLinksData);
  const [expiredLinks, setExpiredLinks] = useState(expiredLinksData);
  const [showExpired, setShowExpired] = useState(false);
  const [linkFilter, setLinkFilter] = useState('all');

  const handleCheckboxChange = (id: string) => {
    if (selectedReferences.includes(id)) {
      setSelectedReferences(selectedReferences.filter((ref) => ref !== id));
    } else {
      setSelectedReferences([...selectedReferences, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedReferences.length === referencesData.length) {
      setSelectedReferences([]);
    } else {
      setSelectedReferences(referencesData.map((ref) => ref.id));
    }
  };

  const handleCreateLink = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setCreatedLink('https://EcoTrust.io/share/abc123def456');
      setPassword('');
      setRecipient('');
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdLink);
  };

  const revokeLink = (id: string) => {
    setActiveLinks(activeLinks.filter((link) => link.id !== id));
  };

  const renewLink = (id: string) => {
    const linkToRenew = expiredLinks.find((link) => link.id === id);
    if (linkToRenew) {
      setExpiredLinks(expiredLinks.filter((link) => link.id !== id));
      setActiveLinks([
        ...activeLinks,
        { ...linkToRenew, status: 'active', expires: '2023-06-30', views: 0 },
      ]);
    }
  };

  const filteredReferences = referencesData.filter(
    (ref) =>
      ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActiveLinks = activeLinks.filter((link) => {
    if (linkFilter === 'all') return true;
    if (linkFilter === 'password') return link.passwordProtected;
    if (linkFilter === 'public') return !link.passwordProtected;
    return true;
  });

  const referencesToShow = showAll
    ? filteredReferences
    : filteredReferences.slice(0, 5);

  const getReferenceNames = (refIds: string[]) => {
    return refIds
      .map((id) => {
        const ref = referencesData.find((r) => r.id === id);
        return ref ? ref.name : '';
      })
      .filter((name) => name !== '');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-12xl mx-auto">
      <div className="bg-white rounded-md mb-8 overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Create New Share Link
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Select references and configure sharing options
          </p>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select references to share ({selectedReferences.length}{' '}
                  selected)
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {selectedReferences.length === referencesData.length
                      ? 'Deselect all'
                      : 'Select all'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search references..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {referencesToShow.map((ref) => (
                  <div
                    key={ref.id}
                    className={`relative flex items-start p-3 rounded-lg border ${
                      selectedReferences.includes(ref.id)
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center h-5">
                      <input
                        id={ref.id}
                        name={ref.id}
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={selectedReferences.includes(ref.id)}
                        onChange={() => handleCheckboxChange(ref.id)}
                      />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <label
                        htmlFor={ref.id}
                        className="font-medium text-gray-900 text-sm"
                      >
                        {ref.name}
                      </label>
                      <p className="text-xs text-gray-500 truncate">
                        {ref.role}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          EcoTrust™: {ref.trustScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredReferences.length > 5 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2"
                  >
                    {showAll
                      ? 'Show less'
                      : `Show all ${filteredReferences.length} references`}
                  </button>
                )}

                {filteredReferences.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No references found matching your search.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="expiry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Link expiration
                </label>
                <select
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="custom">Custom date</option>
                </select>

                {expiry === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password protection (optional)
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Set a password"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="recipient"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Recipient email (optional)
              </label>
              <input
                type="email"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter email to notify when created"
              />
              <p className="mt-1 text-xs text-gray-500">
                {`We'll send a notification email when your share link is ready`}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
          <div className="w-full md:w-auto">
            {createdLink && (
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm text-gray-600 mr-2 mb-2 sm:mb-0">
                  Share link:
                </span>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={createdLink}
                    className="text-sm border border-gray-300 rounded-l-md py-1.5 px-3 w-full sm:w-64"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-r-md text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCreateLink}
            disabled={isCreating || selectedReferences.length === 0}
            className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <i className="fas fa-link mr-2"></i> Create Share Link
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-md overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Active Share Links
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Links currently accessible by recruiters
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-3 sm:mt-0">
            <span className="text-sm text-gray-600">Filter:</span>
            <select
              value={linkFilter}
              onChange={(e) => setLinkFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All links</option>
              <option value="password">Password protected</option>
              <option value="public">Public links</option>
            </select>
          </div>
        </div>

        {filteredActiveLinks.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <i className="fas fa-link text-indigo-600"></i>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No active links
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new share link above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActiveLinks.map((link) => (
              <div key={link.id} className="px-6 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-base font-medium text-gray-900">
                        {link.name}
                      </h4>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-calendar-alt mr-1.5 text-gray-400"></i>
                        Expires: {formatDate(link.expires)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-eye mr-1.5 text-gray-400"></i>
                        {link.views} view{link.views !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {link.passwordProtected ? (
                          <>
                            <i className="fas fa-user-shield mr-1.5 text-gray-400"></i>
                            Password protected
                          </>
                        ) : (
                          <>
                            <i className="fas fa-users mr-1.5 text-gray-400"></i>
                            Public link
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-clock mr-1.5 text-gray-400"></i>
                        Last viewed: {formatDate(link.lastAccessed)}
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Shared references:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {getReferenceNames(link.references).map(
                          (name, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 flex flex-shrink-0 space-x-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <i className="fas fa-copy mr-2"></i> Copy
                    </button>
                    <button
                      onClick={() => revokeLink(link.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <i className="fas fa-trash-alt mr-2"></i> Revoke
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Expired Links</h3>
            <p className="text-sm text-gray-500 mt-1">
              Links that are no longer accessible
            </p>
          </div>
          <button
            onClick={() => setShowExpired(!showExpired)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showExpired
              ? 'Hide expired links'
              : `Show ${expiredLinks.length} expired links`}
          </button>
        </div>

        {showExpired && (
          <div className="divide-y divide-gray-200">
            {expiredLinks.map((link) => (
              <div key={link.id} className="px-6 py-4 bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-base font-medium text-gray-900">
                        {link.name}
                      </h4>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Expired
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-calendar-alt mr-1.5 text-gray-400"></i>
                        Expired: {formatDate(link.expires)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-eye mr-1.5 text-gray-400"></i>
                        {link.views} view{link.views !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {link.passwordProtected ? (
                          <>
                            <i className="fas fa-user-shield mr-1.5 text-gray-400"></i>
                            Password protected
                          </>
                        ) : (
                          <>
                            <i className="fas fa-users mr-1.5 text-gray-400"></i>
                            Public link
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Shared references:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {getReferenceNames(link.references).map(
                          (name, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800"
                            >
                              {name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 flex flex-shrink-0">
                    <button
                      onClick={() => renewLink(link.id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <i className="fas fa-redo mr-2"></i> Renew
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
