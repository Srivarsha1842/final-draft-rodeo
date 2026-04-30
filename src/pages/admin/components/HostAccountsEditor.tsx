import { useState } from 'react';
import { HostAccount, ResortOwnerPackage, PACKAGE_ACCESS } from '../types';
import { loadHostData, saveHostData } from '../hostStore';

const packageOptions: { value: ResortOwnerPackage; label: string; price: string; color: string; ring: string }[] = [
  { value: 'basic', label: 'Basic', price: '₹4,999/mo', color: 'bg-stone-100 text-stone-700', ring: 'ring-stone-400' },
  { value: 'standard', label: 'Standard', price: '₹9,999/mo', color: 'bg-amber-100 text-amber-800', ring: 'ring-amber-400' },
  { value: 'premium', label: 'Premium', price: '₹19,999/mo', color: 'bg-emerald-100 text-emerald-800', ring: 'ring-emerald-400' },
];

function PackageBadge({ pkg }: { pkg?: ResortOwnerPackage }) {
  if (!pkg) return <span className="text-xs text-stone-400 italic">No package</span>;
  const opt = packageOptions.find(o => o.value === pkg);
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${opt?.color}`}>
      {opt?.label}
    </span>
  );
}

export default function HostAccountsEditor() {
  const [hostData, setHostData] = useState(() => loadHostData());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHost, setEditingHost] = useState<HostAccount | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [expandedAccess, setExpandedAccess] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    status: 'active' as 'active' | 'suspended',
    package: 'basic' as ResortOwnerPackage,
  });
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', phone: '', status: 'active', package: 'basic' });
    setFormError('');
  };

  const openAdd = () => {
    resetForm();
    setEditingHost(null);
    setShowAddModal(true);
  };

  const openEdit = (host: HostAccount) => {
    setForm({
      name: host.name,
      email: host.email,
      password: host.password,
      phone: host.phone,
      status: host.status,
      package: host.package ?? 'basic',
    });
    setEditingHost(host);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError('Name, email, and password are required.');
      return;
    }
    const updated = { ...hostData };
    if (editingHost) {
      const idx = updated.accounts.findIndex((a) => a.id === editingHost.id);
      if (idx >= 0) updated.accounts[idx] = { ...editingHost, ...form };
    } else {
      const existing = updated.accounts.find((a) => a.email === form.email);
      if (existing) { setFormError('An account with this email already exists.'); return; }
      const newHost: HostAccount = {
        id: `host_${Date.now()}`,
        ...form,
        createdAt: new Date().toISOString(),
      };
      updated.accounts.push(newHost);
    }
    saveHostData(updated);
    setHostData(updated);
    setShowAddModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleStatus = (hostId: string) => {
    const updated = { ...hostData };
    const idx = updated.accounts.findIndex((a) => a.id === hostId);
    if (idx >= 0) {
      updated.accounts[idx].status = updated.accounts[idx].status === 'active' ? 'suspended' : 'active';
      saveHostData(updated);
      setHostData({ ...updated });
    }
  };

  const deleteHost = (hostId: string) => {
    if (!window.confirm('Delete this property owner account? Their properties and bookings will be kept but unassigned.')) return;
    const updated = { ...hostData };
    updated.accounts = updated.accounts.filter((a) => a.id !== hostId);
    saveHostData(updated);
    setHostData({ ...updated });
  };

  const getHostPropertyCount = (hostId: string) =>
    hostData.properties.filter((p) => p.hostId === hostId).length;

  const getHostBookingCount = (hostId: string) =>
    hostData.bookings.filter((b) => b.hostId === hostId).length;

  const getHostEarnings = (hostId: string) =>
    hostData.bookings
      .filter((b) => b.hostId === hostId && b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.hostEarnings, 0);

  const toggleShowPassword = (id: string) =>
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAccess = (id: string) =>
    setExpandedAccess((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedPkgInfo = PACKAGE_ACCESS[form.package];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Resort Owner Accounts</h2>
          <p className="text-stone-500 text-sm mt-1">Create and manage resort owner login credentials & package access</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-600 text-sm flex items-center gap-1">
              <i className="ri-check-line" /> Saved!
            </span>
          )}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-user-add-line" />
            Add Resort Owner
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Owners', value: hostData.accounts.length, icon: 'ri-user-3-line', color: 'bg-stone-100 text-stone-700' },
          { label: 'Active', value: hostData.accounts.filter((a) => a.status === 'active').length, icon: 'ri-check-line', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Premium', value: hostData.accounts.filter((a) => a.package === 'premium').length, icon: 'ri-vip-crown-line', color: 'bg-amber-50 text-amber-700' },
          { label: 'Suspended', value: hostData.accounts.filter((a) => a.status === 'suspended').length, icon: 'ri-close-circle-line', color: 'bg-red-50 text-red-700' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 flex items-center gap-3 ${stat.color}`}>
            <div className="w-10 h-10 flex items-center justify-center bg-white/60 rounded-lg">
              <i className={`${stat.icon} text-lg`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs opacity-70">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Package legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {packageOptions.map((opt) => {
          const info = PACKAGE_ACCESS[opt.value];
          return (
            <div key={opt.value} className={`rounded-xl border-2 p-4 ${opt.value === 'standard' ? 'border-amber-300' : opt.value === 'premium' ? 'border-emerald-300' : 'border-stone-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${opt.color}`}>{opt.label}</span>
                <span className="text-xs text-stone-500 font-semibold">{opt.price}</span>
              </div>
              <ul className="space-y-1">
                {info.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
                    <i className="ri-check-line text-emerald-500 text-xs" />{f}
                  </li>
                ))}
                {info.features.length > 3 && (
                  <li className="text-xs text-stone-400">+{info.features.length - 3} more features</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Owner list */}
      <div className="space-y-4">
        {hostData.accounts.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <i className="ri-building-4-line text-4xl mb-3 block" />
            <p className="font-medium">No resort owner accounts yet</p>
            <p className="text-sm mt-1">Add the first resort owner above</p>
          </div>
        )}
        {hostData.accounts.map((host) => (
          <div key={host.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full shrink-0">
                <i className="ri-user-3-line text-stone-500 text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-stone-900">{host.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    host.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {host.status}
                  </span>
                  <PackageBadge pkg={host.package} />
                </div>
                <p className="text-stone-500 text-sm">{host.email} · {host.phone}</p>

                {/* Credentials box */}
                <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-2">Login Credentials</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <span className="text-stone-400 text-xs">Email: </span>
                      <span className="font-mono text-stone-700">{host.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400 text-xs">Password: </span>
                      <span className="font-mono text-stone-700">
                        {showPassword[host.id] ? host.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => toggleShowPassword(host.id)}
                        className="ml-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        <i className={showPassword[host.id] ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Package Access */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleAccess(host.id)}
                    className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer transition-colors"
                  >
                    <i className="ri-shield-keyhole-line text-stone-400" />
                    Portal Access ({PACKAGE_ACCESS[host.package ?? 'basic'].sections.length} sections)
                    <i className={`ri-arrow-down-s-line transition-transform ${expandedAccess[host.id] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedAccess[host.id] && (
                    <div className="mt-2 p-3 bg-stone-50 rounded-lg border border-stone-100">
                      <p className="text-xs text-stone-400 mb-2 font-semibold uppercase tracking-wide">
                        {PACKAGE_ACCESS[host.package ?? 'basic'].label} Package — Accessible sections:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {PACKAGE_ACCESS[host.package ?? 'basic'].sections.map((sec) => (
                          <span key={sec} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full capitalize">
                            {sec.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-stone-400 mt-2 font-semibold uppercase tracking-wide mb-1">Features included:</p>
                      <ul className="space-y-0.5">
                        {PACKAGE_ACCESS[host.package ?? 'basic'].features.map((f, i) => (
                          <li key={i} className="text-xs text-stone-600 flex items-center gap-1.5">
                            <i className="ri-check-line text-emerald-500" />{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-5 mt-3">
                  <div className="text-center">
                    <p className="text-sm font-bold text-stone-900">{getHostPropertyCount(host.id)}</p>
                    <p className="text-xs text-stone-400">Properties</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-stone-900">{getHostBookingCount(host.id)}</p>
                    <p className="text-xs text-stone-400">Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-amber-600">₹{getHostEarnings(host.id).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-stone-400">Total Earned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-stone-500">{new Date(host.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="text-xs text-stone-400">Joined</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(host)}
                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit"
                >
                  <i className="ri-edit-line text-sm" />
                </button>
                <button
                  onClick={() => toggleStatus(host.id)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    host.status === 'active'
                      ? 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'
                      : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title={host.status === 'active' ? 'Suspend' : 'Activate'}
                >
                  <i className={host.status === 'active' ? 'ri-forbid-line text-sm' : 'ri-check-line text-sm'} />
                </button>
                <button
                  onClick={() => deleteHost(host.id)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900">
                {editingHost ? 'Edit Resort Owner Account' : 'Add Resort Owner'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                  placeholder="Ananya Krishnan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                  placeholder="ananya@resort.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Password *</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 font-mono"
                  placeholder="Create a strong password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Package / Access Level *</label>
                <div className="space-y-2">
                  {packageOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        form.package === opt.value ? `${opt.ring} ring-2` : 'border-stone-200 hover:border-stone-300'
                      } border-stone-200`}
                    >
                      <input
                        type="radio"
                        name="pkg"
                        value={opt.value}
                        checked={form.package === opt.value}
                        onChange={() => setForm({ ...form, package: opt.value })}
                        className="mt-1 accent-stone-900"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${opt.color}`}>{opt.label}</span>
                          <span className="text-xs text-stone-500 font-semibold">{opt.price}</span>
                        </div>
                        <p className="text-xs text-stone-500">{PACKAGE_ACCESS[opt.value].features.slice(0, 2).join(' · ')}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live access preview */}
              {form.package && (
                <div className={`p-3 rounded-xl border ${form.package === 'premium' ? 'bg-emerald-50 border-emerald-200' : form.package === 'standard' ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-200'}`}>
                  <p className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                    <i className="ri-shield-keyhole-line" />
                    Portal sections this owner can access:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPkgInfo.sections.map((sec) => (
                      <span key={sec} className="text-xs bg-white text-stone-600 border border-stone-200 px-2 py-0.5 rounded-full capitalize">
                        {sec.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'suspended' })}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {formError && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <i className="ri-error-warning-line" /> {formError}
                </p>
              )}
            </div>
            <div className="p-5 border-t border-stone-100 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {editingHost ? 'Update Owner' : 'Create Owner Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
