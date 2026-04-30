import { useState, useEffect } from 'react';
import { PropertyRoomType } from '@/pages/admin/types';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';

interface Props {
  propertyId: string;
  propertyName: string;
  hostId: string;
}

const emptyRoom = (propertyId: string): PropertyRoomType => ({
  id: `rt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  propertyId,
  name: '',
  totalRooms: 1,
  pricePerNight: 0,
  capacity: 2,
  bedType: 'King Bed',
  size: '',
  amenities: [],
  images: [],
  description: '',
  status: 'available',
  availableRooms: 1,
});

const BED_TYPES = ['King Bed', 'Queen Bed', 'Twin Beds', 'Double Bed', 'Single Bed', 'Sofa Bed', 'Bunk Beds'];

const AMENITY_PRESETS = [
  'Air Conditioning', 'Private Balcony', 'Sea View', 'Mountain View', 'Garden View',
  'Mini Bar', 'Smart TV', 'Jacuzzi', 'Bathtub', 'Rain Shower', 'Work Desk',
  'Wi-Fi', 'Room Service', 'Safe Deposit Box', 'Complimentary Breakfast',
  'Private Pool', 'Butler Service', 'Kitchenette',
];

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700',
  occupied: 'bg-amber-100 text-amber-700',
  maintenance: 'bg-rose-100 text-rose-600',
};

export default function RoomsManager({ propertyId, propertyName }: Props) {
  const [rooms, setRooms] = useState<PropertyRoomType[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editing, setEditing] = useState<PropertyRoomType | null>(null);
  const [form, setForm] = useState<PropertyRoomType>(emptyRoom(propertyId));
  const [amenityInput, setAmenityInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = loadHostData();
    const all: PropertyRoomType[] = (data as any).roomTypes ?? [];
    setRooms(all.filter((r) => r.propertyId === propertyId));
  }, [propertyId]);

  const persist = (updated: PropertyRoomType[]) => {
    const data = loadHostData();
    const all: PropertyRoomType[] = (data as any).roomTypes ?? [];
    const others = all.filter((r) => r.propertyId !== propertyId);
    (data as any).roomTypes = [...others, ...updated];
    saveHostData(data);
    setRooms(updated);
  };

  const openAdd = () => { setForm(emptyRoom(propertyId)); setEditing(null); setView('add'); };
  const openEdit = (r: PropertyRoomType) => { setEditing(r); setForm({ ...r, amenities: [...r.amenities], images: [...r.images] }); setView('edit'); };

  const handleSave = () => {
    if (!form.name || !form.pricePerNight) return;
    const final = { ...form, availableRooms: Math.min(form.availableRooms, form.totalRooms) };
    if (view === 'edit' && editing) {
      persist(rooms.map((r) => r.id === editing.id ? final : r));
    } else {
      persist([...rooms, final]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setView('list');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this room type?')) return;
    persist(rooms.filter((r) => r.id !== id));
  };

  const addAmenity = (a: string) => {
    if (a.trim() && !form.amenities.includes(a.trim())) {
      setForm({ ...form, amenities: [...form.amenities, a.trim()] });
      setAmenityInput('');
    }
  };

  const totalRooms = rooms.reduce((s, r) => s + r.totalRooms, 0);
  const availableRooms = rooms.reduce((s, r) => s + r.availableRooms, 0);
  const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;

  if (view === 'add' || view === 'edit') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer"><i className="ri-arrow-left-line text-xl" /></button>
          <div>
            <h3 className="text-xl font-bold text-stone-900">{view === 'edit' ? 'Edit Room Type' : 'Add Room Type'}</h3>
            <p className="text-stone-400 text-xs">{propertyName}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Room Type Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                placeholder="e.g. Deluxe Suite, Presidential Villa, Standard Room"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Total Rooms of This Type</label>
              <input
                type="number"
                value={form.totalRooms}
                min={1}
                onChange={(e) => setForm({ ...form, totalRooms: Number(e.target.value), availableRooms: Math.min(form.availableRooms, Number(e.target.value)) })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Currently Available</label>
              <input
                type="number"
                value={form.availableRooms}
                min={0}
                max={form.totalRooms}
                onChange={(e) => setForm({ ...form, availableRooms: Math.min(Number(e.target.value), form.totalRooms) })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Price Per Night (₹) *</label>
              <input
                type="number"
                value={form.pricePerNight || ''}
                onChange={(e) => setForm({ ...form, pricePerNight: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                placeholder="12000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Max Guests per Room</label>
              <input
                type="number"
                value={form.capacity}
                min={1}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Bed Type</label>
              <select
                value={form.bedType}
                onChange={(e) => setForm({ ...form, bedType: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white"
              >
                {BED_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Room Size</label>
              <input
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                placeholder="e.g. 45 sqm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PropertyRoomType['status'] })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>

            {/* Amenities */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Room Amenities</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100">
                    {a}
                    <button type="button" onClick={() => setForm({ ...form, amenities: form.amenities.filter((x) => x !== a) })} className="cursor-pointer text-amber-400 hover:text-red-500"><i className="ri-close-line" /></button>
                  </span>
                ))}
              </div>
              {/* Quick presets */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {AMENITY_PRESETS.filter((a) => !form.amenities.includes(a)).slice(0, 8).map((a) => (
                  <button key={a} type="button" onClick={() => addAmenity(a)} className="px-2.5 py-1 border border-stone-200 text-stone-500 text-xs rounded-full hover:border-amber-300 hover:text-amber-700 cursor-pointer whitespace-nowrap">+ {a}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(amenityInput))}
                  className="flex-1 px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                  placeholder="Add custom amenity..."
                />
                <button type="button" onClick={() => addAmenity(amenityInput)} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 resize-none"
                placeholder="Describe this room type..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
            <button onClick={handleSave} disabled={!form.name || !form.pricePerNight} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap disabled:opacity-50">
              {view === 'edit' ? 'Save Changes' : 'Add Room Type'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Room Types', value: rooms.length, icon: 'ri-home-4-line', color: 'bg-amber-50 text-amber-700' },
          { label: 'Total Rooms', value: totalRooms, icon: 'ri-hotel-bed-line', color: 'bg-stone-100 text-stone-700' },
          { label: 'Occupancy', value: `${occupancyRate}%`, icon: 'ri-bar-chart-2-line', color: occupancyRate > 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600' },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl border border-stone-200 ${s.color} bg-white`}>
            <div className="flex items-center gap-2 mb-1">
              <i className={`${s.icon} text-sm`} />
              <p className="text-xs font-medium text-stone-500">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800 text-sm">{propertyName} — Room Types</h3>
        <div className="flex items-center gap-2">
          {saved && <span className="text-emerald-600 text-xs flex items-center gap-1"><i className="ri-check-line" /> Saved</span>}
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" /> Add Room Type
          </button>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-stone-200">
          <div className="w-14 h-14 flex items-center justify-center bg-amber-50 rounded-2xl mx-auto mb-4"><i className="ri-hotel-bed-line text-amber-400 text-2xl" /></div>
          <p className="font-semibold text-stone-700 mb-2">No room types defined</p>
          <p className="text-stone-400 text-sm mb-5 max-w-xs mx-auto">Add room types like Deluxe Suite, Standard Room, etc. with pricing and inventory counts.</p>
          <button onClick={openAdd} className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap">Add First Room Type</button>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-bold text-stone-900">{room.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[room.status]}`}>{room.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-500 mb-3">
                    <span><i className="ri-hotel-bed-line mr-1" />{room.bedType}</span>
                    {room.size && <span><i className="ri-expand-left-right-line mr-1" />{room.size}</span>}
                    <span><i className="ri-group-line mr-1" />Up to {room.capacity} guests</span>
                    <span className="font-semibold text-stone-700">₹{room.pricePerNight.toLocaleString('en-IN')}/night</span>
                  </div>

                  {/* Inventory bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span>Availability: {room.availableRooms}/{room.totalRooms} rooms free</span>
                      <span className="font-medium">{room.totalRooms > 0 ? Math.round(((room.totalRooms - room.availableRooms) / room.totalRooms) * 100) : 0}% occupied</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full transition-all"
                        style={{ width: `${room.totalRooms > 0 ? ((room.totalRooms - room.availableRooms) / room.totalRooms) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 6).map((a) => (
                        <span key={a} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">{a}</span>
                      ))}
                      {room.amenities.length > 6 && (
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-400 text-xs rounded-full">+{room.amenities.length - 6} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 sm:shrink-0">
                  <button onClick={() => openEdit(room)} className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap">
                    <i className="ri-edit-line" /> Edit
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="flex items-center gap-1.5 px-4 py-2 border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 cursor-pointer whitespace-nowrap">
                    <i className="ri-delete-bin-line" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
