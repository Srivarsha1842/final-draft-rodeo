import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'horizontal';
}

export default function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => navigate(`/property/${property.id}`);

  if (variant === 'horizontal') {
    return (
      <div
        className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-stone-100"
        onClick={handleClick}
        data-product-shop
      >
        {/* Image */}
        <div className="relative w-full h-48 sm:h-auto sm:w-56 md:w-64 shrink-0 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
          />
          {property.scarcity && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
              {property.scarcity}
            </span>
          )}
          {property.hasDayPackage && (
            <span className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
              <i className="ri-sun-line text-xs" /> Day Outing
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full cursor-pointer"
          >
            <i className={`${liked ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-stone-600'} text-sm`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-stone-900 text-base leading-tight line-clamp-1">{property.name}</h3>
              {property.verified && (
                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                  <i className="ri-verified-badge-fill text-sky-500 text-base" />
                </span>
              )}
            </div>
            <p className="text-stone-500 text-xs flex items-center gap-1 mb-2">
              <i className="ri-map-pin-line" />
              {property.location}
            </p>
            <div className="flex items-center gap-1 mb-3">
              <i className="ri-star-fill text-amber-400 text-xs" />
              <span className="text-stone-800 text-xs font-semibold">{property.rating}</span>
              <span className="text-stone-400 text-xs">({property.reviewCount} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {property.amenities.slice(0, 3).map((a) => (
                <span key={a} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{a}</span>
              ))}
              {property.hasDayPackage && (
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 whitespace-nowrap">
                  <i className="ri-sun-line text-xs" /> Day Package {property.dayPackagePrice ? `₹${property.dayPackagePrice.toLocaleString('en-IN')}/person` : 'Available'}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-stone-900">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
              <span className="text-stone-500 text-xs"> /night</span>
            </div>
            <button className="text-xs font-semibold px-4 py-2 border border-stone-900 text-stone-900 rounded-full hover:bg-stone-900 hover:text-white transition-colors whitespace-nowrap">
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group border border-stone-100 hover:shadow-md transition-shadow"
      onClick={handleClick}
      data-product-shop
    >
      {/* Image carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[imgIdx] || property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges */}
        {property.scarcity && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            {property.scarcity}
          </span>
        )}
        {property.superhost && !property.scarcity && (
          <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            Top Owner
          </span>
        )}
        {property.hasDayPackage && (
          <span className="absolute bottom-[72px] left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-sm">
            <i className="ri-sun-line text-xs" /> Day Outing
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full cursor-pointer hover:scale-110 transition-transform"
        >
          <i className={`${liked ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-stone-700'} text-sm`} />
        </button>

        {/* Image dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${imgIdx === i ? 'bg-white w-4' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute bottom-10 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <i className="ri-star-fill text-amber-400 text-xs" />
          <span className="text-xs font-bold text-stone-900">{property.rating}</span>
        </div>

        {/* Distance */}
        <div className="absolute bottom-10 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-0.5">
          <span className="text-white text-xs">{property.distanceKm} km</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1">{property.name}</h3>
          {property.verified && (
            <span className="shrink-0 w-4 h-4 flex items-center justify-center">
              <i className="ri-verified-badge-fill text-sky-500 text-sm" />
            </span>
          )}
        </div>
        <p className="text-stone-500 text-xs flex items-center gap-1 mb-3">
          <i className="ri-map-pin-line text-xs" />
          {property.location}
        </p>
        <div className="flex items-center justify-between">
          <div>
            {property.originalPrice && (
              <span className="text-stone-400 text-xs line-through mr-1">₹{property.originalPrice.toLocaleString('en-IN')}</span>
            )}
            <span className="font-bold text-stone-900 text-sm">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
            <span className="text-stone-400 text-xs"> /night</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="ri-star-fill text-amber-400 text-xs" />
            <span className="text-xs text-stone-600">{property.rating} ({property.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
