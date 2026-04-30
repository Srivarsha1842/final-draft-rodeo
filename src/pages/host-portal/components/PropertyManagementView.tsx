import { useState } from 'react';
import { HostProperty } from '@/pages/admin/types';
import RoomsManager from './property-mgmt/RoomsManager';
import StaffManager from './property-mgmt/StaffManager';
import RestaurantManager from './property-mgmt/RestaurantManager';
import InventoryManager from './property-mgmt/InventoryManager';

interface Props {
  hostId: string;
  properties: HostProperty[];
  onUpdate: (props: HostProperty[]) => void;
}

type SubSection = 'overview' | 'rooms' | 'staff' | 'restaurant' | 'inventory';

const subSections: { id: SubSection; label: string; icon: string; desc: string; color: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'ri-dashboard-3-line', desc: 'Property summary', color: 'text-stone-600' },
  { id: 'rooms', label: 'Rooms & Types', icon: 'ri-hotel-bed-line', desc: 'Manage room inventory', color: 'text-amber-600' },
  { id: 'staff', label: 'Staff & Roles', icon: 'ri-team-line', desc: 'Manage your team', color: 'text-emerald-600' },
  { id: 'restaurant', label: 'Restaurant', icon: 'ri-restaurant-2-line', desc: 'Menu & in-room dining', color: 'text-rose-600' },
  { id: 'inventory', label: 'Inventory', icon: 'ri-archive-drawer-line', desc: 'Stock & supplies', color: 'text-violet-600' },
];

export default function PropertyManagementView({ hostId, properties, onUpdate }: Props) {
  const [subSection, setSubSection] = useState<SubSection>('overview');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id ?? '');

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Property Management</h2>
          <p className="text-stone-500 text-sm mt-1">Manage rooms, staff, restaurant & inventory for your resorts</p>
        </div>
        {properties.length > 1 && (
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white min-w-[220px] cursor-pointer"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
          <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
            <i className="ri-building-4-line text-stone-400 text-3xl" />
          </div>
          <p className="font-semibold text-stone-700 mb-2">No properties yet</p>
          <p className="text-stone-400 text-sm">Add a property first to manage rooms, staff and more.</p>
        </div>
      ) : (
        <>
          {/* Sub-nav */}
          <div className="flex flex-wrap gap-2 mb-6">
            {subSections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSubSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  subSection === s.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
                }`}
              >
                <i className={s.icon} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {subSection === 'overview' && (
            <PropertyOverview property={selectedProperty!} hostId={hostId} onNavigate={setSubSection} />
          )}
          {subSection === 'rooms' && (
            <RoomsManager propertyId={selectedPropertyId} propertyName={selectedProperty?.name ?? ''} hostId={hostId} />
          )}
          {subSection === 'staff' && (
            <StaffManager propertyId={selectedPropertyId} propertyName={selectedProperty?.name ?? ''} hostId={hostId} />
          )}
          {subSection === 'restaurant' && (
            <RestaurantManager propertyId={selectedPropertyId} propertyName={selectedProperty?.name ?? ''} hostId={hostId} />
          )}
          {subSection === 'inventory' && (
            <InventoryManager propertyId={selectedPropertyId} propertyName={selectedProperty?.name ?? ''} hostId={hostId} />
          )}
        </>
      )}
    </div>
  );
}

function PropertyOverview({ property, onNavigate }: { property: HostProperty; hostId: string; onNavigate: (s: SubSection) => void }) {
  const quickStats = [
    { label: 'Rooms & Types', icon: 'ri-hotel-bed-line', value: 'Manage', color: 'bg-amber-50 text-amber-700 border-amber-100', section: 'rooms' as SubSection, hint: 'Set room types, counts & pricing' },
    { label: 'Staff & Roles', icon: 'ri-team-line', value: 'Manage', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', section: 'staff' as SubSection, hint: 'Reception, housekeeping, service staff' },
    { label: 'Restaurant', icon: 'ri-restaurant-2-line', value: 'Manage', color: 'bg-rose-50 text-rose-700 border-rose-100', section: 'restaurant' as SubSection, hint: 'In-room dining, menu & orders' },
    { label: 'Inventory', icon: 'ri-archive-drawer-line', value: 'Manage', color: 'bg-violet-50 text-violet-700 border-violet-100', section: 'inventory' as SubSection, hint: 'Linen, toiletries, supplies stock' },
  ];

  return (
    <div className="space-y-5">
      {/* Property card */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col sm:flex-row">
        {property.images?.[0] ? (
          <div className="w-full sm:w-56 h-40 sm:h-auto shrink-0">
            <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover object-top" />
          </div>
        ) : (
          <div className="w-full sm:w-56 h-40 sm:h-auto bg-stone-100 flex items-center justify-center shrink-0">
            <i className="ri-building-4-line text-stone-300 text-4xl" />
          </div>
        )}
        <div className="p-5 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-stone-900 text-lg">{property.name}</h3>
              <p className="text-stone-400 text-sm flex items-center gap-1 mt-0.5"><i className="ri-map-pin-line" />{property.location}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              property.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
              property.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
            } capitalize`}>{property.status}</span>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-stone-600">
            <span className="flex items-center gap-1.5"><i className="ri-hotel-bed-line text-stone-400" />{property.bedrooms} Bedrooms</span>
            <span className="flex items-center gap-1.5"><i className="ri-group-line text-stone-400" />Max {property.maxGuests} guests</span>
            <span className="flex items-center gap-1.5"><i className="ri-money-rupee-circle-line text-stone-400" />₹{property.pricePerNight?.toLocaleString('en-IN')}/night</span>
          </div>
          {property.description && (
            <p className="text-stone-400 text-xs mt-3 line-clamp-2">{property.description}</p>
          )}
        </div>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickStats.map((stat) => (
          <button
            key={stat.section}
            onClick={() => onNavigate(stat.section)}
            className={`text-left p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${stat.color} bg-white`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${stat.color} border`}>
                <i className={`${stat.icon} text-xl`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-stone-900 text-sm">{stat.label}</p>
                <p className="text-stone-400 text-xs mt-0.5">{stat.hint}</p>
              </div>
              <i className="ri-arrow-right-s-line text-stone-300 text-xl mt-0.5" />
            </div>
          </button>
        ))}
      </div>

      {/* What you can manage info */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
        <h4 className="font-semibold text-stone-800 text-sm mb-3">Property Management Includes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {[
            ['ri-hotel-bed-line', 'Room types with individual pricing & inventory'],
            ['ri-user-settings-line', 'Staff roles: reception, housekeeping, kitchen, security'],
            ['ri-restaurant-2-line', 'Restaurant menu & in-room dining orders'],
            ['ri-file-list-3-line', 'Add restaurant charges to guest invoices'],
            ['ri-archive-drawer-line', 'Inventory tracking: linen, toiletries, supplies'],
            ['ri-alert-line', 'Low stock alerts & reorder tracking'],
            ['ri-calendar-check-line', 'Room availability & occupancy at a glance'],
            ['ri-shield-check-line', 'Staff shift scheduling & status'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-start gap-2.5 text-xs text-stone-600">
              <i className={`${icon} text-stone-400 mt-0.5 shrink-0`} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
