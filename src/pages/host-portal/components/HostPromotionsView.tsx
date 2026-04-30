import { useState } from 'react';
import { Promotion, PromotionType, HostProperty } from '@/pages/admin/types';
import {
  addPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionPause,
} from '@/pages/admin/hostStore';

interface Props {
  hostId: string;
  promotions: Promotion[];
  properties: HostProperty[];
  onUpdate: (updated: Promotion[]) => void;
}

type FilterTab = 'all' | 'active' | 'scheduled' | 'paused' | 'expired';

const typeConfig: Record<PromotionType, { label: string; icon: string; color: string }> = {
  percentage: { label: 'Percentage Off', icon: 'ri-percent-line', color: 'bg-violet-100 text-violet-700' },
  flat: { label: 'Flat Discount', icon: 'ri-money-rupee-circle-line', color: 'bg-emerald-100 text-emerald-700' },
  early_bird: { label: 'Early Bird', icon: 'ri-time-line', color: 'bg-sky-100 text-sky-700' },
  last_minute: { label: 'Last Minute', icon: 'ri-flashlight-line', color: 'bg-orange-100 text-orange-700' },
  long_stay: { label: 'Long Stay', icon: 'ri-moon-line', color: 'bg-amber-100 text-amber-700' },
};

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  active:    { label: 'Active',    dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  scheduled: { label: 'Scheduled', dot: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700' },
  paused:    { label: 'Paused',    dot: 'bg-stone-400',   badge: 'bg-stone-100 text-stone-500' },
  expired:   { label: 'Expired',   dot: 'bg-red-400',     badge: 'bg-red-50 text-red-400' },
};

const emptyForm = (): Omit<Promotion, 'id' | 'hostId' | 'createdAt' | 'usageCount' | 'status'> => ({
  title: '',
  description: '',
  type: 'percentage',
  discountValue: 10,
  promoCode: '',
  propertyIds: [],
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  minNights: undefined,
  maxUsage: undefined,
});

export default function HostPromotionsView({ hostId, promotions, properties, onUpdate }: Props) {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = promotions.filter((p) => filterTab === 'all' || p.status === filterTab);

  const tabCounts: Record<FilterTab, number> = {
    all: promotions.length,
    active: promotions.filter((p) => p.status === 'active').length,
    scheduled: promotions.filter((p) => p.status === 'scheduled').length,
    paused: promotions.filter((p) => p.status === 'paused').length,
    expired: promotions.filter((p) => p.status === 'expired').length,
  };

  const openAdd = () => {
    setForm(emptyForm());
    setEditing(null);
    setFormError('');
    setView('add');
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      type: p.type,
      discountValue: p.discountValue,
      promoCode: p.promoCode ?? '',
      propertyIds: [...p.propertyIds],
      startDate: p.startDate,
      endDate: p.endDate,
      minNights: p.minNights,
      maxUsage: p.maxUsage,
    });
    setFormError('');
    setView('edit');
  };

  const handleSave = () => {
    setFormError('');
    if (!form.title.trim()) { setFormError('Promotion title is required.'); return; }
    if (!form.endDate) { setFormError('End date is required.'); return; }
    if (form.endDate < form.startDate) { setFormError('End date must be after start date.'); return; }
    if (form.discountValue <= 0) { setFormError('Discount value must be greater than 0.'); return; }
    if (form.type === 'percentage' && form.discountValue > 100) { setFormError('Percentage discount cannot exceed 100%.'); return; }

    const today = new Date().toISOString().split('T')[0];
    const newStatus: Promotion['status'] =
      form.endDate < today ? 'expired' : form.startDate > today ? 'scheduled' : 'active';

    if (view === 'edit' && editing) {
      const updated: Promotion = { ...editing, ...form, status: newStatus, promoCode: form.promoCode || undefined };
      updatePromotion(updated);
      onUpdate(promotions.map((p) => (p.id === editing.id ? updated : p)));
    } else {
      const newPromo: Promotion = {
        id: `promo_${Date.now()}`,
        hostId,
        usageCount: 0,
        status: newStatus,
        createdAt: new Date().toISOString(),
        ...form,
        promoCode: form.promoCode || undefined,
      };
      addPromotion(newPromo);
      onUpdate([newPromo, ...promotions]);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    setView('list');
  };

  const handleDelete = (id: string) => {
    deletePromotion(id);
    onUpdate(promotions.filter((p) => p.id !== id));
    setConfirmDelete(null);
  };

  const handleTogglePause = (p: Promotion) => {
    if (p.status === 'expired') return;
    togglePromotionPause(hostId, p.id);
    const today = new Date().toISOString().split('T')[0];
    onUpdate(promotions.map((x) => {
      if (x.id !== p.id) return x;
      if (x.status === 'paused') {
        const s = x.startDate <= today && x.endDate >= today ? 'active' : x.startDate > today ? 'scheduled' : 'expired';
        return { ...x, status: s as Promotion['status'] };
      }
      return { ...x, status: 'paused' as const };
    }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleProperty = (id: string) => {
    setForm((f) => ({
      ...f,
      propertyIds: f.propertyIds.includes(id)
        ? f.propertyIds.filter((x) => x !== id)
        : [...f.propertyIds, id],
    }));
  };

  const discountLabel = (p: Promotion) =>
    p.type === 'percentage' ? `${p.discountValue}% OFF` : `₹${p.discountValue.toLocaleString('en-IN')} OFF`;

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  if (view === 'add' || view === 'edit') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer">
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{view === 'edit' ? 'Edit Promotion' : 'Create Promotion'}</h2>
            <p className="text-stone-400 text-sm">Set up a discount or special offer for your guests</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-5">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <i className="ri-error-warning-line" />
              {formError}
            </div>
          )}

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
              <i className="ri-information-line text-stone-400" /> Basic Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Promotion Title <span className="text-red-400">*</span></label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                placeholder="e.g. Summer Splash Deal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none"
                placeholder="Describe what makes this deal special..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Promo Code <span className="text-stone-400 font-normal">(optional)</span></label>
              <input
                value={form.promoCode}
                onChange={(e) => setForm({ ...form, promoCode: e.target.value.toUpperCase().replace(/\s/g, '') })}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 uppercase tracking-widest"
                placeholder="e.g. SUMMER20"
                maxLength={20}
              />
              <p className="text-stone-400 text-xs mt-1">Leave empty for automatic discount (no code required)</p>
            </div>
          </div>

          {/* Discount */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
              <i className="ri-price-tag-3-line text-stone-400" /> Discount Configuration
            </h3>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Promotion Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(typeConfig) as PromotionType[]).map((t) => {
                  const cfg = typeConfig[t];
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all cursor-pointer whitespace-nowrap ${
                        form.type === t
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <i className={cfg.icon} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Discount Value <span className="text-red-400">*</span>
                  <span className="ml-1 text-stone-400 font-normal">
                    {form.type === 'percentage' ? '(%)' : '(₹)'}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.discountValue || ''}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 pr-10 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                    placeholder={form.type === 'percentage' ? '15' : '2000'}
                    min={1}
                    max={form.type === 'percentage' ? 100 : undefined}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">
                    {form.type === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Max Usages <span className="text-stone-400 font-normal">(optional)</span></label>
                <input
                  type="number"
                  value={form.maxUsage ?? ''}
                  onChange={(e) => setForm({ ...form, maxUsage: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                  placeholder="Unlimited"
                  min={1}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Minimum Nights <span className="text-stone-400 font-normal">(optional)</span></label>
              <input
                type="number"
                value={form.minNights ?? ''}
                onChange={(e) => setForm({ ...form, minNights: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                placeholder="e.g. 3 nights minimum"
                min={1}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
              <i className="ri-calendar-event-line text-stone-400" /> Validity Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Start Date <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">End Date <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
              <i className="ri-building-line text-stone-400" /> Applicable Properties
            </h3>
            <p className="text-stone-400 text-xs -mt-2">Leave all unselected to apply to all properties</p>
            <div className="space-y-2">
              {properties.map((p) => (
                <label key={p.id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    form.propertyIds.includes(p.id) ? 'bg-stone-900 border-stone-900' : 'border-stone-300'
                  }`} onClick={() => toggleProperty(p.id)}>
                    {form.propertyIds.includes(p.id) && <i className="ri-check-line text-white text-xs" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{p.name}</p>
                    <p className="text-xs text-stone-400">{p.location} · ₹{p.pricePerNight.toLocaleString('en-IN')}/night</p>
                  </div>
                  {p.images[0] && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                </label>
              ))}
              {properties.length === 0 && (
                <p className="text-stone-400 text-sm text-center py-3">No properties yet — promotion will apply globally</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setView('list')}
              className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap"
            >
              {view === 'edit' ? 'Save Changes' : 'Create Promotion'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'paused', label: 'Paused' },
    { id: 'expired', label: 'Expired' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Promotions & Discounts</h1>
          <p className="text-stone-500 text-sm mt-1">Create special offers and seasonal deals to attract more guests</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line" /> New Promotion
        </button>
      </div>

      {/* Save success toast */}
      {saveSuccess && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
          <i className="ri-checkbox-circle-line" /> Promotion saved successfully!
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Promotions', value: promotions.length, icon: 'ri-price-tag-3-line', color: 'text-stone-700' },
          { label: 'Active Now', value: tabCounts.active, icon: 'ri-flashlight-line', color: 'text-emerald-600' },
          { label: 'Scheduled', value: tabCounts.scheduled, icon: 'ri-calendar-event-line', color: 'text-amber-600' },
          { label: 'Total Redemptions', value: promotions.reduce((s, p) => s + p.usageCount, 0), icon: 'ri-user-heart-line', color: 'text-stone-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <i className={`${s.icon} ${s.color} text-base`} />
              <span className="text-stone-400 text-xs">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-5 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterTab === tab.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
            {tabCounts[tab.id] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                filterTab === tab.id ? 'bg-stone-100 text-stone-600' : 'bg-stone-200/60 text-stone-500'
              }`}>
                {tabCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
            <i className="ri-price-tag-3-line text-stone-400 text-3xl" />
          </div>
          <p className="font-semibold text-stone-700 mb-2">
            {filterTab === 'all' ? 'No promotions yet' : `No ${filterTab} promotions`}
          </p>
          <p className="text-stone-400 text-sm mb-6">
            {filterTab === 'all' ? 'Create your first offer to attract more bookings' : `Switch to "All" or create a new promotion`}
          </p>
          {filterTab === 'all' && (
            <button onClick={openAdd} className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap">
              Create Your First Promotion
            </button>
          )}
        </div>
      )}

      {/* Promotion cards */}
      <div className="space-y-4">
        {filtered.map((p) => {
          const sc = statusConfig[p.status] ?? statusConfig.expired;
          const tc = typeConfig[p.type];
          const isExpired = p.status === 'expired';
          const appliedProps = p.propertyIds.length === 0
            ? 'All properties'
            : properties.filter((x) => p.propertyIds.includes(x.id)).map((x) => x.name).join(', ') || 'All properties';
          const usagePct = p.maxUsage ? Math.round((p.usageCount / p.maxUsage) * 100) : null;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                isExpired ? 'border-stone-100 opacity-60' : 'border-stone-200'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  {/* Left: title + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-stone-900 text-base leading-tight">{p.title}</h3>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-stone-500 text-sm leading-relaxed">{p.description}</p>
                  </div>

                  {/* Discount badge */}
                  <div className="flex-shrink-0 text-right">
                    <div className={`inline-flex flex-col items-center px-4 py-2 rounded-xl ${
                      isExpired ? 'bg-stone-100' : 'bg-stone-900'
                    }`}>
                      <span className={`text-xl font-bold leading-tight ${isExpired ? 'text-stone-400' : 'text-amber-400'}`}>
                        {discountLabel(p)}
                      </span>
                      <span className={`text-xs ${isExpired ? 'text-stone-400' : 'text-stone-400'}`}>{tc.label}</span>
                    </div>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 flex-wrap text-xs text-stone-500 mb-4">
                  <span className="flex items-center gap-1">
                    <i className="ri-calendar-line" />
                    {new Date(p.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                    {new Date(p.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {p.minNights && (
                    <span className="flex items-center gap-1">
                      <i className="ri-moon-line" />
                      Min {p.minNights} nights
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <i className="ri-building-line" />
                    {appliedProps}
                  </span>
                </div>

                {/* Usage bar */}
                {p.maxUsage && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-stone-400 mb-1">
                      <span>Usage</span>
                      <span>{p.usageCount} / {p.maxUsage} redeemed</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usagePct! >= 90 ? 'bg-red-400' : usagePct! >= 60 ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(usagePct!, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                {!p.maxUsage && (
                  <div className="mb-4 flex items-center gap-1 text-xs text-stone-400">
                    <i className="ri-user-heart-line" />
                    {p.usageCount} redemption{p.usageCount !== 1 ? 's' : ''}
                  </div>
                )}

                {/* Promo code + actions */}
                <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-stone-100">
                  {p.promoCode ? (
                    <button
                      onClick={() => handleCopyCode(p.promoCode!)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold text-stone-700 hover:bg-stone-100 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <i className={copied === p.promoCode ? 'ri-check-line text-emerald-500' : 'ri-file-copy-line'} />
                      {copied === p.promoCode ? 'Copied!' : p.promoCode}
                    </button>
                  ) : (
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <i className="ri-price-tag-line" /> Auto-applied
                    </span>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    {!isExpired && (
                      <button
                        onClick={() => handleTogglePause(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap transition-colors"
                      >
                        <i className={p.status === 'paused' ? 'ri-play-line' : 'ri-pause-line'} />
                        {p.status === 'paused' ? 'Resume' : 'Pause'}
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <i className="ri-edit-line" /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <i className="ri-delete-bin-line" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center bg-red-50 rounded-xl mb-4 mx-auto">
              <i className="ri-delete-bin-line text-red-500 text-xl" />
            </div>
            <h3 className="font-bold text-stone-900 text-center mb-2">Delete Promotion?</h3>
            <p className="text-stone-500 text-sm text-center mb-5">This action cannot be undone. The promotion will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 cursor-pointer whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
