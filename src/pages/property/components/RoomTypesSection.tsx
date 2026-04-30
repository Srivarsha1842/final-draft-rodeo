import { useState } from 'react';
import { CMSRoomType } from '@/pages/admin/types';

interface Props {
  roomTypes: CMSRoomType[];
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
}

const amenityIcons: Record<string, string> = {
  'AC': 'ri-temp-cold-line', 'Smart TV': 'ri-tv-2-line', 'Minibar': 'ri-goblet-line',
  'Jacuzzi': 'ri-drop-line', 'Ocean View': 'ri-landscape-line', 'Private Balcony': 'ri-door-open-line',
  'Pool Access': 'ri-water-percent-line', 'Garden View': 'ri-plant-line', 'Living Area': 'ri-sofa-line',
  'Baby Cot Available': 'ri-parent-line', 'Heating': 'ri-fire-line', 'Fireplace': 'ri-fire-fill',
  'Mountain View': 'ri-landscape-line', 'Forest View': 'ri-tree-line', 'WiFi': 'ri-wifi-line',
  'Backwater View': 'ri-water-flash-line', 'Private Bath': 'ri-drop-line', 'Lake View': 'ri-landscape-line',
  'Butler Service': 'ri-service-line', 'Private Deck': 'ri-home-8-line', 'Jungle View': 'ri-leaf-line',
};

export default function RoomTypesSection({ roomTypes, selectedRoomId, onSelect }: Props) {
  const [galleryRoom, setGalleryRoom] = useState<CMSRoomType | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  if (roomTypes.length === 0) return null;

  const openGallery = (room: CMSRoomType, idx = 0, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const validPhotos = room.photos.filter(Boolean);
    if (validPhotos.length === 0) return;
    setGalleryRoom(room);
    setGalleryIdx(idx);
  };

  return (
    <div className="border-t border-stone-100 pt-8">
      <h2 className="text-xl font-bold text-stone-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Choose Your Room
      </h2>
      <p className="text-stone-500 text-sm mb-6">Select a room type to see its pricing and availability in the booking widget</p>

      <div className="space-y-4">
        {roomTypes.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const validPhotos = room.photos.filter(Boolean);

          return (
            <div
              key={room.id}
              onClick={() => onSelect(room.id)}
              className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${
                isSelected ? 'border-stone-900' : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Room photo — clickable to open gallery */}
                <div
                  className="sm:w-56 h-44 sm:h-auto flex-shrink-0 bg-stone-100 relative group"
                  onClick={(e) => { e.stopPropagation(); openGallery(room, 0); onSelect(room.id); }}
                >
                  {validPhotos.length > 0 ? (
                    <>
                      <img
                        src={validPhotos[0]}
                        alt={room.name}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-stone-800 text-xs font-semibold">
                          <i className="ri-zoom-in-line" />
                          {validPhotos.length > 1 ? `View ${validPhotos.length} Photos` : 'View Photo'}
                        </div>
                      </div>
                      {/* Photo count badge */}
                      {validPhotos.length > 1 && (
                        <button
                          onClick={(e) => openGallery(room, 0, e)}
                          className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-black/60 text-white rounded-full text-xs backdrop-blur-sm whitespace-nowrap cursor-pointer hover:bg-black/80 transition-colors"
                        >
                          <i className="ri-image-2-line" /> {validPhotos.length} photos
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-hotel-bed-line text-stone-300 text-4xl" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center bg-stone-900 rounded-full">
                      <i className="ri-check-line text-white text-sm" />
                    </div>
                  )}
                </div>

                {/* Room details */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">{room.name}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <i className="ri-hotel-bed-line" /> {room.bedType}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-group-line" /> Up to {room.capacity} guests
                        </span>
                        {room.size && (
                          <span className="flex items-center gap-1">
                            <i className="ri-fullscreen-line" /> {room.size}
                          </span>
                        )}
                        {validPhotos.length > 0 && (
                          <button
                            onClick={(e) => openGallery(room, 0, e)}
                            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
                          >
                            <i className="ri-gallery-line" /> {validPhotos.length} photo{validPhotos.length !== 1 ? 's' : ''}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {isSelected ? (
                        <>
                          <p className="text-xl font-bold text-stone-900">₹{room.pricePerNight.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-stone-400">/ night</p>
                        </>
                      ) : (
                        <p className="text-xs text-stone-400 italic max-w-[110px]">Select this room to see price</p>
                      )}
                    </div>
                  </div>

                  {room.description && (
                    <p className="text-stone-500 text-sm leading-relaxed mb-3 line-clamp-2">{room.description}</p>
                  )}

                  {room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 6).map((a) => (
                        <span key={a} className="flex items-center gap-1 px-2 py-0.5 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-600">
                          <i className={`${amenityIcons[a] || 'ri-checkbox-circle-line'} text-xs`} />
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 6 && (
                        <span className="px-2 py-0.5 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-400">
                          +{room.amenities.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(room.id); }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-stone-900 text-white'
                          : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select This Room'}
                    </button>
                    {validPhotos.length > 0 && (
                      <button
                        onClick={(e) => openGallery(room, 0, e)}
                        className="px-4 py-1.5 border border-amber-200 text-amber-700 bg-amber-50 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                      >
                        <i className="ri-image-2-line" /> View Photos
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gallery lightbox */}
      {galleryRoom && (() => {
        const photos = galleryRoom.photos.filter(Boolean);
        return (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={() => setGalleryRoom(null)}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10" onClick={(e) => e.stopPropagation()}>
              <div>
                <span className="text-white font-semibold text-sm">{galleryRoom.name}</span>
                <span className="text-white/50 text-xs ml-3">{galleryIdx + 1} / {photos.length}</span>
              </div>
              <button onClick={() => setGalleryRoom(null)} className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                <i className="ri-close-line text-white text-lg" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-16 relative" onClick={(e) => e.stopPropagation()}>
              {photos.length > 1 && (
                <button
                  onClick={() => setGalleryIdx((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-4 w-10 h-10 flex items-center justify-center bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <i className="ri-arrow-left-s-line text-white text-xl" />
                </button>
              )}
              <img
                src={photos[galleryIdx]}
                alt={`${galleryRoom.name} photo ${galleryIdx + 1}`}
                className="max-h-full max-w-full object-contain rounded-xl"
                style={{ maxHeight: 'calc(100vh - 200px)' }}
              />
              {photos.length > 1 && (
                <button
                  onClick={() => setGalleryIdx((i) => (i + 1) % photos.length)}
                  className="absolute right-4 w-10 h-10 flex items-center justify-center bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <i className="ri-arrow-right-s-line text-white text-xl" />
                </button>
              )}
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto justify-center border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                {photos.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIdx(i)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all cursor-pointer ${galleryIdx === i ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
