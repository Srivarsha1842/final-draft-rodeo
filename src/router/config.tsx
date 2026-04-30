import { RouteObject } from 'react-router-dom';
import HomePage from '@/pages/home/page';
import SearchPage from '@/pages/search/page';
import PropertyPage from '@/pages/property/page';
import BookingPage from '@/pages/booking/page';
import AIPlannerPage from '@/pages/ai-planner/page';
import ExperiencesPage from '@/pages/experiences/page';
import DashboardPage from '@/pages/dashboard/page';
import HostPage from '@/pages/host/page';
import PartnerPage from '@/pages/partner/page';
import AboutPage from '@/pages/about/page';
import SupportPage from '@/pages/support/page';
import AdminPage from '@/pages/admin/page';
import HostPortalPage from '@/pages/host-portal/page';
import LoginPage from '@/pages/login/page';
import DayOutingPage from '@/pages/day-outing/page';
import TagsPage from '@/pages/tags/page';
import DestinationsPage from '@/pages/destinations/page';
import LegalPage from '@/pages/legal/page';
import NotFound from '@/pages/NotFound';

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/property/:id', element: <PropertyPage /> },
  { path: '/booking/:id', element: <BookingPage /> },
  { path: '/ai-planner', element: <AIPlannerPage /> },
  { path: '/experiences', element: <ExperiencesPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/resort-owner', element: <HostPage /> },
  { path: '/host', element: <HostPage /> },
  { path: '/partner', element: <PartnerPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/support', element: <SupportPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/resort-owner-portal', element: <HostPortalPage /> },
  { path: '/host-portal', element: <HostPortalPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/day-outing', element: <DayOutingPage /> },
  { path: '/tags', element: <TagsPage /> },
  { path: '/destinations', element: <DestinationsPage /> },
  { path: '/legal/:slug', element: <LegalPage /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
