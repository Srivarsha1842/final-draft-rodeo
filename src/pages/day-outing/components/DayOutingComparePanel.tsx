import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface CompareProperty {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  timing: string;
  meals: string[];
  activities: string[];
  facilities: string[];
  rating: number;
  reviewCount: number;
  description: string;
}

interface ComparePanelModalProps {
  items: CompareProperty[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onBook: (id: string, name: string, price: number) => void;
}

export function CompareModal({ items, onClose, onRemove, onBook }: ComparePanelModalProps) {
  const navigate = useNavigate();

  const rows: { label: string; icon: string; key: string }[] = [
    { label: 'Price / Person', icon: 'ri-price-tag-3-line', key: 'price' },
    { label: 'Rating', icon: 'ri-star-fill', key: 'rating' },
    { label: 'Location', icon: 'ri-map-pin-line', key: 'location' },
    { label: 'Timing', icon: 'ri-time-line', key: 'timing' },
    { label: 'Meals', icon: 'ri-restaurant-2-line', key: 'mealsList' },
    { label: 'Activities', icon: 'ri-run-line', key: 'activitiesList' },
    { label: 'Facilities', icon: 'ri-building-4-line', key: 'facilitiesList' },
  ];

  const bestPrice = Math.min(...items.map((i) => i.price));
  const bestRating = Math.max(...items.map((i) => i.rating));

  const renderCell = (item: CompareProperty, key: string) => {
    switch (key) {
      case 'price':
        return (
          <span className="text-stone-900 font-bold text-base">
            &#x20B9;{item.price.toLocaleString('en-IN')}
          </span>
        );
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            <i className="ri-star-fill text-amber-400 text-sm" />
            <span className="font-bold text-stone-800 text-sm">{item.rating}</span>
            <span className="text-stone-400 text-xs">({item.reviewCount})</span>
          </div>
        );
      case 'location':
        return <span className="text-stone-600 text-xs">{item.location}</span>;
      case 'timing':
        return (
          <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100">
            {item.timing || 'Full Day'}
          </span>
        );
      case 'mealsList':
        return item.meals.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.meals.map((m, i) => (
              <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">{m}</span>
            ))}
          </div>
        ) : <span className="text-stone-300 text-xs italic">Not specified</span>;
      case 'activitiesList':
        return item.activities.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.activities.slice(0, 5).map((a, i) => (
              <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">{a}</span>
            ))}
            {item.activities.length > 5 && (
              <span className="px-2 py-0.5 bg-stone-100 text-stone-400 text-xs rounded-full">+{item.activities.length - 5} more</span>
            )}
          </div>
        ) : <span className="text-stone-300 text-xs italic">Not specified</span>;
      case 'facilitiesList':
        return item.facilities.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.facilities.slice(0, 4).map((f, i) => (
              <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">{f}</span>
            ))}
            {item.facilities.length > 4 && (
              <span className="px-2 py-0.5 bg-stone-100 text-stone-400 text-xs rounded-full">+{item.facilities.length - 4} more</span>
            )}
          </div>
        ) : <span className="text-stone-300 text-xs italic">Not specified</span>;
      default:
        return <span className="text-stone-600 text-sm">{String(item[key as keyof CompareProperty])}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-5xl overflow-hidden mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-amber-100 rounded-xl shrink-0">
              <i className="ri-bar-chart-grouped-line text-amber-600 text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-lg">Compare Day Outings</h2>
              <p className="text-stone-400 text-xs mt-0.5">{items.length} properties side by side</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-stone-600" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="w-40 py-4 px-5 text-left">
                  <span className="text-xs text-stone-400 font-semibold uppercase tracking-widest">Feature</span>
                </th>
                {items.map((item) => (
                  <th key={item.id} className="min-w-[220px] py-4 px-4 text-left">
                    <div className="relative pr-6">
                      <button
                        onClick={() => onRemove(item.id)}
                        className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-stone-200 hover:bg-red-100 hover:text-red-500 rounded-full cursor-pointer transition-colors"
                      >
                        <i className="ri-close-line text-xs" />
                      </button>
                      <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <h3 className="font-bold text-stone-900 text-sm leading-tight">{item.name}</h3>
                      <p className="text-stone-400 text-xs mt-0.5 flex items-center gap-1">
                        <i className="ri-map-pin-line" />{item.location.split(',').slice(-1)[0].trim()}
                      </p>
                    </div>
                  </th>
                ))}
                {items.length < 3 && (
                  <th className="min-w-[180px] py-4 px-4 text-left">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full h-28 rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 hover:text-amber-600 hover:border-amber-400 hover:bg-amber-50 mb-3 transition-colors cursor-pointer"
                    >
                      <i className="ri-add-circle-line text-2xl" />
                      <span className="text-xs mt-1 text-center leading-tight">Add another<br />property</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={row.key} className={`border-b border-stone-50 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}`}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <i className={`${row.icon} text-stone-400 text-sm`} />
                      </div>
                      <span className="text-xs font-semibold text-stone-600">{row.label}</span>
                    </div>
                  </td>
                  {items.map((item) => {
                    const isBest =
                      (row.key === 'price' && item.price === bestPrice) ||
                      (row.key === 'rating' && item.rating === bestRating);
                    return (
                      <td key={item.id} className="py-3.5 px-4">
                        <div className={`relative inline-block ${isBest ? 'ring-1 ring-emerald-400 rounded-lg px-2 py-1' : ''}`}>
                          {isBest && (
                            <span className="absolute -top-2.5 -right-1 text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">
                              Best
                            </span>
                          )}
                          {renderCell(item, row.key)}
                        </div>
                      </td>
                    );
                  })}
                  {items.length < 3 && <td className="py-3.5 px-4" />}
                </tr>
              ))}
              {/* CTA row */}
              <tr className="border-t-2 border-stone-100 bg-stone-50/50">
                <td className="py-5 px-5" />
                {items.map((item) => (
                  <td key={item.id} className="py-5 px-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => { onBook(item.id, item.name, item.price); onClose(); }}
                        className="w-full py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-sun-line mr-1" />Book Day Outing
                      </button>
                      <button
                        onClick={() => navigate(`/property/${item.id}?tab=daypackage`)}
                        className="w-full py-2 border border-stone-200 text-stone-600 text-xs font-medium rounded-xl hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        View Full Details
                      </button>
                    </div>
                  </td>
                ))}
                {items.length < 3 && <td className="py-5 px-4" />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface FloatingBarProps {
  selectedItems: CompareProperty[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onOpenCompare: () => void;
}

export function CompareFloatingBar({ selectedItems, onRemove, onClearAll, onOpenCompare }: FloatingBarProps) {
  const [expanded, setExpanded] = useState(true);

  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      <div className="bg-stone-900 rounded-2xl shadow-lg overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-amber-400/20 rounded-lg shrink-0">
              <i className="ri-bar-chart-grouped-line text-amber-400 text-sm" />
            </div>
            <span className="text-white text-sm font-semibold">
              Compare ({selectedItems.length}/3)
            </span>
            <div className="flex gap-1 ml-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < selectedItems.length ? 'bg-amber-400' : 'bg-stone-700'}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="text-stone-400 hover:text-white text-xs cursor-pointer transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white cursor-pointer transition-colors"
            >
              <i className={`${expanded ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'} text-lg`} />
            </button>
          </div>
        </div>

        {/* Expanded items */}
        {expanded && (
          <div className="px-4 pb-4">
            <div className="flex items-start gap-3 mb-3">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex-1 min-w-0 relative">
                  <div className="relative w-full h-16 rounded-xl overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                      onClick={() => onRemove(item.id)}
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/50 hover:bg-red-500 rounded-full cursor-pointer transition-colors"
                    >
                      <i className="ri-close-line text-white text-xs" />
                    </button>
                    <p className="absolute bottom-1 left-2 right-2 text-white text-xs font-semibold truncate leading-tight">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-amber-400 text-xs font-bold mt-1 text-center">
                    &#x20B9;{item.price.toLocaleString('en-IN')}/person
                  </p>
                </div>
              ))}
              {selectedItems.length < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    // Scroll the properties grid into view so the user can pick another
                    const grid = document.querySelector('[data-day-outing-grid]');
                    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex-1 h-16 rounded-xl border-2 border-dashed border-stone-700 hover:border-amber-400 hover:bg-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <i className="ri-add-line text-stone-500 text-lg block" />
                    <span className="text-stone-500 text-xs">Add more</span>
                  </div>
                </button>
              )}
            </div>
            <button
              onClick={onOpenCompare}
              disabled={selectedItems.length < 2}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-bar-chart-grouped-line mr-2" />
              Compare {selectedItems.length < 2 ? '(Select at least 2)' : `${selectedItems.length} Properties`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
