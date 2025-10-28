'use client';

import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-25 via-white to-primary-50/80 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* 404 Number with elegant gradient */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-black text-primary-600 leading-none">
            404
          </h1>
        </div>

        {/* Elegant Icon */}
        <div className="flex justify-center">
          <div className="relative p-8">
            <div className="absolute inset-0 bg-primary-100 rounded-full opacity-60"></div>
            <div className="relative transform hover:scale-105 transition-transform duration-500 ease-out">
              <svg
                className="w-20 h-20 sm:w-24 sm:h-24 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-800 tracking-wide">
            Page Not Found
          </h2>

          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed font-light">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or no longer exists.
          </p>
        </div>

        {/* Clean Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/"
            className="group inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-normal rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
          >
            <svg
              className="w-5 h-5 mr-3 transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Dashboard
          </a>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center px-8 py-4 bg-white hover:bg-gray-25 text-primary-500 font-normal rounded-2xl border border-primary-200 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
          >
            <svg
              className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Minimal Quick Links */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400 mb-6 tracking-widest uppercase">
            Quick Links
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-base">
            {[
              { href: '/shifts', label: 'View Shifts' },
              { href: '/timesheets', label: 'Timesheets' },
              { href: '/availability', label: 'Availability' },
              { href: '/support', label: 'Support' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-primary-500 hover:text-primary-600 font-light hover:underline underline-offset-4 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Subtle Branding */}
        <div className="mt-12">
          <div className="inline-flex items-center text-gray-400 text-sm font-light">
            <svg
              className="w-4 h-4 mr-2 text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-primary-500 font-normal">ShiftPilot</span>
            <span className="mx-3 text-gray-300">—</span>
            <span>Staffing Made Simple</span>
          </div>
        </div>
      </div>
    </div>
  );
}
