import { CMSData } from '../types';

interface AdminDashboardProps {
  data: CMSData;
  onSectionChange: (section: string) => void;
  onReset: () => void;
}

const quickLinks = [
  { id: 'hero', label: 'Edit Hero Section', icon: 'ri-home-4-line', desc: 'Headline, stats, background' },
  { id: 'properties', label: 'Manage Properties', icon: 'ri-building-line', desc: 'Add, edit, remove listings' },
  { id: 'experiences', label: 'Edit Experiences', icon: 'ri-compass-3-line', desc: 'Curated activities' },
  { id: 'about', label: 'Update About Page', icon: 'ri-information-line', desc: 'Story, team, values' },
  { id: 'partner', label: 'Partner Page', icon: 'ri-group-2-line', desc: 'Commissions, benefits' },
  { id: 'support', label: 'Support & FAQs', icon: 'ri-customer-service-2-line', desc: 'FAQs, contact info' },
  { id: 'navbar', label: 'Navigation Links', icon: 'ri-navigation-line', desc: 'Menu items, logo' },
  { id: 'footer', label: 'Footer Content', icon: 'ri-layout-bottom-line', desc: 'Tagline, social links' },
];

export default function AdminDashboard({ data, onSectionChange, onReset }: AdminDashboardProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Welcome to the CMS
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Manage all content across your Triprodeo website from one place.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Properties', value: data.properties.length, icon: 'ri-building-line', color: 'bg-amber-50 text-amber-600' },
          { label: 'Experiences', value: data.experiences.length, icon: 'ri-compass-3-line', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Partner FAQs', value: data.support.faqs.length, icon: 'ri-question-answer-line', color: 'bg-rose-50 text-rose-600' },
          { label: 'Nav Links', value: data.navbar.links.length, icon: 'ri-links-line', color: 'bg-sky-50 text-sky-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-stone-100 p-5">
            <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${stat.color} mb-3`}>
              <i className={`${stat.icon} text-base`} />
            </div>
            <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
            <div className="text-stone-500 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-base font-semibold text-stone-800 mb-4">Edit Content</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onSectionChange(link.id)}
            className="bg-white rounded-xl border border-stone-100 p-5 text-left hover:border-stone-300 hover:bg-stone-50 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-xl mb-3 group-hover:bg-stone-200 transition-colors">
              <i className={`${link.icon} text-stone-700 text-base`} />
            </div>
            <div className="text-sm font-semibold text-stone-800">{link.label}</div>
            <div className="text-stone-400 text-xs mt-1">{link.desc}</div>
          </button>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 p-5">
        <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
          <i className="ri-alert-line" />
          Danger Zone
        </h3>
        <p className="text-stone-500 text-xs mb-3">
          Reset all content to the original default values. This cannot be undone.
        </p>
        {showResetConfirm ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-red-600 font-medium">Are you sure? This will erase all your changes.</span>
            <button
              onClick={() => { onReset(); setShowResetConfirm(false); }}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            Reset to Defaults
          </button>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
