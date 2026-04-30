import { useState, useMemo } from 'react';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';
import { HostReview } from '@/pages/admin/types';

export default function ReviewsManager() {
  const [reviewsData, setReviewsData] = useState<HostReview[]>(() => {
    const data = loadHostData();
    return Array.isArray(data.reviews) ? data.reviews : [];
  });

  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [savingReply, setSavingReply] = useState(false);

  const filtered = useMemo(() => {
    let list = reviewsData;
    if (ratingFilter !== null) list = list.filter((r) => r.rating === ratingFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.guestName.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q) || r.propertyName.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviewsData, ratingFilter, search]);

  const avgRating = reviewsData.length ? (reviewsData.reduce((s, r) => s + r.rating, 0) / reviewsData.length).toFixed(2) : '—';
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({ r, count: reviewsData.filter((rv) => rv.rating === r).length }));

  const toggleFlag = (id: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const startReply = (id: string, existing: string) => {
    setReplyingTo(id);
    setReplyText(replyDraft[id] ?? existing ?? '');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const submitReply = (id: string) => {
    setSavingReply(true);
    const updated = reviewsData.map((r) =>
      r.id === id ? { ...r, hostReply: replyText.trim() } : r
    );
    const data = loadHostData();
    data.reviews = updated;
    saveHostData(data);
    setReviewsData(updated);
    setReplyDraft((prev) => ({ ...prev, [id]: replyText.trim() }));
    setTimeout(() => {
      setSavingReply(false);
      setReplyingTo(null);
      setReplyText('');
    }, 600);
  };

  const deleteReply = (id: string) => {
    const updated = reviewsData.map((r) =>
      r.id === id ? { ...r, hostReply: '' } : r
    );
    const data = loadHostData();
    data.reviews = updated;
    saveHostData(data);
    setReviewsData(updated);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Reviews Moderation</h1>
        <p className="text-stone-500 text-sm mt-1">Monitor, moderate and reply to all guest reviews across the platform</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-stone-400 text-xs mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-stone-900">{reviewsData.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-stone-400 text-xs mb-1">Average Rating</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-amber-600">{avgRating}</p>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => <i key={i} className="ri-star-fill text-amber-400 text-xs" />)}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-stone-400 text-xs mb-3">Rating Distribution</p>
          <div className="space-y-1.5">
            {ratingDist.map(({ r, count }) => (
              <div key={r} className="flex items-center gap-2">
                <span className="text-xs text-stone-500 w-4">{r}</span>
                <i className="ri-star-fill text-amber-400 text-xs" />
                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: reviewsData.length ? `${(count / reviewsData.length) * 100}%` : '0%' }} />
                </div>
                <span className="text-xs text-stone-400 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-stone-200 p-3 text-center">
          <p className="text-lg font-bold text-stone-900">{reviewsData.filter((r) => r.hostReply).length}</p>
          <p className="text-xs text-stone-400">With Reply</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3 text-center">
          <p className="text-lg font-bold text-amber-600">{reviewsData.filter((r) => !r.hostReply).length}</p>
          <p className="text-xs text-stone-400">Awaiting Reply</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-3 text-center">
          <p className="text-lg font-bold text-red-500">{flagged.size}</p>
          <p className="text-xs text-stone-400">Flagged</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400"
          />
        </div>
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
          <button onClick={() => setRatingFilter(null)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${ratingFilter === null ? 'bg-white text-stone-900' : 'text-stone-500'}`}>All</button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => setRatingFilter(ratingFilter === r ? null : r)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${ratingFilter === r ? 'bg-white text-stone-900' : 'text-stone-500'}`}>
              {r}<i className="ri-star-fill text-amber-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200 text-stone-400">No reviews found</div>
        )}
        {filtered.map((r) => (
          <div key={r.id} className={`bg-white rounded-xl border p-5 transition-all ${flagged.has(r.id) ? 'border-red-300 bg-red-50/30' : 'border-stone-200'}`}>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-full text-stone-600 font-bold shrink-0 text-sm">
                {r.guestName.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{r.guestName}</p>
                    <p className="text-stone-400 text-xs">{r.propertyName} &middot; {r.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((i) => (
                        <i key={i} className={`text-xs ${i <= r.rating ? 'ri-star-fill text-amber-400' : 'ri-star-line text-stone-300'}`} />
                      ))}
                    </div>
                    <button
                      onClick={() => toggleFlag(r.id)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${flagged.has(r.id) ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-400 hover:text-red-500'}`}
                      title={flagged.has(r.id) ? 'Unflag review' : 'Flag for review'}
                    >
                      <i className={flagged.has(r.id) ? 'ri-flag-fill' : 'ri-flag-line'} />
                    </button>
                  </div>
                </div>

                {/* Review text */}
                <p className="text-stone-600 text-sm leading-relaxed mb-3">{r.comment}</p>

                {/* Existing reply */}
                {r.hostReply && replyingTo !== r.id && (
                  <div className="ml-4 pl-3 border-l-2 border-amber-200 bg-amber-50/50 rounded-r-lg py-2 pr-3 mb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        <i className="ri-shield-user-line text-xs" /> Admin Response
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startReply(r.id, r.hostReply ?? '')}
                          className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer px-2 py-0.5 hover:bg-stone-100 rounded transition-colors"
                        >
                          <i className="ri-edit-line mr-1" />Edit
                        </button>
                        <button
                          onClick={() => deleteReply(r.id)}
                          className="text-xs text-red-400 hover:text-red-600 cursor-pointer px-2 py-0.5 hover:bg-red-50 rounded transition-colors"
                        >
                          <i className="ri-delete-bin-line mr-1" />Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed">{r.hostReply}</p>
                  </div>
                )}

                {/* Reply form */}
                {replyingTo === r.id ? (
                  <div className="mt-2 bg-stone-50 rounded-xl p-4 border border-stone-200">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="ri-reply-line text-stone-500" />
                      <p className="text-xs font-semibold text-stone-700">Write Admin Response</p>
                      <span className="ml-auto text-xs text-stone-400">{replyText.length}/500</span>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value.slice(0, 500))}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-700 outline-none focus:border-stone-400 resize-none bg-white"
                      placeholder="Thank the guest and address their feedback professionally..."
                      autoFocus
                    />
                    {/* Quick reply templates */}
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                      {[
                        'Thank you for your kind words! We hope to welcome you back soon.',
                        'We appreciate your feedback and will use it to improve our service.',
                        'Thank you for staying with us! Your feedback means a lot to our team.',
                      ].map((template) => (
                        <button
                          key={template}
                          onClick={() => setReplyText(template)}
                          className="text-xs px-2.5 py-1 bg-white border border-stone-200 rounded-full text-stone-600 hover:border-amber-300 hover:text-amber-700 cursor-pointer transition-colors whitespace-nowrap"
                        >
                          {template.slice(0, 35)}…
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => submitReply(r.id)}
                        disabled={!replyText.trim() || savingReply}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          savingReply ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        <i className={savingReply ? 'ri-check-line' : 'ri-send-plane-line'} />
                        {savingReply ? 'Saved!' : 'Post Reply'}
                      </button>
                      <button
                        onClick={cancelReply}
                        className="px-4 py-2 rounded-lg text-sm text-stone-500 hover:bg-stone-100 cursor-pointer whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  !r.hostReply && (
                    <button
                      onClick={() => startReply(r.id, '')}
                      className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-reply-line" /> Reply to Review
                    </button>
                  )
                )}

                {flagged.has(r.id) && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                    <i className="ri-flag-fill" /> Flagged for moderation — review pending admin action
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
