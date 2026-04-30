import { useState } from 'react';
import { HostProperty } from '@/pages/admin/types';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';

interface Props {
  hostId: string;
  properties: HostProperty[];
  onUpdate: (props: HostProperty[]) => void;
}

const PRESET_POLICIES = [
  'Check-in after 2:00 PM, Check-out before 11:00 AM',
  'No smoking inside the property',
  'Pets are not allowed',
  'Parties and events require prior approval',
  'Quiet hours from 10:00 PM to 8:00 AM',
  'Maximum occupancy must not be exceeded',
  'No outside food or catering without permission',
  'Respect neighbouring properties and residents',
  'ID proof required at check-in',
  'Refundable security deposit required',
  'Outdoor bonfires require prior permission',
  'Children under 10 must be supervised at all times',
  'Swimming pool use is at own risk',
  'Vehicles must be parked in designated areas only',
  'Air conditioning usage is metered — charges apply beyond included units',
];

export default function HostPoliciesView({ hostId, properties, onUpdate }: Props) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id ?? '');
  const [newPolicy, setNewPolicy] = useState('');
  const [saved, setSaved] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
  const policies: string[] = selectedProperty?.housePolicies ?? [];

  const persist = (updatedPolicies: string[]) => {
    const data = loadHostData();
    data.properties = data.properties.map((p) =>
      p.id === selectedPropertyId ? { ...p, housePolicies: updatedPolicies } : p
    );
    saveHostData(data);
    const updatedProps = properties.map((p) =>
      p.id === selectedPropertyId ? { ...p, housePolicies: updatedPolicies } : p
    );
    onUpdate(updatedProps);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAdd = () => {
    const trimmed = newPolicy.trim();
    if (!trimmed || policies.includes(trimmed)) return;
    persist([...policies, trimmed]);
    setNewPolicy('');
  };

  const handleAddPreset = (preset: string) => {
    if (policies.includes(preset)) return;
    persist([...policies, preset]);
  };

  const handleDelete = (idx: number) => {
    persist(policies.filter((_, i) => i !== idx));
  };

  const handleStartEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(policies[idx]);
  };

  const handleSaveEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const updated = policies.map((p, i) => (i === editingIdx ? trimmed : p));
    persist(updated);
    setEditingIdx(null);
    setEditValue('');
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...policies];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    persist(updated);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === policies.length - 1) return;
    const updated = [...policies];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    persist(updated);
  };

  const presetsNotAdded = PRESET_POLICIES.filter((p) => !policies.includes(p));

  if (properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
        <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
          <i className="ri-shield-check-line text-stone-400 text-3xl" />
        </div>
        <p className="font-semibold text-stone-700 mb-2">No properties found</p>
        <p className="text-stone-400 text-sm">Add a property first to manage its house policies.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">House Policies</h2>
          <p className="text-stone-500 text-sm mt-1">Manage rules and policies shown to guests on property pages</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
            <i className="ri-check-line" /> Saved!
          </span>
        )}
      </div>

      {/* Property selector */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <label className="block text-sm font-semibold text-stone-700 mb-3">Select Property</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPropertyId(p.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPropertyId === p.id
                  ? 'border-stone-900 bg-stone-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                {p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="ri-building-line text-stone-300" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-900 truncate">{p.name}</p>
                <p className="text-xs text-stone-400 truncate">{p.location}</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {(p.housePolicies?.length ?? 0)} polic{(p.housePolicies?.length ?? 0) !== 1 ? 'ies' : 'y'}
                </p>
              </div>
              {selectedPropertyId === p.id && (
                <div className="ml-auto flex-shrink-0 w-5 h-5 flex items-center justify-center bg-stone-900 rounded-full">
                  <i className="ri-check-line text-white text-xs" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedProperty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Policies list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                  <i className="ri-list-check-2 text-stone-500" />
                  Policies for {selectedProperty.name}
                </h3>
                <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                  {policies.length} rule{policies.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Add new policy */}
              <div className="flex gap-2 mb-5">
                <input
                  value={newPolicy}
                  onChange={(e) => setNewPolicy(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                  placeholder="Type a new house policy..."
                  className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newPolicy.trim()}
                  className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line mr-1" />Add
                </button>
              </div>

              {/* Policy list */}
              {policies.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-xl mx-auto mb-3">
                    <i className="ri-shield-line text-stone-400 text-xl" />
                  </div>
                  <p className="text-stone-500 text-sm font-medium mb-1">No policies added yet</p>
                  <p className="text-stone-400 text-xs">Add policies above or pick from presets on the right</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {policies.map((policy, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-stone-200 transition-all"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-stone-400">{idx + 1}</span>
                      </div>

                      {editingIdx === idx ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') { setEditingIdx(null); setEditValue(''); }
                            }}
                            autoFocus
                            className="flex-1 px-3 py-1.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-stone-500"
                          />
                          <button onClick={handleSaveEdit} className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap">Save</button>
                          <button onClick={() => { setEditingIdx(null); setEditValue(''); }} className="px-3 py-1.5 border border-stone-200 text-stone-500 rounded-lg text-xs cursor-pointer whitespace-nowrap">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <p className="flex-1 text-sm text-stone-700 leading-relaxed">{policy}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={() => handleMoveUp(idx)}
                              disabled={idx === 0}
                              className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                              title="Move up"
                            >
                              <i className="ri-arrow-up-s-line text-sm" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(idx)}
                              disabled={idx === policies.length - 1}
                              className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                              title="Move down"
                            >
                              <i className="ri-arrow-down-s-line text-sm" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(idx)}
                              className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
                              title="Edit"
                            >
                              <i className="ri-edit-line text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(idx)}
                              className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-red-500 cursor-pointer"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line text-sm" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview */}
            {policies.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
                  <i className="ri-eye-line text-stone-500" />
                  Guest Preview
                </h3>
                <p className="text-xs text-stone-400 mb-4">How guests will see your policies on the property page</p>
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <h4 className="font-semibold text-stone-900 text-sm mb-3 flex items-center gap-2">
                    <i className="ri-shield-check-line text-amber-500" />
                    House Policies
                  </h4>
                  <ul className="space-y-2">
                    {policies.map((policy, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                        <i className="ri-arrow-right-s-line text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{policy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Preset suggestions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="w-full flex items-center justify-between cursor-pointer"
              >
                <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                  <i className="ri-magic-line text-amber-500" />
                  Quick-Add Presets
                </h3>
                {showPresets ? <i className="ri-arrow-up-s-line text-stone-400" /> : <i className="ri-arrow-down-s-line text-stone-400" />}
              </button>

              {showPresets && (
                <div className="mt-4 space-y-2">
                  {presetsNotAdded.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-3">All presets already added!</p>
                  ) : (
                    presetsNotAdded.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleAddPreset(preset)}
                        className="w-full flex items-start gap-2 p-2.5 text-left bg-stone-50 hover:bg-amber-50 border border-stone-100 hover:border-amber-200 rounded-lg transition-all cursor-pointer group"
                      >
                        <i className="ri-add-circle-line text-stone-400 group-hover:text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-stone-600 group-hover:text-stone-900 leading-relaxed">{preset}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {!showPresets && (
                <p className="text-xs text-stone-400 mt-2">
                  {presetsNotAdded.length} preset{presetsNotAdded.length !== 1 ? 's' : ''} available to add
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2 mb-3">
                <i className="ri-lightbulb-flash-line text-amber-500" />
                Policy Tips
              </h3>
              <ul className="space-y-2">
                {[
                  'Be specific — vague rules cause disputes',
                  'Mention check-in/out times clearly',
                  'State pet & smoking policies upfront',
                  'Include quiet hours if applicable',
                  'List any extra charges guests should know',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                    <i className="ri-checkbox-circle-line text-amber-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-900 text-sm mb-4">Policy Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Total policies</span>
                  <span className="font-bold text-stone-900">{policies.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Properties covered</span>
                  <span className="font-bold text-stone-900">
                    {properties.filter((p) => (p.housePolicies?.length ?? 0) > 0).length} / {properties.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Avg per property</span>
                  <span className="font-bold text-stone-900">
                    {properties.length > 0
                      ? Math.round(properties.reduce((sum, p) => sum + (p.housePolicies?.length ?? 0), 0) / properties.length)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
