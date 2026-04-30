import { reviews } from '@/mocks/properties';

export default function ReviewsSection() {
  return (
    <section className="py-16 md:py-24" style={{ background: '#FAF8F5' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Real Experiences</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loved by Travelers
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => <i key={i} className="ri-star-fill text-amber-400 text-xl" />)}
            </div>
            <span className="text-2xl font-bold text-stone-900">4.9</span>
            <span className="text-stone-500 text-sm">from 2,400+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-stone-100">
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(i => (
                  <i key={i} className={`text-sm ${i <= review.rating ? 'ri-star-fill text-amber-400' : 'ri-star-line text-stone-300'}`} />
                ))}
              </div>
              <p className="text-stone-700 text-sm leading-relaxed mb-4 line-clamp-4">{review.text}</p>
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.photos.map((photo, i) => (
                    <img key={i} src={photo} alt="Review" className="w-16 h-12 object-cover rounded-lg" />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{review.user}</p>
                  <p className="text-xs text-stone-400">{review.location} · {review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
