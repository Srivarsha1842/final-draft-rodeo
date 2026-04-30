import { useState } from 'react';
import { CMSProperty, CMSRoomType, CMSAddOn, CMSPropertyReview, CMSDayPackage } from '../types';
import ImageUploader from '@/components/base/ImageUploader';

interface Props {
  data: CMSProperty[];
  onSave: (data: CMSProperty[]) => void;
}

type EditorTab = 'basic' | 'photos' | 'amenities' | 'rooms' | 'policies' | 'addons' | 'host' | 'reviews' | 'daypackage';

const AMENITY_PRESETS: { group: string; items: string[] }[] = [
  { group: 'Outdoor & Recreation', items: ['Infinity Pool', 'Private Pool', 'Private Beach', 'Beach Access', 'Rooftop Deck', 'Garden', 'BBQ', 'Bonfire', 'Yoga Deck', 'Tennis Court'] },
  { group: 'Wellness', items: ['Spa', 'Jacuzzi', 'Gym', 'Sauna', 'Hammam', 'Plunge Pool', 'Steam Room', 'Hot Tub'] },
  { group: 'Dining', items: ['Restaurant', 'Bar', 'Chef on Request', 'Organic Breakfast', 'Room Service', 'Minibar', 'Outdoor Dining', 'Private Chef'] },
  { group: 'Technology', items: ['WiFi', 'Smart TV', 'Netflix', 'Bluetooth Speaker', 'Work Desk', 'Fast Internet'] },
  { group: 'Safety & Accessibility', items: ['24/7 Security', 'CCTV', 'Fire Extinguisher', 'First Aid', 'Wheelchair Access', 'Elevator'] },
  { group: 'Climate', items: ['AC', 'Heating', 'Ceiling Fan', 'Fireplace'] },
  { group: 'Transport', items: ['Parking', 'EV Charging', 'Airport Transfer', 'Bicycle Rental', 'Boat Dock'] },
  { group: 'Activities', items: ['Kayaks', 'Surfboards', 'Trekking Guide', 'Safari Tours', 'Fishing Kit', 'Horse Riding', 'Snorkelling Kit'] },
  { group: 'Services', items: ['Concierge', 'Butler Service', 'Daily Housekeeping', 'Laundry', 'Baby Cot Available', 'Pet Friendly'] },
];

const BED_TYPES = ['King Bed', 'Queen Bed', 'Twin Beds', 'Double Bed', 'Bunk Beds', 'Single Bed', 'Futon', 'Sofa Bed'];

const emptyRoom = (): CMSRoomType => ({
  id: `rm_${Date.now()}`,
  name: '',
  pricePerNight: 0,
  capacity: 2,
  bedType: 'King Bed',
  size: '',
  description: '',
  photos: [''],
  amenities: [],
});

const emptyProperty = (): CMSProperty => ({
  id: `p${Date.now()}`,
  name: '',
  location: '',
  city: '',
  state: '',
  pricePerNight: 0,
  rating: 4.5,
  reviewCount: 0,
  images: [''],
  tags: [],
  type: 'villa',
  verified: true,
  superhost: false,
  bedrooms: 1,
  bathrooms: 1,
  maxGuests: 2,
  description: '',
  amenities: [],
  roomTypes: [],
  housePolicies: [],
  addOns: [],
  categoryRatings: { cleanliness: 4.5, communication: 4.5, checkIn: 4.5, accuracy: 4.5, location: 4.5, value: 4.5 },
  host: { name: '', avatar: '', joinedYear: new Date().getFullYear(), superhost: false },
  reviews: [],
  dayPackage: { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' },
});

// ── Amenity Toggle Toggle ───────────────────────────────────────────────────
function AmenityPicker({
  selected,
  onChange,
  title = 'Amenities',
}: { selected: string[]; onChange: (a: string[]) => void; title?: string }) {
  const [customInput, setCustomInput] = useState('');
  const toggle = (item: string) =>
    onChange(selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item]);
  const addCustom = () => {
    const val = customInput.trim();
    if (val && !selected.includes(val)) { onChange([...selected, val]); }
    setCustomInput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-stone-700">{title}</h4>
        <span className="text-xs text-stone-400">{selected.length} selected</span>
      </div>

      {AMENITY_PRESETS.map((group) => (
        <div key={group.group}>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{group.group}</p>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                  selected.includes(item)
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {selected.includes(item) && <i className="ri-check-line mr-1 text-xs" />}
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Custom amenity */}
      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Add Custom</p>
        <div className="flex gap-2">
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
            className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
            placeholder="e.g. Solar Panels, Hammock..."
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap"
          >Add</button>
        </div>
        {selected.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selected.filter((s) => !AMENITY_PRESETS.flatMap((g) => g.items).includes(s)).map((s) => (
              <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                {s}
                <button type="button" onClick={() => toggle(s)} className="cursor-pointer hover:text-red-500"><i className="ri-close-line" /></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Photo Manager ─────────────────────────────────────────────────────────
function PhotoManager({
  photos,
  onChange,
  label = 'Photos',
}: { photos: string[]; onChange: (p: string[]) => void; label?: string }) {
  return (
    <ImageUploader
      images={photos.filter(Boolean)}
      onChange={onChange}
      label={label}
      multiple
    />
  );
}

// ── Room Type Editor ──────────────────────────────────────────────────────
function RoomTypeEditor({
  rooms,
  onChange,
}: { rooms: CMSRoomType[]; onChange: (r: CMSRoomType[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addRoom = () => {
    const r = emptyRoom();
    onChange([...rooms, r]);
    setExpandedId(r.id);
  };
  const removeRoom = (id: string) => onChange(rooms.filter((r) => r.id !== id));
  const updateRoom = (updated: CMSRoomType) => onChange(rooms.map((r) => r.id === updated.id ? updated : r));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-700">Room Types</h4>
          <p className="text-xs text-stone-400 mt-0.5">{rooms.length} room type{rooms.length !== 1 ? 's' : ''} defined</p>
        </div>
        <button
          type="button"
          onClick={addRoom}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-700 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line" /> Add Room Type
        </button>
      </div>

      {rooms.length === 0 && (
        <div className="py-10 text-center border-2 border-dashed border-stone-200 rounded-2xl">
          <i className="ri-hotel-bed-line text-stone-300 text-3xl block mb-2" />
          <p className="text-stone-400 text-sm">No room types yet</p>
          <p className="text-stone-300 text-xs mt-1">Click &quot;Add Room Type&quot; to define room categories with separate pricing</p>
        </div>
      )}

      <div className="space-y-3">
        {rooms.map((room) => {
          const isOpen = expandedId === room.id;
          return (
            <div key={room.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              {/* Room header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-stone-50 transition-colors"
                onClick={() => setExpandedId(isOpen ? null : room.id)}
              >
                <div className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-xl flex-shrink-0">
                  <i className="ri-hotel-bed-line text-stone-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm truncate">{room.name || 'Unnamed Room'}</p>
                  <p className="text-xs text-stone-400">
                    {room.bedType} · {room.capacity} guests
                    {room.pricePerNight > 0 && ` · ₹${room.pricePerNight.toLocaleString('en-IN')}/night`}
                    {room.photos.filter(Boolean).length > 0 && ` · ${room.photos.filter(Boolean).length} photo${room.photos.filter(Boolean).length !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeRoom(room.id); }}
                    className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                  <i className={`ri-arrow-down-s-line text-stone-400 text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Room form */}
              {isOpen && (
                <div className="border-t border-stone-100 px-4 pb-5 pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">Room Type Name <span className="text-red-400">*</span></label>
                      <input
                        value={room.name}
                        onChange={(e) => updateRoom({ ...room, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                        placeholder="e.g. Deluxe Ocean Suite"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">Bed Type</label>
                      <select
                        value={room.bedType}
                        onChange={(e) => updateRoom({ ...room, bedType: e.target.value })}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 bg-white cursor-pointer"
                      >
                        {BED_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">Price / Night (₹) <span className="text-red-400">*</span></label>
                      <input
                        type="number"
                        value={room.pricePerNight || ''}
                        onChange={(e) => updateRoom({ ...room, pricePerNight: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                        placeholder="15000"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">Capacity (Max Guests)</label>
                      <input
                        type="number"
                        value={room.capacity}
                        onChange={(e) => updateRoom({ ...room, capacity: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                        min={1}
                        max={20}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">Room Size</label>
                      <input
                        value={room.size ?? ''}
                        onChange={(e) => updateRoom({ ...room, size: e.target.value })}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                        placeholder="e.g. 45 sqm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Room Description</label>
                    <textarea
                      value={room.description}
                      onChange={(e) => updateRoom({ ...room, description: e.target.value })}
                      rows={3}
                      maxLength={500}
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none"
                      placeholder="Describe this room type..."
                    />
                  </div>

                  {/* Room photos */}
                  <div className="border-t border-stone-100 pt-4">
                    <PhotoManager
                      photos={room.photos}
                      onChange={(p) => updateRoom({ ...room, photos: p })}
                      label="Room Photos"
                    />
                  </div>

                  {/* Room amenities */}
                  <div className="border-t border-stone-100 pt-4">
                    <AmenityPicker
                      selected={room.amenities}
                      onChange={(a) => updateRoom({ ...room, amenities: a })}
                      title="Room-specific Amenities"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────────────────
export default function PropertiesEditor({ data, onSave }: Props) {
  const [properties, setProperties] = useState<CMSProperty[]>(JSON.parse(JSON.stringify(data)));
  const [editing, setEditing] = useState<CMSProperty | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tab, setTab] = useState<EditorTab>('basic');
  const [saved, setSaved] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const handleEdit = (prop: CMSProperty) => {
    const p = JSON.parse(JSON.stringify(prop)) as CMSProperty;
    if (!p.amenities) p.amenities = [];
    if (!p.roomTypes) p.roomTypes = [];
    if (!p.housePolicies) p.housePolicies = [];
    setEditing(p);
    setTagsInput(p.tags.join(', '));
    setIsNew(false);
    setTab('basic');
  };

  const handleAdd = () => {
    const p = emptyProperty();
    setEditing(p);
    setTagsInput('');
    setIsNew(true);
    setTab('basic');
  };

  const handleDelete = (id: string) => {
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const updated = { ...editing, tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean) };
    const exists = properties.find((p) => p.id === updated.id);
    const newList = exists
      ? properties.map((p) => (p.id === updated.id ? updated : p))
      : [...properties, updated];
    setProperties(newList);
    onSave(newList);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: EditorTab; label: string; icon: string }[] = [
    { id: 'basic', label: 'Basic Info', icon: 'ri-information-line' },
    { id: 'photos', label: 'Photos', icon: 'ri-image-2-line' },
    { id: 'amenities', label: 'Amenities', icon: 'ri-checkbox-circle-line' },
    { id: 'rooms', label: 'Room Types', icon: 'ri-hotel-bed-line' },
    { id: 'policies', label: 'House Policies', icon: 'ri-file-list-3-line' },
    { id: 'addons', label: 'Add-ons', icon: 'ri-gift-line' },
    { id: 'host', label: 'Host Info', icon: 'ri-user-star-line' },
    { id: 'reviews', label: 'Reviews', icon: 'ri-star-line' },
    { id: 'daypackage', label: 'Day Package', icon: 'ri-sun-line' },
  ];

  // ── EDIT FORM ─────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div>
        {/* Edit header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setEditing(null)}
            className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isNew ? 'Add New Property' : 'Edit Property'}
            </h2>
            <p className="text-stone-500 text-sm truncate">{editing.name || 'New property'}</p>
          </div>
          <button
            onClick={handleSaveEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-save-line" /> Save Property
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                tab === t.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <i className={t.icon} /> {t.label}
            </button>
          ))}
        </div>

        {/* ── BASIC INFO TAB ── */}
        {tab === 'basic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-stone-700">Property Details</h3>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Property Name</label>
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="e.g. Azure Cliff Villa" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Full Location</label>
                  <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="e.g. Candolim Beach, Goa" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">City</label>
                    <input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">State</label>
                    <input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Property Type</label>
                  <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 bg-white cursor-pointer">
                    {['villa', 'resort', 'boutique', 'treehouse', 'beachfront', 'houseboat', 'lodge', 'farmstay'].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Tags (comma-separated)</label>
                  <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="Beachfront, Infinity Pool, Ocean View" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Description</label>
                  <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={5} maxLength={1000} placeholder="Write a detailed description..." />
                  <p className="text-xs text-stone-400 text-right mt-1">{editing.description.length}/1000</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-stone-700">Pricing &amp; Ratings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Base Price / Night (₹)</label>
                    <input type="number" value={editing.pricePerNight || ''} onChange={(e) => setEditing({ ...editing, pricePerNight: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Original Price (₹)</label>
                    <input type="number" value={editing.originalPrice ?? ''} onChange={(e) => setEditing({ ...editing, originalPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Rating</label>
                    <input type="number" min={1} max={5} step={0.1} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Review Count</label>
                    <input type="number" value={editing.reviewCount} onChange={(e) => setEditing({ ...editing, reviewCount: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-stone-700">Capacity</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Bedrooms</label>
                    <input type="number" min={1} value={editing.bedrooms} onChange={(e) => setEditing({ ...editing, bedrooms: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Bathrooms</label>
                    <input type="number" min={1} value={editing.bathrooms} onChange={(e) => setEditing({ ...editing, bathrooms: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Max Guests</label>
                    <input type="number" min={1} value={editing.maxGuests} onChange={(e) => setEditing({ ...editing, maxGuests: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                </div>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.verified} onChange={(e) => setEditing({ ...editing, verified: e.target.checked })} className="accent-stone-900" />
                    <span className="text-sm text-stone-700">Verified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.superhost} onChange={(e) => setEditing({ ...editing, superhost: e.target.checked })} className="accent-stone-900" />
                    <span className="text-sm text-stone-700">Top Owner</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PHOTOS TAB ── */}
        {tab === 'photos' && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-stone-700">Property General Photos</h3>
              <p className="text-stone-400 text-xs mt-0.5">These appear in search results, the hero gallery, and at the top of the property page. Add at least 4–5 high-quality photos.</p>
            </div>
            <div className="mt-4">
              <PhotoManager
                photos={editing.images.length > 0 ? editing.images : ['']}
                onChange={(p) => setEditing({ ...editing, images: p })}
                label="Property Photos"
              />
            </div>
          </div>
        )}

        {/* ── AMENITIES TAB ── */}
        {tab === 'amenities' && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <p className="text-stone-400 text-xs mb-5">These are the property-level amenities shown in the &quot;What This Place Offers&quot; section on the property page.</p>
            <AmenityPicker
              selected={editing.amenities}
              onChange={(a) => setEditing({ ...editing, amenities: a })}
              title="Property Amenities"
            />
          </div>
        )}

        {/* ── ROOMS TAB ── */}
        {tab === 'rooms' && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <p className="text-stone-400 text-xs mb-5">
              Define room categories with individual pricing, capacity, bed types, per-room photos, and room-specific amenities. These appear as a &quot;Choose Your Room&quot; section on the property detail page.
            </p>
            <RoomTypeEditor
              rooms={editing.roomTypes}
              onChange={(r) => setEditing({ ...editing, roomTypes: r })}
            />
          </div>
        )}

        {/* ── ADD-ONS TAB ── */}
        {tab === 'addons' && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-stone-700">Add-on Experiences</h3>
              <p className="text-stone-400 text-xs mt-1">Optional extras guests can select when booking. Each add-on has a name, price, image URL, and description.</p>
            </div>
            <div className="space-y-4 mb-4">
              {(editing.addOns ?? []).map((addon, idx) => (
                <div key={addon.id} className="bg-stone-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Add-on #{idx + 1}</span>
                    <button type="button" onClick={() => { const u = (editing.addOns ?? []).filter((_, i) => i !== idx); setEditing({ ...editing, addOns: u }); }} className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer border border-stone-200">
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Name</label>
                      <input value={addon.name} onChange={(e) => { const u = [...(editing.addOns ?? [])]; u[idx] = { ...u[idx], name: e.target.value }; setEditing({ ...editing, addOns: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Couples Spa" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Price (₹)</label>
                      <input type="number" value={addon.price || ''} onChange={(e) => { const u = [...(editing.addOns ?? [])]; u[idx] = { ...u[idx], price: Number(e.target.value) }; setEditing({ ...editing, addOns: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="2500" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-stone-500 mb-1">Image URL</label>
                      <input value={addon.image} onChange={(e) => { const u = [...(editing.addOns ?? [])]; u[idx] = { ...u[idx], image: e.target.value }; setEditing({ ...editing, addOns: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="https://..." />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-stone-500 mb-1">Description</label>
                      <input value={addon.description} onChange={(e) => { const u = [...(editing.addOns ?? [])]; u[idx] = { ...u[idx], description: e.target.value }; setEditing({ ...editing, addOns: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="Short description..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(editing.addOns ?? []).length === 0 && (
              <div className="py-8 px-6 text-center border-2 border-dashed border-stone-200 rounded-2xl mb-4 bg-stone-50/60">
                <i className="ri-gift-line text-stone-300 text-3xl block mb-3" />
                <p className="text-stone-700 text-sm font-semibold mb-1">No Add-ons Added Yet</p>
                <p className="text-stone-400 text-xs max-w-xs mx-auto mb-3">
                  Add-ons are optional extras guests can book alongside their stay — like a couples spa, bonfire night, or private chef dinner. They will appear on the property page for guests to select.
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-xs text-stone-500">
                  {['Couples Spa', 'Private Chef Dinner', 'Bonfire Night', 'Kayaking Session', 'Yoga Class', 'Airport Transfer'].map((ex) => (
                    <span key={ex} className="px-2.5 py-1 bg-white border border-stone-200 rounded-full">{ex}</span>
                  ))}
                </div>
              </div>
            )}
            <button type="button" onClick={() => { const newAddon: CMSAddOn = { id: `a_${Date.now()}`, name: '', price: 0, image: '', description: '' }; setEditing({ ...editing, addOns: [...(editing.addOns ?? []), newAddon] }); }} className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap">
              <i className="ri-add-line" /> Add Add-on
            </button>
          </div>
        )}

        {/* ── HOST INFO TAB ── */}
        {tab === 'host' && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-stone-700">Host Information</h3>
              <p className="text-stone-400 text-xs mt-1">This info appears on the property page in the host card section.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-500 mb-1.5">Host Name</label>
                <input value={editing.host?.name ?? ''} onChange={(e) => setEditing({ ...editing, host: { ...editing.host!, name: e.target.value } })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Priya Mehta" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1.5">Joined Year</label>
                <input type="number" value={editing.host?.joinedYear ?? 2020} onChange={(e) => setEditing({ ...editing, host: { ...editing.host!, joinedYear: Number(e.target.value) } })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" min={2010} max={2030} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-stone-500 mb-1.5">Host Avatar URL</label>
                <input value={editing.host?.avatar ?? ''} onChange={(e) => setEditing({ ...editing, host: { ...editing.host!, avatar: e.target.value } })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="https://..." />
                {editing.host?.avatar && <img src={editing.host.avatar} alt="host" className="mt-2 w-16 h-16 rounded-full object-cover border border-stone-200" />}
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.host?.superhost ?? false} onChange={(e) => setEditing({ ...editing, host: { ...editing.host!, superhost: e.target.checked } })} className="accent-stone-900" />
                  <span className="text-sm text-stone-700">Top Owner badge</span>
                </label>
              </div>
            </div>
            <div className="border-t border-stone-100 pt-4 space-y-3">
              <h4 className="text-sm font-semibold text-stone-700">Rating Breakdown</h4>
              <p className="text-xs text-stone-400">Set category ratings shown in the Reviews section (1.0 – 5.0)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['cleanliness', 'communication', 'checkIn', 'accuracy', 'location', 'value'] as const).map((key) => (
                  <div key={key}>
                    <label className="block text-xs text-stone-500 mb-1 capitalize">{key === 'checkIn' ? 'Check-in' : key}</label>
                    <input type="number" min={1} max={5} step={0.1} value={editing.categoryRatings?.[key] ?? 4.5} onChange={(e) => setEditing({ ...editing, categoryRatings: { ...editing.categoryRatings!, [key]: Number(e.target.value) } })} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DAY PACKAGE TAB ── */}
        {tab === 'daypackage' && (() => {
          const dp: CMSDayPackage = editing.dayPackage ?? { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' };
          const setDp = (val: CMSDayPackage) => setEditing({ ...editing, dayPackage: val });
          const mealPresets = ['Welcome Drink', 'Breakfast', 'Lunch Buffet', 'Evening Snacks', 'Tea & Coffee', 'Dessert'];
          const actPresets = ['Pool Access', 'Kayaking', 'Nature Walk', 'Bonfire', 'Yoga Session', 'Cycling', 'Bird Watching', 'Guided Trek'];
          const facPresets = ['Changing Room', 'Towels', 'Locker', 'Parking', 'WiFi', 'Rest Area', 'First Aid'];
          return (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-stone-100 p-5">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-700">Enable Day Package</h3>
                    <p className="text-stone-400 text-xs mt-0.5">Allow guests to visit for a day without overnight stay</p>
                  </div>
                  <button onClick={() => setDp({ ...dp, enabled: !dp.enabled })} className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${dp.enabled ? 'bg-stone-900' : 'bg-stone-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${dp.enabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
              {dp.enabled && (
                <>
                  <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-stone-700">Package Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs text-stone-500 mb-1.5">Timing</label><input value={dp.timing} onChange={(e) => setDp({ ...dp, timing: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. 10:00 AM – 5:00 PM" /></div>
                      <div><label className="block text-xs text-stone-500 mb-1.5">Price Per Person (₹)</label><input type="number" value={dp.pricePerPerson || ''} onChange={(e) => setDp({ ...dp, pricePerPerson: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="1500" /></div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1.5">Max Guests Allowed</label>
                        <input
                          type="number"
                          value={dp.maxGuests || ''}
                          onChange={(e) => setDp({ ...dp, maxGuests: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                          placeholder="e.g. 20"
                          min={1}
                          max={500}
                        />
                        <p className="text-xs text-stone-400 mt-1">Leave blank for no limit. Booking form will enforce this limit.</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ImageUploader images={dp.image ? [dp.image] : []} onChange={(imgs) => setDp({ ...dp, image: imgs[0] ?? '' })} label="Package Image" multiple={false} aspectHint="Landscape recommended" />
                      </div>
                      <div className="sm:col-span-2"><label className="block text-xs text-stone-500 mb-1.5">Description</label><textarea value={dp.description} onChange={(e) => setDp({ ...dp, description: e.target.value })} rows={3} maxLength={500} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Describe the day package..." /></div>
                    </div>
                  </div>
                  {[
                    { label: 'Meals Included', key: 'meals' as const, icon: 'ri-restaurant-2-line', color: 'text-amber-500', presets: mealPresets, chipClass: 'bg-amber-50 border-amber-200 text-amber-700' },
                    { label: 'Activities', key: 'activities' as const, icon: 'ri-run-line', color: 'text-emerald-500', presets: actPresets, chipClass: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                    { label: 'Facilities', key: 'facilities' as const, icon: 'ri-building-4-line', color: 'text-stone-500', presets: facPresets, chipClass: 'bg-stone-50 border-stone-200 text-stone-600' },
                  ].map(({ label, key, icon, color, presets, chipClass }) => {
                    const list = dp[key] as string[];
                    return (
                      <div key={key} className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2"><i className={`${icon} ${color}`} />{label}</h3>
                        <div className="flex flex-wrap gap-2">
                          {list.map((item) => (
                            <span key={item} className={`flex items-center gap-1 px-3 py-1 border text-xs rounded-full ${chipClass}`}>
                              {item}
                              <button type="button" onClick={() => setDp({ ...dp, [key]: list.filter((x) => x !== item) })} className="cursor-pointer hover:text-red-500"><i className="ri-close-line" /></button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input id={`dp-${key}-input`} className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder={`Add ${label.toLowerCase()}...`} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v && !list.includes(v)) { setDp({ ...dp, [key]: [...list, v] }); (e.target as HTMLInputElement).value = ''; } } }} />
                          <button type="button" onClick={() => { const inp = document.getElementById(`dp-${key}-input`) as HTMLInputElement; const v = inp?.value.trim(); if (v && !list.includes(v)) { setDp({ ...dp, [key]: [...list, v] }); inp.value = ''; } }} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">{presets.filter((p) => !list.includes(p)).map((p) => (<button key={p} type="button" onClick={() => setDp({ ...dp, [key]: [...list, p] })} className="px-2.5 py-1 text-xs border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap">+ {p}</button>))}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })()}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-stone-700">Guest Reviews</h3>
              <p className="text-stone-400 text-xs mt-1">Reviews shown on the property page. Add realistic guest reviews to build trust.</p>
            </div>
            <div className="space-y-4 mb-4">
              {(editing.reviews ?? []).map((review, idx) => (
                <div key={review.id} className="bg-stone-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Review #{idx + 1}</span>
                    <button type="button" onClick={() => { const u = (editing.reviews ?? []).filter((_, i) => i !== idx); setEditing({ ...editing, reviews: u }); }} className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer border border-stone-200">
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Guest Name</label>
                      <input value={review.user} onChange={(e) => { const u = [...(editing.reviews ?? [])]; u[idx] = { ...u[idx], user: e.target.value }; setEditing({ ...editing, reviews: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Ananya Sharma" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Location</label>
                      <input value={review.location} onChange={(e) => { const u = [...(editing.reviews ?? [])]; u[idx] = { ...u[idx], location: e.target.value }; setEditing({ ...editing, reviews: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Date</label>
                      <input value={review.date} onChange={(e) => { const u = [...(editing.reviews ?? [])]; u[idx] = { ...u[idx], date: e.target.value }; setEditing({ ...editing, reviews: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="March 2025" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Rating (1-5)</label>
                      <input type="number" min={1} max={5} value={review.rating} onChange={(e) => { const u = [...(editing.reviews ?? [])]; u[idx] = { ...u[idx], rating: Number(e.target.value) }; setEditing({ ...editing, reviews: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Avatar URL</label>
                      <input value={review.avatar} onChange={(e) => { const u = [...(editing.reviews ?? [])]; u[idx] = { ...u[idx], avatar: e.target.value }; setEditing({ ...editing, reviews: u }); }} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="https://..." />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-stone-500 mb-1">Review Text</label>
                      <textarea value={review.text} onChange={(e) => { const u = [...(editing.reviews ?? [])]; u[idx] = { ...u[idx], text: e.target.value }; setEditing({ ...editing, reviews: u }); }} rows={3} maxLength={500} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Write the guest review..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(editing.reviews ?? []).length === 0 && (
              <div className="py-8 text-center border-2 border-dashed border-stone-200 rounded-2xl mb-4">
                <i className="ri-star-line text-stone-300 text-3xl block mb-2" />
                <p className="text-stone-400 text-sm">No reviews yet. Add guest reviews to build trust.</p>
              </div>
            )}
            <button type="button" onClick={() => { const newReview: CMSPropertyReview = { id: `rev_${Date.now()}`, user: '', avatar: '', location: '', date: '', rating: 5, text: '' }; setEditing({ ...editing, reviews: [...(editing.reviews ?? []), newReview] }); }} className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap">
              <i className="ri-add-line" /> Add Review
            </button>
          </div>
        )}

        {/* ── POLICIES TAB ── */}
        {tab === 'policies' && (
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-stone-700">House Policies</h3>
              <p className="text-stone-400 text-xs mt-1">
                These policies are shown as bullet points on the property page under &quot;House Policies&quot;. Add each rule as a separate item.
              </p>
            </div>

            {/* Existing policies list */}
            <div className="space-y-2 mb-4">
              {(editing.housePolicies ?? []).map((policy, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 mt-2 flex items-center justify-center bg-stone-100 rounded-full">
                    <i className="ri-circle-fill text-stone-400" style={{ fontSize: '6px' }} />
                  </div>
                  <input
                    value={policy}
                    onChange={(e) => {
                      const updated = [...(editing.housePolicies ?? [])];
                      updated[idx] = e.target.value;
                      setEditing({ ...editing, housePolicies: updated });
                    }}
                    className="flex-1 px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                    placeholder="e.g. No smoking inside the property"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editing.housePolicies ?? []).filter((_, i) => i !== idx);
                      setEditing({ ...editing, housePolicies: updated });
                    }}
                    className="flex-shrink-0 w-9 h-9 mt-0.5 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer transition-colors border border-stone-200"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {(editing.housePolicies ?? []).length === 0 && (
              <div className="py-8 text-center border-2 border-dashed border-stone-200 rounded-2xl mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-stone-50 rounded-xl mx-auto mb-3">
                  <i className="ri-file-list-3-line text-stone-300 text-2xl" />
                </div>
                <p className="text-stone-400 text-sm">No policies added yet</p>
                <p className="text-stone-300 text-xs mt-1">Click &quot;Add Policy&quot; to define house rules for your guests</p>
              </div>
            )}

            {/* Add policy button */}
            <button
              type="button"
              onClick={() => {
                const updated = [...(editing.housePolicies ?? []), ''];
                setEditing({ ...editing, housePolicies: updated });
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line" /> Add Policy
            </button>

            {/* Preset policies */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Quick Add Presets</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Check-in after 2:00 PM, Check-out before 11:00 AM',
                  'No smoking inside the property',
                  'Pets are not allowed',
                  'Parties and events require prior approval',
                  'Quiet hours from 10:00 PM to 8:00 AM',
                  'Valid ID required at check-in',
                  'No outside food or beverages allowed',
                  'Security deposit collected at check-in',
                  'Children under 12 must be supervised at all times',
                  'Guests are responsible for any property damage',
                ].map((preset) => {
                  const already = (editing.housePolicies ?? []).includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      disabled={already}
                      onClick={() => {
                        if (!already) {
                          setEditing({ ...editing, housePolicies: [...(editing.housePolicies ?? []), preset] });
                        }
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        already
                          ? 'bg-stone-50 text-stone-300 border-stone-100 cursor-default'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      {already && <i className="ri-check-line mr-1 text-emerald-500" />}
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Properties</h2>
          <p className="text-stone-500 text-sm mt-0.5">{properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} listed</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-sm flex items-center gap-1"><i className="ri-check-line" />Saved!</span>}
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" /> Add Property
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-xl border border-stone-100 p-4 flex items-center gap-4">
            <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-100">
              {prop.images[0] && <img src={prop.images[0]} alt={prop.name} className="w-full h-full object-cover object-top" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-sm font-semibold text-stone-900 truncate">{prop.name}</span>
                {prop.verified && <span className="shrink-0 text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Verified</span>}
                {prop.superhost && <span className="shrink-0 text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Top Owner</span>}
              </div>
              <div className="text-xs text-stone-400">{prop.location}</div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-stone-600 font-medium">₹{prop.pricePerNight.toLocaleString()}/night</span>
                <span className="text-xs text-stone-400">{prop.bedrooms} bed · {prop.bathrooms} bath · {prop.maxGuests} guests</span>
                {(prop.roomTypes?.length ?? 0) > 0 && (
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5">
                    <i className="ri-hotel-bed-line" /> {prop.roomTypes.length} room type{prop.roomTypes.length !== 1 ? 's' : ''}
                  </span>
                )}
                {(prop.amenities?.length ?? 0) > 0 && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                    <i className="ri-checkbox-circle-line" /> {prop.amenities.length} amenities
                  </span>
                )}
                {(prop.housePolicies?.length ?? 0) > 0 && (
                  <span className="text-xs text-stone-500 font-medium flex items-center gap-0.5">
                    <i className="ri-file-list-3-line" /> {prop.housePolicies.length} policies
                  </span>
                )}
                <span className="flex items-center gap-0.5 text-xs text-amber-600"><i className="ri-star-fill text-xs" />{prop.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleEdit(prop)} className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer">
                <i className="ri-edit-line text-sm" />
              </button>
              <button onClick={() => handleDelete(prop.id)} className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors cursor-pointer">
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
