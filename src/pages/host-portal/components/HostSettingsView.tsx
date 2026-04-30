import { useState } from 'react';
import { HostAccount } from '@/pages/admin/types';
import { updateHostAccount } from '@/pages/admin/hostStore';

interface HostSettingsViewProps {
  host: HostAccount;
  onHostUpdate: (updated: HostAccount) => void;
}

type SettingsTab = 'profile' | 'bank' | 'password' | 'notifications';

interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  upiId: string;
}

interface NotificationPrefs {
  emailBookings: boolean;
  emailMessages: boolean;
  emailPayouts: boolean;
  emailReviews: boolean;
  emailMarketing: boolean;
  smsBookings: boolean;
  smsMessages: boolean;
  smsPayouts: boolean;
}

const defaultBankDetails: BankDetails = {
  accountName: '',
  accountNumber: '',
  ifscCode: '',
  bankName: '',
  branchName: '',
  upiId: '',
};

const defaultNotifPrefs: NotificationPrefs = {
  emailBookings: true,
  emailMessages: true,
  emailPayouts: true,
  emailReviews: true,
  emailMarketing: false,
  smsBookings: true,
  smsMessages: false,
  smsPayouts: true,
};

function loadBankDetails(hostId: string): BankDetails {
  try {
    const raw = localStorage.getItem(`triprodeo_bank_${hostId}`);
    if (raw) return JSON.parse(raw) as BankDetails;
  } catch { /* ignore */ }
  return defaultBankDetails;
}

function saveBankDetails(hostId: string, details: BankDetails): void {
  localStorage.setItem(`triprodeo_bank_${hostId}`, JSON.stringify(details));
}

function loadNotifPrefs(hostId: string): NotificationPrefs {
  try {
    const raw = localStorage.getItem(`triprodeo_notifprefs_${hostId}`);
    if (raw) return JSON.parse(raw) as NotificationPrefs;
  } catch { /* ignore */ }
  return defaultNotifPrefs;
}

function saveNotifPrefs(hostId: string, prefs: NotificationPrefs): void {
  localStorage.setItem(`triprodeo_notifprefs_${hostId}`, JSON.stringify(prefs));
}

export default function HostSettingsView({ host, onHostUpdate }: HostSettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile state
  const [profileForm, setProfileForm] = useState({
    name: host.name,
    email: host.email,
    phone: host.phone,
    bio: (host as HostAccount & { bio?: string }).bio ?? '',
    location: (host as HostAccount & { location?: string }).location ?? '',
    languages: (host as HostAccount & { languages?: string }).languages ?? '',
    website: (host as HostAccount & { website?: string }).website ?? '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Bank state
  const [bankForm, setBankForm] = useState<BankDetails>(() => loadBankDetails(host.id));
  const [bankSaving, setBankSaving] = useState(false);
  const [bankSuccess, setBankSuccess] = useState('');
  const [bankMasked, setBankMasked] = useState(true);

  // Password state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  // Notification prefs state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(() => loadNotifPrefs(host.id));
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState('');

  // ── Profile Save ──────────────────────────────────────────────
  const handleProfileSave = () => {
    setProfileError('');
    if (!profileForm.name.trim()) { setProfileError('Name is required.'); return; }
    if (!profileForm.email.trim() || !/\S+@\S+\.\S+/.test(profileForm.email)) {
      setProfileError('Please enter a valid email address.'); return;
    }
    if (!profileForm.phone.trim()) { setProfileError('Phone number is required.'); return; }
    setProfileSaving(true);
    setTimeout(() => {
      const updated = updateHostAccount(host.id, {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
      });
      if (updated) {
        onHostUpdate(updated);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
      setProfileSaving(false);
    }, 600);
  };

  // ── Bank Save ─────────────────────────────────────────────────
  const handleBankSave = () => {
    setBankSaving(true);
    setTimeout(() => {
      saveBankDetails(host.id, bankForm);
      setBankSuccess('Bank details saved successfully!');
      setBankMasked(true);
      setTimeout(() => setBankSuccess(''), 3000);
      setBankSaving(false);
    }, 600);
  };

  // ── Password Save ─────────────────────────────────────────────
  const handlePasswordSave = () => {
    setPwError('');
    if (!pwForm.current) { setPwError('Please enter your current password.'); return; }
    if (pwForm.current !== host.password) { setPwError('Current password is incorrect.'); return; }
    if (pwForm.newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    setPwSaving(true);
    setTimeout(() => {
      const updated = updateHostAccount(host.id, { password: pwForm.newPw });
      if (updated) {
        onHostUpdate(updated);
        setPwSuccess('Password changed successfully!');
        setPwForm({ current: '', newPw: '', confirm: '' });
        setTimeout(() => setPwSuccess(''), 3000);
      }
      setPwSaving(false);
    }, 600);
  };

  // ── Notification Prefs Save ───────────────────────────────────
  const handleNotifSave = () => {
    setNotifSaving(true);
    setTimeout(() => {
      saveNotifPrefs(host.id, notifPrefs);
      setNotifSuccess('Notification preferences saved!');
      setTimeout(() => setNotifSuccess(''), 3000);
      setNotifSaving(false);
    }, 400);
  };

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile', icon: 'ri-user-settings-line' },
    { id: 'bank', label: 'Bank Details', icon: 'ri-bank-line' },
    { id: 'password', label: 'Password', icon: 'ri-lock-password-line' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
  ];

  const maskAccount = (num: string) => {
    if (!num) return '';
    return '•'.repeat(Math.max(0, num.length - 4)) + num.slice(-4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <p className="text-stone-500 text-sm mt-1">Manage your profile, payments, and preferences</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <i className={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {/* Avatar banner */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-700 h-24 relative" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-6">
              <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-amber-100 flex-shrink-0">
                {host.avatar ? (
                  <img src={host.avatar} alt={host.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="ri-user-line text-amber-600 text-3xl" />
                  </div>
                )}
              </div>
              <div className="pb-1">
                <p className="font-bold text-stone-900 text-lg leading-tight">{host.name}</p>
                <p className="text-stone-400 text-sm">{host.email}</p>
              </div>
            </div>

            {profileError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <i className="ri-error-warning-line" />
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                <i className="ri-checkbox-circle-line" />
                {profileSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">City / Location</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="e.g. Mumbai, Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Languages Spoken</label>
                <input
                  type="text"
                  value={profileForm.languages}
                  onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="e.g. English, Hindi, Tamil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Website / Social</label>
                <input
                  type="url"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Owner Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors resize-none"
                  placeholder="Tell guests a bit about yourself as a property owner..."
                />
                <p className="text-stone-400 text-xs mt-1 text-right">{profileForm.bio.length}/500</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 pt-5 border-t border-stone-100">
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                {profileSaving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
                {profileSaving ? 'Saving...' : 'Save Profile'}
              </button>
              <p className="text-stone-400 text-xs">Changes take effect immediately</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BANK DETAILS TAB ───────────────────────────────── */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          {/* Info banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <i className="ri-shield-check-line text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Your bank details are stored securely</p>
              <p className="text-xs text-amber-600 mt-0.5">Account numbers are masked for your safety. Payouts are processed on the 7th of each month.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-stone-900 text-base">Bank Account Details</h2>
                <p className="text-stone-400 text-sm mt-0.5">Your earnings will be transferred to this account</p>
              </div>
              <button
                onClick={() => setBankMasked(!bankMasked)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className={bankMasked ? 'ri-eye-line' : 'ri-eye-off-line'} />
                {bankMasked ? 'Show' : 'Hide'}
              </button>
            </div>

            {bankSuccess && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                <i className="ri-checkbox-circle-line" />
                {bankSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Account Holder Name</label>
                <input
                  type="text"
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="As per bank records"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Account Number</label>
                <input
                  type="text"
                  value={bankMasked && bankForm.accountNumber ? maskAccount(bankForm.accountNumber) : bankForm.accountNumber}
                  onChange={(e) => {
                    if (!bankMasked) setBankForm({ ...bankForm, accountNumber: e.target.value });
                  }}
                  readOnly={bankMasked}
                  className={`w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors ${bankMasked ? 'bg-stone-50 tracking-widest text-stone-500' : ''}`}
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">IFSC Code</label>
                <input
                  type="text"
                  value={bankForm.ifscCode}
                  onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors uppercase"
                  placeholder="e.g. SBIN0001234"
                  maxLength={11}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Bank Name</label>
                <input
                  type="text"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="e.g. State Bank of India"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Branch Name</label>
                <input
                  type="text"
                  value={bankForm.branchName}
                  onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="e.g. Andheri West Branch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">UPI ID <span className="text-stone-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={bankForm.upiId}
                  onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                  placeholder="yourname@upi"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 pt-5 border-t border-stone-100">
              <button
                onClick={handleBankSave}
                disabled={bankSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                {bankSaving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
                {bankSaving ? 'Saving...' : 'Save Bank Details'}
              </button>
              <p className="text-stone-400 text-xs">Used for payout processing only</p>
            </div>
          </div>

          {/* Payout schedule info */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-900 text-sm mb-3 flex items-center gap-2">
              <i className="ri-calendar-event-line text-amber-500" />
              Payout Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: 'ri-calendar-2-line', label: 'Payout Date', value: '7th of every month' },
                { icon: 'ri-time-line', label: 'Processing Time', value: '2–3 business days' },
                { icon: 'ri-percent-line', label: 'Platform Fee', value: '10% per booking' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                  <div className="w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-lg">
                    <i className={`${item.icon} text-stone-600 text-sm`} />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">{item.label}</p>
                    <p className="text-sm font-medium text-stone-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PASSWORD TAB ───────────────────────────────────── */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-lg">
          <div className="mb-6">
            <h2 className="font-semibold text-stone-900 text-base">Change Password</h2>
            <p className="text-stone-400 text-sm mt-0.5">Choose a strong password with at least 8 characters</p>
          </div>

          {pwError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <i className="ri-error-warning-line" />
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
              <i className="ri-checkbox-circle-line" />
              {pwSuccess}
            </div>
          )}

          <div className="space-y-4">
            {(['current', 'newPw', 'confirm'] as const).map((field) => {
              const labels: Record<typeof field, string> = {
                current: 'Current Password',
                newPw: 'New Password',
                confirm: 'Confirm New Password',
              };
              const placeholders: Record<typeof field, string> = {
                current: 'Enter your current password',
                newPw: 'At least 8 characters',
                confirm: 'Repeat new password',
              };
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{labels[field]}</label>
                  <div className="relative">
                    <input
                      type={showPw[field] ? 'text' : 'password'}
                      value={pwForm[field]}
                      onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
                      className="w-full px-3 py-2.5 pr-10 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                      placeholder={placeholders[field]}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw({ ...showPw, [field]: !showPw[field] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      <i className={showPw[field] ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </button>
                  </div>
                  {field === 'newPw' && pwForm.newPw && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            pwForm.newPw.length >= (i + 1) * 2
                              ? pwForm.newPw.length < 6 ? 'bg-red-400' : pwForm.newPw.length < 10 ? 'bg-amber-400' : 'bg-green-400'
                              : 'bg-stone-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-stone-400 ml-2 whitespace-nowrap">
                        {pwForm.newPw.length < 6 ? 'Weak' : pwForm.newPw.length < 10 ? 'Fair' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-stone-100">
            <button
              onClick={handlePasswordSave}
              disabled={pwSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              {pwSaving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-lock-password-line" />}
              {pwSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ─────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifSuccess && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
              <i className="ri-checkbox-circle-line" />
              {notifSuccess}
            </div>
          )}

          {/* Email notifications */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-xl">
                <i className="ri-mail-line text-stone-600" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900 text-base">Email Notifications</h2>
                <p className="text-stone-400 text-xs">Sent to {host.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { key: 'emailBookings' as const, label: 'New Bookings', desc: 'When a guest books your property' },
                { key: 'emailMessages' as const, label: 'Guest Messages', desc: 'When you receive a new message' },
                { key: 'emailPayouts' as const, label: 'Payout Updates', desc: 'Monthly payout processing & receipts' },
                { key: 'emailReviews' as const, label: 'New Reviews', desc: 'When guests leave a review' },
                { key: 'emailMarketing' as const, label: 'Tips & Promotions', desc: 'Hosting tips, platform updates, offers' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{item.label}</p>
                    <p className="text-xs text-stone-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                      notifPrefs[item.key] ? 'bg-stone-900' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        notifPrefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SMS notifications */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-xl">
                <i className="ri-smartphone-line text-stone-600" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900 text-base">SMS Notifications</h2>
                <p className="text-stone-400 text-xs">Sent to {host.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { key: 'smsBookings' as const, label: 'New Bookings', desc: 'Instant SMS on new confirmed bookings' },
                { key: 'smsMessages' as const, label: 'Guest Messages', desc: 'SMS alerts for new messages' },
                { key: 'smsPayouts' as const, label: 'Payout Alerts', desc: 'When your payout is processed' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-stone-800">{item.label}</p>
                    <p className="text-xs text-stone-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                      notifPrefs[item.key] ? 'bg-stone-900' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        notifPrefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNotifSave}
              disabled={notifSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              {notifSaving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
              {notifSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
