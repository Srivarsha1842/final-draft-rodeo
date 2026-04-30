import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './components/AdminDashboard';
import HeroEditor from './components/HeroEditor';
import PropertiesEditor from './components/PropertiesEditor';
import ExperiencesEditor from './components/ExperiencesEditor';
import AboutEditor from './components/AboutEditor';
import PartnerEditor from './components/PartnerEditor';
import SupportEditor from './components/SupportEditor';
import NavbarFooterEditor from './components/NavbarFooterEditor';
import TrendingDestinationsEditor from './components/TrendingDestinationsEditor';
import HostAccountsEditor from './components/HostAccountsEditor';
import BookingsManager from './components/BookingsManager';
import ReviewsManager from './components/ReviewsManager';
import RevenueManager from './components/RevenueManager';
import EmailNotificationsEditor from './components/EmailNotificationsEditor';
import { CMSData } from './types';
import { loadCMSData, saveCMSData, resetCMSData } from './cmsStore';
import { setAdminToken, getAdminToken } from '@/lib/apiClient';

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(() => !!getAdminToken());
  const [cmsData, setCmsData] = useState<CMSData>(() => loadCMSData());
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogin = () => setIsAuth(true);
  const handleLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('triprodeo_admin_auth');
    setIsAuth(false);
  };

  const updateData = (partial: Partial<CMSData>) => {
    const updated = { ...cmsData, ...partial };
    setCmsData(updated);
    saveCMSData(updated);
  };

  const handleReset = () => { const fresh = resetCMSData(); setCmsData(fresh); };

  if (!isAuth) return <AdminLogin onLogin={handleLogin} />;

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminDashboard data={cmsData} onSectionChange={setActiveSection} onReset={handleReset} />;
      case 'hosts': return <HostAccountsEditor />;
      case 'bookings': return <BookingsManager />;
      case 'revenue': return <RevenueManager />;
      case 'reviews': return <ReviewsManager />;
      case 'hero': return <HeroEditor data={cmsData.hero} onSave={(hero) => updateData({ hero })} />;
      case 'properties': return <PropertiesEditor data={cmsData.properties} onSave={(properties) => updateData({ properties })} />;
      case 'experiences': return <ExperiencesEditor data={cmsData.experiences} onSave={(experiences) => updateData({ experiences })} />;
      case 'trending': return <TrendingDestinationsEditor data={cmsData.trendingDestinations ?? []} onSave={(trendingDestinations) => updateData({ trendingDestinations })} />;
      case 'about': return <AboutEditor data={cmsData.about} onSave={(about) => updateData({ about })} />;
      case 'partner': return <PartnerEditor data={cmsData.partner} onSave={(partner) => updateData({ partner })} />;
      case 'support': return <SupportEditor data={cmsData.support} onSave={(support) => updateData({ support })} />;
      case 'email-notifications': return <EmailNotificationsEditor />;
      case 'navbar':
      case 'footer':
        return (
          <NavbarFooterEditor
            navbarData={cmsData.navbar}
            footerData={cmsData.footer}
            onSaveNavbar={(navbar) => updateData({ navbar })}
            onSaveFooter={(footer) => updateData({ footer })}
            section={activeSection as 'navbar' | 'footer'}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        lastUpdated={cmsData.lastUpdated}
        onLogout={handleLogout}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white border-b border-stone-200 px-4 py-3">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
            aria-label="Open menu"
          >
            <i className="ri-menu-line text-lg" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-amber-400 rounded-lg">
              <i className="ri-admin-line text-stone-900 text-sm" />
            </div>
            <span className="text-sm font-semibold text-stone-900">Admin CMS</span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{renderSection()}</div>
      </main>
    </div>
  );
}
