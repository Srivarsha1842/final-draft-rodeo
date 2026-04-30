import { useState } from 'react';
import { CMSDayPackage } from '@/pages/admin/types';
import DayPackageEnquiryModal from './DayPackageEnquiryModal';

interface Props {
  dayPackage: CMSDayPackage;
  propertyName: string;
}

export default function DayPackageSection({ dayPackage, propertyName }: Props) {
  const [showModal, setShowModal] = useState(false);
  if (!dayPackage.enabled) return null;

  const groups = [
    {
      icon: 'ri-restaurant-2-line',
      label: 'Meals Included',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      items: dayPackage.meals,
    },
    {
      icon: 'ri-run-line',
      label: 'Activities',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      items: dayPackage.activities,
    },
    {
      icon: 'ri-building-4-line',
      label: 'Facilities',
      color: 'text-stone-600',
      bg: 'bg-stone-50',
      border: 'border-stone-100',
      items: dayPackage.facilities,
    },
  ];

  return (
    <div className="border-t border-stone-100 pt-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-lg">
          <i className="ri-sun-line text-amber-600 text-sm" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Day Package
          </h2>
          <p className="text-stone-400 text-xs mt-0.5">No overnight stay required — experience {propertyName} for a day</p>
        </div>
        <span className="ml-auto shrink-0 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
          Day Outing Available
        </span>
      </div>

      {/* Hero card */}
      <div className="mt-5 rounded-2xl overflow-hidden border border-stone-100">
        {dayPackage.image && (
          <div className="w-full h-52 overflow-hidden">
            <img
              src={dayPackage.image}
              alt="Day Package"
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}
        <div className="p-5 bg-stone-50">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-stone-700 text-sm">
              <i className="ri-time-line text-stone-400" />
              <span className="font-medium">{dayPackage.timing || 'Timing not specified'}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-stone-900">
                &#x20B9;{dayPackage.pricePerPerson.toLocaleString('en-IN')}
              </span>
              <span className="text-stone-500 text-sm">/ person</span>
            </div>
          </div>
          {dayPackage.description && (
            <p className="text-stone-600 text-sm leading-relaxed mb-4">{dayPackage.description}</p>
          )}
        </div>
      </div>

      {/* Inclusions grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((group) => (
          group.items.length > 0 && (
            <div key={group.label} className={`rounded-2xl border ${group.border} ${group.bg} p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg bg-white`}>
                  <i className={`${group.icon} ${group.color} text-sm`} />
                </div>
                <span className="text-sm font-semibold text-stone-800">{group.label}</span>
              </div>
              <ul className="space-y-1.5">
                {group.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                    <i className="ri-checkbox-circle-fill text-emerald-500 text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>

      {/* CTA */}
      <div className="mt-5 flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
        <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl shrink-0">
          <i className="ri-sun-line text-amber-600 text-lg" />
        </div>
        <div className="flex-1">
          <p className="text-stone-900 font-semibold text-sm">Interested in a Day Visit?</p>
          <p className="text-stone-500 text-xs mt-0.5">Pick your date and group size — host will confirm within 24 hrs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          Book Day Package
        </button>
      </div>

      {showModal && (
        <DayPackageEnquiryModal
          propertyName={propertyName}
          pricePerPerson={dayPackage.pricePerPerson}
          timing={dayPackage.timing || 'Full Day'}
          maxGuests={dayPackage.maxGuests}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
