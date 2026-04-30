interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  lastUpdated: string;
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
  { id: 'hosts', label: 'Resort Owner Accounts', icon: 'ri-building-4-line' },
  { id: 'bookings', label: 'Bookings', icon: 'ri-calendar-check-line' },
  { id: 'revenue', label: 'Revenue', icon: 'ri-money-rupee-circle-line' },
  { id: 'reviews', label: 'Reviews', icon: 'ri-star-line' },
  { id: 'hero', label: 'Home Hero', icon: 'ri-home-4-line' },
  { id: 'properties', label: 'Properties', icon: 'ri-building-line' },
  { id: 'experiences', label: 'Experiences', icon: 'ri-compass-3-line' },
  { id: 'trending', label: 'Trending Destinations', icon: 'ri-map-pin-2-line' },
  { id: 'about', label: 'About Page', icon: 'ri-information-line' },
  { id: 'partner', label: 'Partner Page', icon: 'ri-group-2-line' },
  { id: 'support', label: 'Support / FAQ', icon: 'ri-customer-service-2-line' },
  { id: 'email-notifications', label: 'Email Notifications', icon: 'ri-mail-settings-line' },
  { id: 'navbar', label: 'Navigation', icon: 'ri-navigation-line' },
  { id: 'footer', label: 'Footer', icon: 'ri-layout-bottom-line' },
];

export default function AdminSidebar({ activeSection, onSectionChange, lastUpdated, onLogout, mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const formatted = new Date(lastUpdated).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSectionClick = (id: string) => {
    onSectionChange(id);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`w-64 bg-stone-900 flex flex-col shrink-0 fixed lg:sticky top-0 left-0 h-screen z-50 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
      {/* Header */}
      <div className="px-6 py-5 border-b border-stone-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-amber-400 rounded-lg shrink-0">
            <i className="ri-admin-line text-stone-900 text-sm" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Admin CMS</div>
            <div className="text-stone-400 text-xs">Triprodeo</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto min-h-0 scrollbar-invisible">
        <div className="text-stone-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Content Sections</div>
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSectionClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeSection === item.id
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <i className={`${item.icon} text-base`} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-stone-800 shrink-0">
        <div className="text-stone-500 text-xs mb-3">
          <i className="ri-time-line mr-1" />
          Last saved: {formatted}
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 text-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-logout-box-r-line" />
          Sign Out
        </button>
      </div>
      </aside>
    </>
  );
}
