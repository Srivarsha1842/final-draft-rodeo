import { useState, useEffect } from 'react';
import { StaffMember, StaffRole, StaffFeature, ALL_STAFF_FEATURES, DEFAULT_ROLE_PERMISSIONS } from '@/pages/admin/types';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';

interface Props {
  propertyId: string;
  propertyName: string;
  hostId: string;
}

const ROLES: { value: StaffRole; label: string; icon: string; color: string }[] = [
  { value: 'reception',    label: 'Reception',        icon: 'ri-customer-service-2-line', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { value: 'housekeeping', label: 'Housekeeping',     icon: 'ri-brush-4-line',            color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { value: 'service',      label: 'Service Person',   icon: 'ri-service-line',            color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { value: 'kitchen',      label: 'Kitchen / Cook',   icon: 'ri-restaurant-2-line',       color: 'bg-rose-50 text-rose-700 border-rose-100' },
  { value: 'security',     label: 'Security',         icon: 'ri-shield-user-line',        color: 'bg-stone-100 text-stone-700 border-stone-200' },
  { value: 'maintenance',  label: 'Maintenance',      icon: 'ri-tools-line',              color: 'bg-orange-50 text-orange-700 border-orange-100' },
  { value: 'management',   label: 'Management',       icon: 'ri-briefcase-4-line',        color: 'bg-violet-50 text-violet-700 border-violet-100' },
  { value: 'driver',       label: 'Driver',           icon: 'ri-car-line',                color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
];

const SHIFTS = [
  { value: 'morning',   label: 'Morning (6am – 2pm)' },
  { value: 'afternoon', label: 'Afternoon (2pm – 10pm)' },
  { value: 'night',     label: 'Night (10pm – 6am)' },
  { value: 'full-day',  label: 'Full Day' },
];

const STATUS_COLORS: Record<string, string> = {
  active:     'bg-emerald-100 text-emerald-700',
  'on-leave': 'bg-amber-100 text-amber-700',
  inactive:   'bg-stone-100 text-stone-500',
};

// Group features for display
const FEATURE_GROUPS = Array.from(new Set(ALL_STAFF_FEATURES.map((f) => f.group)));

const emptyStaff = (propertyId: string, role: StaffRole = 'reception'): StaffMember => ({
  id: `staff_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  propertyId,
  name: '',
  role,
  phone: '',
  email: '',
  shift: 'full-day',
  joinedDate: new Date().toISOString().split('T')[0],
  status: 'active',
  salary: undefined,
  notes: '',
  loginEmail: '',
  loginPassword: '',
  hasPortalAccess: false,
  permissions: [...DEFAULT_ROLE_PERMISSIONS[role]],
});

type FormTab = 'info' | 'access';

export default function StaffManager({ propertyId, propertyName }: Props) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'permissions'>('list');
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<StaffMember>(emptyStaff(propertyId));
  const [formTab, setFormTab] = useState<FormTab>('info');
  const [filterRole, setFilterRole] = useState<StaffRole | 'all'>('all');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedPermissions, setExpandedPermissions] = useState<string | null>(null);

  useEffect(() => {
    const data = loadHostData();
    const all: StaffMember[] = (data as any).staff ?? [];
    setStaff(all.filter((s) => s.propertyId === propertyId));
  }, [propertyId]);

  const persist = (updated: StaffMember[]) => {
    const data = loadHostData();
    const all: StaffMember[] = (data as any).staff ?? [];
    const others = all.filter((s) => s.propertyId !== propertyId);
    (data as any).staff = [...others, ...updated];
    saveHostData(data);
    setStaff(updated);
  };

  const openAdd = () => {
    setForm(emptyStaff(propertyId));
    setEditing(null);
    setFormTab('info');
    setShowPassword(false);
    setView('add');
  };

  const openEdit = (s: StaffMember) => {
    setEditing(s);
    setForm({
      ...s,
      permissions: s.permissions ?? [...DEFAULT_ROLE_PERMISSIONS[s.role]],
    });
    setFormTab('info');
    setShowPassword(false);
    setView('edit');
  };

  const openPermissions = (s: StaffMember) => {
    setEditing(s);
    setForm({
      ...s,
      permissions: s.permissions ?? [...DEFAULT_ROLE_PERMISSIONS[s.role]],
    });
    setView('permissions');
  };

  const handleRoleChange = (role: StaffRole) => {
    setForm({ ...form, role, permissions: [...DEFAULT_ROLE_PERMISSIONS[role]] });
  };

  const toggleFeature = (feat: StaffFeature) => {
    const perms = form.permissions ?? [];
    const has = perms.includes(feat);
    setForm({ ...form, permissions: has ? perms.filter((p) => p !== feat) : [...perms, feat] });
  };

  const resetToRoleDefaults = () => {
    setForm({ ...form, permissions: [...DEFAULT_ROLE_PERMISSIONS[form.role]] });
  };

  const handleSave = () => {
    if (!form.name || !form.role) return;
    const finalForm: StaffMember = {
      ...form,
      permissions: form.permissions ?? [...DEFAULT_ROLE_PERMISSIONS[form.role]],
    };
    if (view === 'edit' && editing) {
      persist(staff.map((s) => s.id === editing.id ? finalForm : s));
    } else {
      persist([...staff, finalForm]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setView('list');
  };

  const handleSavePermissions = () => {
    if (!editing) return;
    persist(staff.map((s) => s.id === editing.id ? { ...s, permissions: form.permissions ?? [] } : s));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setView('list');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this staff member?')) return;
    persist(staff.filter((s) => s.id !== id));
  };

  const getRoleInfo = (role: StaffRole) => ROLES.find((r) => r.value === role) ?? ROLES[0];
  const filteredStaff = filterRole === 'all' ? staff : staff.filter((s) => s.role === filterRole);
  const activeCount = staff.filter((s) => s.status === 'active').length;
  const accessCount = staff.filter((s) => s.hasPortalAccess).length;
  const roleCounts = ROLES.map((r) => ({ ...r, count: staff.filter((s) => s.role === r.value).length })).filter((r) => r.count > 0);
  const currentPerms = form.permissions ?? [];
  const defaultPerms = DEFAULT_ROLE_PERMISSIONS[form.role] ?? [];

  // ── PERMISSIONS VIEW ────────────────────────────────────────────────────
  if (view === 'permissions' && editing) {
    const roleInfo = getRoleInfo(editing.role);
    const changedCount = currentPerms.filter((p) => !defaultPerms.includes(p)).length
      + defaultPerms.filter((p) => !currentPerms.includes(p)).length;

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer">
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-stone-900">Configure Access — {editing.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${roleInfo.color}`}>
                <i className={roleInfo.icon} />{roleInfo.label}
              </span>
              <span className="text-stone-400 text-xs">{propertyName}</span>
            </div>
          </div>
          <button
            onClick={resetToRoleDefaults}
            className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line" /> Reset to Role Defaults
          </button>
        </div>

        {/* Changed notice */}
        {changedCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2 text-sm text-amber-700">
            <i className="ri-information-line" />
            {changedCount} permission{changedCount > 1 ? 's' : ''} differ from default role settings
          </div>
        )}

        {/* Login access info */}
        <div className={`rounded-xl border p-4 mb-5 flex items-start gap-3 ${editing.hasPortalAccess ? 'bg-emerald-50 border-emerald-200' : 'bg-stone-50 border-stone-200'}`}>
          <i className={`text-xl mt-0.5 ${editing.hasPortalAccess ? 'ri-shield-check-line text-emerald-500' : 'ri-shield-cross-line text-stone-400'}`} />
          <div>
            <p className={`font-semibold text-sm ${editing.hasPortalAccess ? 'text-emerald-800' : 'text-stone-600'}`}>
              {editing.hasPortalAccess ? 'Portal access is enabled' : 'Portal access is disabled'}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              {editing.hasPortalAccess
                ? `Login: ${editing.loginEmail || editing.email} — the permissions below control what they can see and do.`
                : 'Enable portal access in Edit Staff to assign a login. Permissions are saved regardless.'}
            </p>
          </div>
        </div>

        {/* Feature groups */}
        <div className="space-y-4 mb-6">
          {FEATURE_GROUPS.map((group) => {
            const groupFeatures = ALL_STAFF_FEATURES.filter((f) => f.group === group);
            const enabledCount = groupFeatures.filter((f) => currentPerms.includes(f.id)).length;
            const isExpanded = expandedPermissions === group;

            return (
              <div key={group} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                {/* Group header */}
                <button
                  onClick={() => setExpandedPermissions(isExpanded ? null : group)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-900 text-sm">{group}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      enabledCount === groupFeatures.length ? 'bg-emerald-100 text-emerald-700' :
                      enabledCount === 0 ? 'bg-stone-100 text-stone-400' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {enabledCount}/{groupFeatures.length} enabled
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Group toggle */}
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const allOn = groupFeatures.every((f) => currentPerms.includes(f.id));
                        if (allOn) {
                          setForm({ ...form, permissions: currentPerms.filter((p) => !groupFeatures.map((f) => f.id).includes(p as StaffFeature)) });
                        } else {
                          const toAdd = groupFeatures.map((f) => f.id).filter((id) => !currentPerms.includes(id as StaffFeature));
                          setForm({ ...form, permissions: [...currentPerms, ...toAdd] as StaffFeature[] });
                        }
                      }}
                      className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors cursor-pointer ${
                        groupFeatures.every((f) => currentPerms.includes(f.id)) ? 'bg-emerald-500' : 'bg-stone-200'
                      }`}
                    >
                      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        groupFeatures.every((f) => currentPerms.includes(f.id)) ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </span>
                    <i className={`${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-stone-400`} />
                  </div>
                </button>

                {/* Feature list */}
                {isExpanded && (
                  <div className="border-t border-stone-100 divide-y divide-stone-50">
                    {groupFeatures.map((feat) => {
                      const isOn = currentPerms.includes(feat.id);
                      const isDefault = defaultPerms.includes(feat.id);
                      return (
                        <div key={feat.id} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isOn ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-400'}`}>
                              <i className={`${feat.icon} text-sm`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-stone-800">{feat.label}</p>
                              {!isDefault && isOn && (
                                <p className="text-xs text-amber-600 flex items-center gap-1"><i className="ri-add-circle-line" /> Added beyond role default</p>
                              )}
                              {isDefault && !isOn && (
                                <p className="text-xs text-rose-500 flex items-center gap-1"><i className="ri-subtract-line" /> Removed from role default</p>
                              )}
                              {isDefault && isOn && (
                                <p className="text-xs text-stone-400">Default for {getRoleInfo(form.role).label}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleFeature(feat.id)}
                            className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors cursor-pointer ${isOn ? 'bg-emerald-500' : 'bg-stone-200'}`}
                          >
                            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-stone-50 rounded-xl border border-stone-200 px-5 py-4 mb-5">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Enabled Features Summary</p>
          <div className="flex flex-wrap gap-1.5">
            {currentPerms.length === 0 ? (
              <span className="text-stone-400 text-xs">No features enabled — staff will see a blank portal</span>
            ) : (
              currentPerms.map((feat) => {
                const info = ALL_STAFF_FEATURES.find((f) => f.id === feat);
                if (!info) return null;
                return (
                  <span key={feat} className="flex items-center gap-1 px-2 py-1 bg-white border border-stone-200 text-stone-700 text-xs rounded-full">
                    <i className={`${info.icon} text-stone-400`} />{info.label}
                  </span>
                );
              })
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
          <button onClick={handleSavePermissions} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
            Save Permissions
          </button>
        </div>
      </div>
    );
  }

  // ── ADD / EDIT VIEW ─────────────────────────────────────────────────────
  if (view === 'add' || view === 'edit') {
    const roleInfo = getRoleInfo(form.role);
    const currentPermsLocal = form.permissions ?? DEFAULT_ROLE_PERMISSIONS[form.role];

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer">
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-stone-900">{view === 'edit' ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
            <p className="text-stone-400 text-xs">{propertyName}</p>
          </div>
        </div>

        {/* Form tabs */}
        <div className="flex gap-1 mb-5 bg-stone-100 p-1 rounded-xl w-fit">
          {([
            { id: 'info' as FormTab, label: 'Staff Info', icon: 'ri-user-line' },
            { id: 'access' as FormTab, label: 'Portal Access & Permissions', icon: 'ri-shield-keyhole-line' },
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFormTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                formTab === tab.id ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <i className={tab.icon} />
              {tab.label}
              {tab.id === 'access' && form.hasPortalAccess && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── INFO TAB ── */}
        {formTab === 'info' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 max-w-2xl">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Role *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleRoleChange(r.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      form.role === r.value ? `${r.color} border-current` : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <i className={`${r.icon} text-lg`} />
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 mt-2">
                <i className="ri-information-line mr-1" />
                Selecting a role auto-loads default permissions. You can customise them in the <strong>Portal Access</strong> tab.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Rajesh Kumar" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Personal Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="rajesh@gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Shift</label>
                <select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value as StaffMember['shift'] })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white">
                  {SHIFTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as StaffMember['status'] })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white">
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Joined Date</label>
                <input type="date" value={form.joinedDate} onChange={(e) => setForm({ ...form, joinedDate: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Monthly Salary (₹)</label>
                <input type="number" value={form.salary ?? ''} onChange={(e) => setForm({ ...form, salary: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="25000" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Notes</label>
                <textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Any additional notes..." />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => setFormTab('access')} className="px-6 py-2.5 border border-stone-900 text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap flex items-center gap-2">
                Next: Portal Access <i className="ri-arrow-right-line" />
              </button>
              <button onClick={handleSave} disabled={!form.name} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap disabled:opacity-50">
                {view === 'edit' ? 'Save Changes' : 'Add Staff Member'}
              </button>
            </div>
          </div>
        )}

        {/* ── ACCESS TAB ── */}
        {formTab === 'access' && (
          <div className="space-y-4 max-w-2xl">
            {/* Enable portal access */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Portal Login Access</h4>
                  <p className="text-stone-400 text-xs mt-0.5">Give this staff member a login to access the staff portal with their assigned permissions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, hasPortalAccess: !form.hasPortalAccess })}
                  className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${form.hasPortalAccess ? 'bg-emerald-500' : 'bg-stone-200'}`}
                >
                  <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${form.hasPortalAccess ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {form.hasPortalAccess && (
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Login Email (for staff portal)</label>
                    <input
                      type="email"
                      value={form.loginEmail ?? ''}
                      onChange={(e) => setForm({ ...form, loginEmail: e.target.value })}
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                      placeholder="e.g. rajesh.reception@yourresort.com"
                    />
                    <p className="text-xs text-stone-400 mt-1">This is the email they&apos;ll use to sign in — can be different from personal email</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Login Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.loginPassword ?? ''}
                        onChange={(e) => setForm({ ...form, loginPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 pr-10"
                        placeholder="Set a secure password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 cursor-pointer">
                        <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                    <i className="ri-information-line mt-0.5 shrink-0" />
                    Share these credentials securely with the staff member. They will only see features permitted below.
                  </div>
                </div>
              )}
            </div>

            {/* Permissions config */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Portal Permissions</h4>
                  <p className="text-stone-400 text-xs mt-0.5">Auto-loaded from the <strong>{getRoleInfo(form.role).label}</strong> role. Customise as needed.</p>
                </div>
                <button onClick={resetToRoleDefaults} className="text-xs text-stone-500 hover:text-stone-700 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                  <i className="ri-refresh-line" /> Reset
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {FEATURE_GROUPS.map((group) => {
                  const groupFeatures = ALL_STAFF_FEATURES.filter((f) => f.group === group);
                  const allOn = groupFeatures.every((f) => currentPermsLocal.includes(f.id));
                  const someOn = groupFeatures.some((f) => currentPermsLocal.includes(f.id));
                  const isExpanded = expandedPermissions === `form_${group}`;

                  return (
                    <div key={group} className="border border-stone-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedPermissions(isExpanded ? null : `form_${group}`)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-stone-700">{group}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            allOn ? 'bg-emerald-100 text-emerald-700' : someOn ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'
                          }`}>
                            {groupFeatures.filter((f) => currentPermsLocal.includes(f.id)).length}/{groupFeatures.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (allOn) {
                                setForm({ ...form, permissions: (form.permissions ?? []).filter((p) => !groupFeatures.map((f) => f.id).includes(p as StaffFeature)) });
                              } else {
                                const toAdd = groupFeatures.map((f) => f.id).filter((id) => !(form.permissions ?? []).includes(id as StaffFeature));
                                setForm({ ...form, permissions: [...(form.permissions ?? []), ...toAdd] as StaffFeature[] });
                              }
                            }}
                            className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors cursor-pointer ${allOn ? 'bg-emerald-500' : 'bg-stone-200'}`}
                          >
                            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${allOn ? 'translate-x-4' : 'translate-x-0.5'}`} />
                          </span>
                          <i className={`${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-stone-400 text-sm`} />
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="divide-y divide-stone-50">
                          {groupFeatures.map((feat) => {
                            const isOn = currentPermsLocal.includes(feat.id);
                            return (
                              <div key={feat.id} className="flex items-center justify-between px-4 py-2.5">
                                <div className="flex items-center gap-2.5">
                                  <i className={`${feat.icon} text-sm ${isOn ? 'text-stone-600' : 'text-stone-300'}`} />
                                  <span className={`text-sm ${isOn ? 'text-stone-800' : 'text-stone-400'}`}>{feat.label}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleFeature(feat.id)}
                                  className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors cursor-pointer ${isOn ? 'bg-emerald-500' : 'bg-stone-200'}`}
                                >
                                  <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setFormTab('info')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap flex items-center gap-2">
                <i className="ri-arrow-left-line" /> Back
              </button>
              <button onClick={handleSave} disabled={!form.name} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap disabled:opacity-50">
                {view === 'edit' ? 'Save Changes' : 'Add Staff Member'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-xs text-stone-400 mb-1">Total Staff</p>
          <p className="text-2xl font-bold text-stone-900">{staff.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-xs text-stone-400 mb-1">Active Today</p>
          <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-xs text-stone-400 mb-1">Portal Access</p>
          <p className="text-2xl font-bold text-violet-600">{accessCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-xs text-stone-400 mb-1">Departments</p>
          <p className="text-2xl font-bold text-stone-900">{new Set(staff.map((s) => s.role)).size}</p>
        </div>
      </div>

      {/* Role filter pills */}
      {roleCounts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => setFilterRole('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${filterRole === 'all' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>
            All ({staff.length})
          </button>
          {roleCounts.map((r) => (
            <button key={r.value} onClick={() => setFilterRole(r.value as StaffRole)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap border transition-all ${filterRole === r.value ? `${r.color} border-current` : 'bg-white border-stone-200 text-stone-600'}`}>
              <i className={r.icon} />{r.label} ({r.count})
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800 text-sm">{propertyName} — Staff</h3>
        <div className="flex items-center gap-2">
          {saved && <span className="text-emerald-600 text-xs flex items-center gap-1"><i className="ri-check-line" /> Saved</span>}
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
            <i className="ri-user-add-line" /> Add Staff
          </button>
        </div>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-stone-200">
          <div className="w-14 h-14 flex items-center justify-center bg-emerald-50 rounded-2xl mx-auto mb-4"><i className="ri-team-line text-emerald-400 text-2xl" /></div>
          <p className="font-semibold text-stone-700 mb-2">No staff members yet</p>
          <p className="text-stone-400 text-sm mb-5 max-w-xs mx-auto">Add your team — reception, housekeeping, kitchen, security and more. Assign portal logins and set per-feature permissions.</p>
          <button onClick={openAdd} className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap">Add First Staff Member</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStaff.map((member) => {
            const roleInfo = getRoleInfo(member.role);
            const shiftInfo = SHIFTS.find((s) => s.value === member.shift);
            const perms = member.permissions ?? DEFAULT_ROLE_PERMISSIONS[member.role];
            const permCount = perms.length;

            return (
              <div key={member.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${roleInfo.color} shrink-0`}>
                    <i className={`${roleInfo.icon} text-lg`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-stone-900 text-sm">{member.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${roleInfo.color}`}>{roleInfo.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[member.status]}`}>{member.status === 'on-leave' ? 'On Leave' : member.status}</span>
                      {member.hasPortalAccess ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                          <i className="ri-shield-check-line" /> Portal Access
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-400">
                          <i className="ri-shield-cross-line" /> No Access
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-stone-400 mb-2">
                      {member.phone && <span><i className="ri-phone-line mr-1" />{member.phone}</span>}
                      {shiftInfo && <span><i className="ri-time-line mr-1" />{shiftInfo.label}</span>}
                      {member.salary && <span><i className="ri-money-rupee-circle-line mr-1" />₹{member.salary.toLocaleString('en-IN')}/mo</span>}
                      {member.hasPortalAccess && member.loginEmail && <span><i className="ri-mail-line mr-1" />{member.loginEmail}</span>}
                    </div>
                    {/* Permission summary chips */}
                    <div className="flex flex-wrap gap-1">
                      {perms.slice(0, 5).map((feat) => {
                        const info = ALL_STAFF_FEATURES.find((f) => f.id === feat);
                        if (!info) return null;
                        return (
                          <span key={feat} className="flex items-center gap-1 px-2 py-0.5 bg-stone-50 border border-stone-100 text-stone-500 text-xs rounded-full">
                            <i className={`${info.icon} text-stone-300`} />{info.label}
                          </span>
                        );
                      })}
                      {permCount > 5 && <span className="px-2 py-0.5 bg-stone-50 border border-stone-100 text-stone-400 text-xs rounded-full">+{permCount - 5} more</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => openPermissions(member)} className="flex items-center gap-1.5 px-3 py-1.5 border border-violet-200 bg-violet-50 rounded-lg text-xs font-medium text-violet-700 hover:bg-violet-100 cursor-pointer whitespace-nowrap">
                      <i className="ri-shield-keyhole-line" /> Permissions
                    </button>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(member)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap">
                        <i className="ri-edit-line" /> Edit
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 cursor-pointer whitespace-nowrap">
                        <i className="ri-delete-bin-line" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
