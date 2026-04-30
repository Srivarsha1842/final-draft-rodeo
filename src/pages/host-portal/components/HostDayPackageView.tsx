import { useState } from 'react';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';
import { CMSDayPackage } from '@/pages/admin/types';
import ImageUploader from '@/components/base/ImageUploader';

interface Props {
  hostId: string;
}

const defaultPackage = (): CMSDayPackage => ({
  enabled: false,
  description: '',
  timing: '',
  pricePerPerson: 0,
  meals: [],
  activities: [],
  facilities: [],
  image: '',
});

export default function HostDayPackageView({ hostId }: Props) {
  const hostData = loadHostData();
  const hostProps = hostData.properties.filter((p) => p.hostId === hostId);

  const [selectedPropId, setSelectedPropId] = useState<string>(hostProps[0]?.id ?? '');
  const [pkg, setPkg] = useState<CMSDayPackage>(() => {
    const prop = hostProps.find((p) => p.id === (hostProps[0]?.id ?? ''));
    return prop?.dayPackage ?? defaultPackage();
  });
  const [saved, setSaved] = useState(false);
  const [mealInput, setMealInput] = useState('');
  const [activityInput, setActivityInput] = useState('');
  const [facilityInput, setFacilityInput] = useState('');

  const loadForProp = (propId: string) => {
    const prop = hostProps.find((p) => p.id === propId);
    setSelectedPropId(propId);
    setPkg(prop?.dayPackage ?? defaultPackage());
  };

  const handleSave = () => {
    const data = loadHostData();
    data.properties = data.properties.map((p) =>
      p.id === selectedPropId ? { ...p, dayPackage: pkg } : p
    );
    saveHostData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addItem = (list: string[], input: string, setter: (v: string[]) => void, inputSetter: (v: string) => void) => {
    const val = input.trim();
    if (val && !list.includes(val)) setter([...list, val]);
    inputSetter('');
  };
  const removeItem = (list: string[], val: string, setter: (v: string[]) => void) =>
    setter(list.filter((x) => x !== val));

  const mealPresets = ['Welcome Drink', 'Breakfast', 'Lunch Buffet', 'Evening Snacks', 'Tea & Coffee', 'Dessert'];
  const activityPresets = ['Pool Access', 'Kayaking', 'Nature Walk', 'Bonfire', 'Yoga Session', 'Cycling', 'Bird Watching', 'Guided Trek', 'Cooking Class'];
  const facilityPresets = ['Changing Room', 'Towels', 'Locker', 'Parking', 'WiFi', 'Rest Area', 'First Aid'];

  if (hostProps.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
          <i className="ri-sun-line text-stone-400 text-3xl" />
        </div>
        <p className="font-semibold text-stone-700 mb-2">No properties found</p>
        <p className="text-stone-400 text-sm">Add a property first to configure day packages.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Day Package</h2>
          <p className="text-stone-500 text-sm mt-1">Configure day outing packages for your properties</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-sm flex items-center gap-1"><i className="ri-check-line" /> Saved!</span>}
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
            <i className="ri-save-line" /> Save Package
          </button>
        </div>
      </div>

      {/* Property selector */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {hostProps.map((p) => (
          <button
            key={p.id}
            onClick={() => loadForProp(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${selectedPropId === p.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'}`}
          >
            <i className="ri-home-line text-xs" />
            {p.name}
            {p.dayPackage?.enabled && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* Enable toggle */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-900">Enable Day Package</p>
              <p className="text-stone-500 text-xs mt-0.5">Toggle to offer a day outing package for this property</p>
            </div>
            <button
              onClick={() => setPkg({ ...pkg, enabled: !pkg.enabled })}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${pkg.enabled ? 'bg-stone-900' : 'bg-stone-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${pkg.enabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {pkg.enabled && (
          <>
            {/* Basic info */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-stone-700">Package Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Timing</label>
                  <input value={pkg.timing} onChange={(e) => setPkg({ ...pkg, timing: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. 10:00 AM – 5:00 PM" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Price Per Person (₹)</label>
                  <input type="number" value={pkg.pricePerPerson || ''} onChange={(e) => setPkg({ ...pkg, pricePerPerson: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="1500" min={0} />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Max Guests Allowed</label>
                  <input
                    type="number"
                    value={pkg.maxGuests || ''}
                    onChange={(e) => setPkg({ ...pkg, maxGuests: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                    placeholder="e.g. 20"
                    min={1}
                    max={500}
                  />
                  <p className="text-xs text-stone-400 mt-1">Leave blank for no limit</p>
                </div>
                <div className="sm:col-span-2">
                  <ImageUploader
                    images={pkg.image ? [pkg.image] : []}
                    onChange={(imgs) => setPkg({ ...pkg, image: imgs[0] ?? '' })}
                    label="Package Image"
                    multiple={false}
                    aspectHint="Landscape recommended (800×500px)"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-500 mb-1.5">Description</label>
                  <textarea value={pkg.description} onChange={(e) => setPkg({ ...pkg, description: e.target.value })} rows={3} maxLength={500} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Describe the day package experience..." />
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2"><i className="ri-restaurant-2-line text-amber-500" /> Meals Included</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {pkg.meals.map((m) => (
                  <span key={m} className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-full">
                    {m}
                    <button type="button" onClick={() => removeItem(pkg.meals, m, (v) => setPkg({ ...pkg, meals: v }))} className="cursor-pointer hover:text-red-500"><i className="ri-close-line" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={mealInput} onChange={(e) => setMealInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(pkg.meals, mealInput, (v) => setPkg({ ...pkg, meals: v }), setMealInput))} className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="Add meal item..." />
                <button type="button" onClick={() => addItem(pkg.meals, mealInput, (v) => setPkg({ ...pkg, meals: v }), setMealInput)} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {mealPresets.filter((m) => !pkg.meals.includes(m)).map((m) => (
                  <button key={m} type="button" onClick={() => setPkg({ ...pkg, meals: [...pkg.meals, m] })} className="px-2.5 py-1 text-xs border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap">+ {m}</button>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2"><i className="ri-run-line text-emerald-500" /> Activities Included</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {pkg.activities.map((a) => (
                  <span key={a} className="flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full">
                    {a}
                    <button type="button" onClick={() => removeItem(pkg.activities, a, (v) => setPkg({ ...pkg, activities: v }))} className="cursor-pointer hover:text-red-500"><i className="ri-close-line" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={activityInput} onChange={(e) => setActivityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(pkg.activities, activityInput, (v) => setPkg({ ...pkg, activities: v }), setActivityInput))} className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="Add activity..." />
                <button type="button" onClick={() => addItem(pkg.activities, activityInput, (v) => setPkg({ ...pkg, activities: v }), setActivityInput)} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {activityPresets.filter((a) => !pkg.activities.includes(a)).map((a) => (
                  <button key={a} type="button" onClick={() => setPkg({ ...pkg, activities: [...pkg.activities, a] })} className="px-2.5 py-1 text-xs border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap">+ {a}</button>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2"><i className="ri-building-4-line text-stone-500" /> Facilities Included</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {pkg.facilities.map((f) => (
                  <span key={f} className="flex items-center gap-1 px-3 py-1 bg-stone-50 border border-stone-200 text-stone-600 text-xs rounded-full">
                    {f}
                    <button type="button" onClick={() => removeItem(pkg.facilities, f, (v) => setPkg({ ...pkg, facilities: v }))} className="cursor-pointer hover:text-red-500"><i className="ri-close-line" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(pkg.facilities, facilityInput, (v) => setPkg({ ...pkg, facilities: v }), setFacilityInput))} className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="Add facility..." />
                <button type="button" onClick={() => addItem(pkg.facilities, facilityInput, (v) => setPkg({ ...pkg, facilities: v }), setFacilityInput)} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {facilityPresets.filter((f) => !pkg.facilities.includes(f)).map((f) => (
                  <button key={f} type="button" onClick={() => setPkg({ ...pkg, facilities: [...pkg.facilities, f] })} className="px-2.5 py-1 text-xs border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap">+ {f}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
