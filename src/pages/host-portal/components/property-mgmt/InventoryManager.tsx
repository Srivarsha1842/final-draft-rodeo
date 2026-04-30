import { useState, useEffect } from 'react';
import { InventoryItem, InventoryCategory } from '@/pages/admin/types';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';

interface Props {
  propertyId: string;
  propertyName: string;
  hostId: string;
}

const CATEGORIES: { value: InventoryCategory; label: string; icon: string; color: string }[] = [
  { value: 'linen', label: 'Linen & Bedding', icon: 'ri-layout-masonry-line', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { value: 'toiletries', label: 'Toiletries', icon: 'ri-drop-line', color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
  { value: 'minibar', label: 'Mini Bar', icon: 'ri-goblet-line', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  { value: 'cleaning', label: 'Cleaning Supplies', icon: 'ri-brush-4-line', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { value: 'kitchen', label: 'Kitchen', icon: 'ri-restaurant-2-line', color: 'bg-orange-50 text-orange-700 border-orange-100' },
  { value: 'maintenance', label: 'Maintenance', icon: 'ri-tools-line', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  { value: 'stationery', label: 'Stationery', icon: 'ri-pen-nib-line', color: 'bg-violet-50 text-violet-700 border-violet-100' },
  { value: 'other', label: 'Other', icon: 'ri-archive-drawer-line', color: 'bg-stone-100 text-stone-600 border-stone-200' },
];

const UNITS = ['pieces', 'sets', 'kg', 'liters', 'packs', 'boxes', 'bottles', 'rolls', 'pairs', 'units'];

const emptyItem = (propertyId: string): InventoryItem => ({
  id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  propertyId,
  name: '',
  category: 'linen',
  unit: 'pieces',
  currentStock: 0,
  minStockLevel: 5,
  costPerUnit: 0,
  supplier: '',
  lastRestocked: '',
  notes: '',
});

const PRESET_ITEMS: { name: string; category: InventoryCategory; unit: string }[] = [
  { name: 'Bath Towels', category: 'linen', unit: 'pieces' },
  { name: 'Bed Sheets', category: 'linen', unit: 'sets' },
  { name: 'Pillow Covers', category: 'linen', unit: 'pieces' },
  { name: 'Shampoo', category: 'toiletries', unit: 'bottles' },
  { name: 'Conditioner', category: 'toiletries', unit: 'bottles' },
  { name: 'Soap Bar', category: 'toiletries', unit: 'pieces' },
  { name: 'Toothbrush', category: 'toiletries', unit: 'pieces' },
  { name: 'Mineral Water', category: 'minibar', unit: 'bottles' },
  { name: 'Soft Drinks', category: 'minibar', unit: 'pieces' },
  { name: 'Snacks Assortment', category: 'minibar', unit: 'packs' },
  { name: 'Floor Cleaner', category: 'cleaning', unit: 'liters' },
  { name: 'Toilet Cleaner', category: 'cleaning', unit: 'bottles' },
  { name: 'Garbage Bags', category: 'cleaning', unit: 'rolls' },
  { name: 'Cooking Gas', category: 'kitchen', unit: 'units' },
  { name: 'Notepad', category: 'stationery', unit: 'pieces' },
  { name: 'Pen', category: 'stationery', unit: 'pieces' },
];

export default function InventoryManager({ propertyId, propertyName }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'restock'>('list');
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<InventoryItem>(emptyItem(propertyId));
  const [filterCat, setFilterCat] = useState<InventoryCategory | 'all'>('all');
  const [filterAlert, setFilterAlert] = useState(false);
  const [restockQty, setRestockQty] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = loadHostData();
    const all: InventoryItem[] = (data as any).inventoryItems ?? [];
    setItems(all.filter((i) => i.propertyId === propertyId));
  }, [propertyId]);

  const persist = (updated: InventoryItem[]) => {
    const data = loadHostData();
    const all: InventoryItem[] = (data as any).inventoryItems ?? [];
    const others = all.filter((i) => i.propertyId !== propertyId);
    (data as any).inventoryItems = [...others, ...updated];
    saveHostData(data);
    setItems(updated);
  };

  const openAdd = () => { setForm(emptyItem(propertyId)); setEditing(null); setView('add'); };
  const openEdit = (item: InventoryItem) => { setEditing(item); setForm({ ...item }); setView('edit'); };
  const openRestock = (item: InventoryItem) => { setEditing(item); setRestockQty(0); setView('restock'); };

  const handleSave = () => {
    if (!form.name) return;
    if (view === 'edit' && editing) {
      persist(items.map((i) => i.id === editing.id ? form : i));
    } else {
      persist([...items, form]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setView('list');
  };

  const handleRestock = () => {
    if (!editing || restockQty <= 0) return;
    persist(items.map((i) => i.id === editing.id ? { ...i, currentStock: i.currentStock + restockQty, lastRestocked: new Date().toISOString().split('T')[0] } : i));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setView('list');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this inventory item?')) return;
    persist(items.filter((i) => i.id !== id));
  };

  const handleAddPreset = (preset: typeof PRESET_ITEMS[0]) => {
    const newItem: InventoryItem = { ...emptyItem(propertyId), name: preset.name, category: preset.category, unit: preset.unit };
    persist([...items, newItem]);
  };

  const lowStockItems = items.filter((i) => i.currentStock <= i.minStockLevel);
  const totalValue = items.reduce((s, i) => s + i.currentStock * i.costPerUnit, 0);

  const filteredItems = items.filter((i) => {
    if (filterAlert && i.currentStock > i.minStockLevel) return false;
    if (filterCat !== 'all' && i.category !== filterCat) return false;
    return true;
  });

  const getCatInfo = (cat: InventoryCategory) => CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[CATEGORIES.length - 1];

  const stockStatus = (item: InventoryItem): 'good' | 'low' | 'out' => {
    if (item.currentStock === 0) return 'out';
    if (item.currentStock <= item.minStockLevel) return 'low';
    return 'good';
  };
  const stockColor: Record<string, string> = {
    good: 'bg-emerald-100 text-emerald-700',
    low: 'bg-amber-100 text-amber-700',
    out: 'bg-red-100 text-red-600',
  };

  // Restock view
  if (view === 'restock' && editing) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer"><i className="ri-arrow-left-line text-xl" /></button>
          <div>
            <h3 className="text-xl font-bold text-stone-900">Restock: {editing.name}</h3>
            <p className="text-stone-400 text-xs">{propertyName}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-md space-y-5">
          <div className="p-4 bg-stone-50 rounded-xl">
            <p className="text-sm text-stone-500 mb-1">Current Stock</p>
            <p className="text-2xl font-bold text-stone-900">{editing.currentStock} <span className="text-sm font-normal text-stone-400">{editing.unit}</span></p>
            <p className="text-xs text-stone-400 mt-1">Min level: {editing.minStockLevel} {editing.unit}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Quantity to Add ({editing.unit})</label>
            <input
              type="number"
              value={restockQty || ''}
              min={1}
              onChange={(e) => setRestockQty(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
              placeholder="e.g. 20"
            />
            {restockQty > 0 && (
              <p className="text-xs text-stone-500 mt-1.5">New stock will be: <strong>{editing.currentStock + restockQty} {editing.unit}</strong></p>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
            <button onClick={handleRestock} disabled={restockQty <= 0} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 cursor-pointer whitespace-nowrap disabled:opacity-50">
              <i className="ri-add-box-line mr-1" />Confirm Restock
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add/Edit form
  if (view === 'add' || view === 'edit') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer"><i className="ri-arrow-left-line text-xl" /></button>
          <div>
            <h3 className="text-xl font-bold text-stone-900">{view === 'edit' ? 'Edit Item' : 'Add Inventory Item'}</h3>
            <p className="text-stone-400 text-xs">{propertyName}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-2xl space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${form.category === cat.value ? `${cat.color} border-current` : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}
                >
                  <i className={`${cat.icon} text-lg`} />{cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Item Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Bath Towels" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Current Stock</label>
              <input type="number" value={form.currentStock} min={0} onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Min Stock Alert Level</label>
              <input type="number" value={form.minStockLevel} min={0} onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" />
              <p className="text-xs text-stone-400 mt-1">Alert when stock falls to or below this</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Cost Per Unit (₹)</label>
              <input type="number" value={form.costPerUnit || ''} onChange={(e) => setForm({ ...form, costPerUnit: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Supplier</label>
              <input value={form.supplier ?? ''} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="Supplier name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Last Restocked</label>
              <input type="date" value={form.lastRestocked ?? ''} onChange={(e) => setForm({ ...form, lastRestocked: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Notes</label>
              <textarea value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Storage location, brand preference, etc." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
            <button onClick={handleSave} disabled={!form.name} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap disabled:opacity-50">
              {view === 'edit' ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-xs text-stone-400 mb-1">Total Items</p>
          <p className="text-2xl font-bold text-stone-900">{items.length}</p>
        </div>
        <div className={`rounded-xl border p-4 ${lowStockItems.length > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-stone-200'}`}>
          <p className="text-xs text-stone-400 mb-1">Low Stock Alerts</p>
          <p className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-amber-600' : 'text-stone-900'}`}>{lowStockItems.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-xs text-stone-400 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-500">{items.filter((i) => i.currentStock === 0).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-xs text-stone-400 mb-1">Inventory Value</p>
          <p className="text-2xl font-bold text-stone-900">₹{totalValue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Low stock alert banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <i className="ri-alert-line text-amber-500 text-xl shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm mb-1">Low Stock Alert — {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} need restocking</p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((i) => (
                <button key={i.id} onClick={() => openRestock(i)} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-amber-200 rounded-full text-xs text-amber-700 cursor-pointer hover:bg-amber-100 whitespace-nowrap">
                  <i className="ri-refresh-line text-xs" />{i.name}: {i.currentStock} left
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters + actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5 flex-1">
          <button onClick={() => { setFilterCat('all'); setFilterAlert(false); }} className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${filterCat === 'all' && !filterAlert ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>All ({items.length})</button>
          <button onClick={() => { setFilterAlert(!filterAlert); setFilterCat('all'); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap border transition-all ${filterAlert ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white border-stone-200 text-stone-600'}`}>
            <i className="ri-alert-line" />Low Stock ({lowStockItems.length})
          </button>
          {CATEGORIES.filter((c) => items.some((i) => i.category === c.value)).map((cat) => (
            <button key={cat.value} onClick={() => { setFilterCat(cat.value); setFilterAlert(false); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap border transition-all ${filterCat === cat.value && !filterAlert ? `${cat.color} border-current` : 'bg-white border-stone-200 text-stone-600'}`}>
              <i className={cat.icon} />{cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-emerald-600 text-xs flex items-center gap-1"><i className="ri-check-line" /> Saved</span>}
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" /> Add Item
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="space-y-4">
          <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-stone-200">
            <div className="w-14 h-14 flex items-center justify-center bg-violet-50 rounded-2xl mx-auto mb-4"><i className="ri-archive-drawer-line text-violet-400 text-2xl" /></div>
            <p className="font-semibold text-stone-700 mb-2">No inventory tracked yet</p>
            <p className="text-stone-400 text-sm mb-4 max-w-xs mx-auto">Start tracking your resort supplies — linen, toiletries, mini bar, cleaning supplies and more.</p>
          </div>
          {/* Quick-add preset items */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <p className="text-sm font-semibold text-stone-700 mb-3">Quick Add Common Items</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_ITEMS.map((preset) => {
                const cat = getCatInfo(preset.category);
                return (
                  <button key={preset.name} onClick={() => handleAddPreset(preset)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer whitespace-nowrap transition-all hover:scale-105 ${cat.color}`}>
                    <i className={`${cat.icon} text-xs`} />+ {preset.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const catInfo = getCatInfo(item.category);
            const status = stockStatus(item);
            const stockPct = item.minStockLevel > 0 ? Math.min((item.currentStock / (item.minStockLevel * 3)) * 100, 100) : 100;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-xl border shrink-0 ${catInfo.color}`}>
                    <i className={`${catInfo.icon} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-stone-900 text-sm">{item.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockColor[status]}`}>
                        {status === 'out' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-stone-400 mb-2">
                      <span><strong className="text-stone-700">{item.currentStock}</strong> {item.unit} available</span>
                      <span>Min: {item.minStockLevel} {item.unit}</span>
                      {item.costPerUnit > 0 && <span>₹{item.costPerUnit}/{item.unit}</span>}
                      {item.supplier && <span><i className="ri-store-2-line mr-0.5" />{item.supplier}</span>}
                      {item.lastRestocked && <span><i className="ri-calendar-check-line mr-0.5" />Last: {item.lastRestocked}</span>}
                    </div>
                    {/* Stock bar */}
                    <div className="w-full bg-stone-100 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all ${status === 'out' ? 'bg-red-400' : status === 'low' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${stockPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => openRestock(item)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-100 cursor-pointer whitespace-nowrap">
                      <i className="ri-add-box-line" />Restock
                    </button>
                    <button onClick={() => openEdit(item)} className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg text-stone-400 hover:bg-stone-50 cursor-pointer">
                      <i className="ri-edit-line text-xs" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-7 h-7 flex items-center justify-center border border-red-100 rounded-lg text-red-400 hover:bg-red-50 cursor-pointer">
                      <i className="ri-delete-bin-line text-xs" />
                    </button>
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
