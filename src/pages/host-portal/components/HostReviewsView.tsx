import { useState, useMemo } from 'react';
import { HostReview, HostProperty } from '@/pages/admin/types';
import { replyToReview, editReviewReply, deleteReviewReply, loadHostData, getHostReviews } from '@/pages/admin/hostStore';

interface Props {
  hostId: string;
  reviews: HostReview[];
  properties: HostProperty[];
  onUpdate: (reviews: HostReview[]) => void;
}

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'text-lg' : 'text-sm';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`${s <= Math.round(rating) ? 'ri-star-fill text-amber-400' : 'ri-star-line text-stone-300'} ${sizeClass}`}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-500 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-stone-700 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export default function HostReviewsView({ hostId, reviews, properties, onUpdate }: Props) {
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [filterReply, setFilterReply] = useState<'all' | 'replied' | 'unreplied'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = () => onUpdate(getHostReviews(hostId));

  // Aggregate stats
  const stats = useMemo(() => {
    if (!reviews.length) return { avg: 0, cleanliness: 0, communication: 0, location: 0, value: 0, dist: [0, 0, 0, 0, 0] };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const cleanliness = reviews.reduce((s, r) => s + r.cleanlinessRating, 0) / reviews.length;
    const communication = reviews.reduce((s, r) => s + r.communicationRating, 0) / reviews.length;
    const location = reviews.reduce((s, r) => s + r.locationRating, 0) / reviews.length;
    const value = reviews.reduce((s, r) => s + r.valueRating, 0) / reviews.length;
    const dist = [5, 4, 3, 2, 1].map((star) =>
      reviews.filter((r) => Math.round(r.rating) === star).length
    );
    return { avg, cleanliness, communication, location, value, dist };
  }, [reviews]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = [...reviews];
    if (filterProperty !== 'all') result = result.filter((r) => r.propertyId === filterProperty);
    if (filterRating > 0) result = result.filter((r) => Math.round(r.rating) === filterRating);
    if (filterReply === 'replied') result = result.filter((r) => !!r.hostReply);
    if (filterReply === 'unreplied') result = result.filter((r) => !r.hostReply);

    switch (sortBy) {
      case 'oldest': return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'highest': return result.sort((a, b) => b.rating - a.rating);
      case 'lowest': return result.sort((a, b) => a.rating - b.rating);
      default: return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }, [reviews, filterProperty, filterRating, filterReply, sortBy]);

  const unrepliedCount = reviews.filter((r) => !r.hostReply).length;

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(hostId, reviewId, replyText.trim());
    refresh();
    setReplyingId(null);
    setReplyText('');
  };

  const handleEditSave = (reviewId: string) => {
    if (!editText.trim()) return;
    editReviewReply(hostId, reviewId, editText.trim());
    refresh();
    setEditingId(null);
    setEditText('');
  };

  const handleDeleteReply = (reviewId: string) => {
    if (!window.confirm('Delete your reply to this review?')) return;
    deleteReviewReply(hostId, reviewId);
    refresh();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Guest Reviews</h2>
          <p className="text-stone-500 text-sm mt-1">See what guests are saying and respond to reviews</p>
        </div>
        {unrepliedCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <i className="ri-chat-quote-line text-amber-500" />
            <span className="text-amber-800 text-sm font-medium">{unrepliedCount} review{unrepliedCount > 1 ? 's' : ''} awaiting reply</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
          <div className="w-16 h-16 flex items-center justify-center bg-amber-50 rounded-2xl mx-auto mb-4">
            <i className="ri-star-line text-amber-400 text-3xl" />
          </div>
          <p className="font-semibold text-stone-700 text-lg mb-2">No reviews yet</p>
          <p className="text-stone-400 text-sm max-w-sm mx-auto">Reviews from guests will appear here after their stays. Encourage guests to leave feedback!</p>
        </div>
      ) : (
        <>
          {/* Overview stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Overall score */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col items-center justify-center text-center">
              <p className="text-6xl font-bold text-stone-900">{stats.avg.toFixed(1)}</p>
              <StarDisplay rating={stats.avg} size="lg" />
              <p className="text-stone-400 text-sm mt-2">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Rating distribution */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <p className="text-sm font-semibold text-stone-700 mb-4">Rating Distribution</p>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star, i) => {
                  const count = stats.dist[i];
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <button
                      key={star}
                      onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                      className={`w-full flex items-center gap-2 cursor-pointer group rounded-lg px-1 py-0.5 transition-colors ${filterRating === star ? 'bg-amber-50' : 'hover:bg-stone-50'}`}
                    >
                      <span className="text-xs text-stone-500 w-3">{star}</span>
                      <i className="ri-star-fill text-amber-400 text-xs" />
                      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-stone-400 w-4 text-right">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category ratings */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <p className="text-sm font-semibold text-stone-700 mb-4">Category Ratings</p>
              <div className="space-y-3">
                <RatingBar label="Cleanliness" value={stats.cleanliness} />
                <RatingBar label="Communication" value={stats.communication} />
                <RatingBar label="Location" value={stats.location} />
                <RatingBar label="Value for Money" value={stats.value} />
              </div>
            </div>
          </div>

          {/* Filters & sort */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 mb-5">
            <div className="flex flex-wrap items-center gap-3">
              {/* Property filter */}
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-white cursor-pointer"
              >
                <option value="all">All Properties</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              {/* Reply filter */}
              <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                {(['all', 'unreplied', 'replied'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterReply(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap capitalize ${filterReply === f ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    {f === 'all' ? 'All' : f === 'unreplied' ? 'Needs Reply' : 'Replied'}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-stone-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-1.5 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>

            {/* Active rating filter pill */}
            {filterRating > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                <span className="text-xs text-stone-500">Filtered by:</span>
                <button
                  onClick={() => setFilterRating(0)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium cursor-pointer hover:bg-amber-200 transition-colors"
                >
                  {filterRating} <i className="ri-star-fill text-amber-400" /> only
                  <i className="ri-close-line ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Count */}
          <p className="text-sm text-stone-400 mb-4">
            Showing {filtered.length} of {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>

          {/* Reviews list */}
          {filtered.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-200 text-stone-400">
              <i className="ri-filter-line text-3xl mb-2 block" />
              <p>No reviews match your filters</p>
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((review) => {
              const isExpanded = expandedId === review.id;
              const isReplying = replyingId === review.id;
              const isEditing = editingId === review.id;
              const shortComment = review.comment.length > 200 ? review.comment.slice(0, 200) + '…' : review.comment;

              return (
                <div
                  key={review.id}
                  className={`bg-white rounded-xl border transition-all ${!review.hostReply ? 'border-amber-200' : 'border-stone-200'}`}
                >
                  <div className="p-5">
                    {/* Guest info row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-100 shrink-0">
                        {review.guestAvatar
                          ? <img src={review.guestAvatar} alt={review.guestName} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><i className="ri-user-line text-stone-400" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-bold text-stone-900">{review.guestName}</p>
                            <p className="text-xs text-stone-400">{review.propertyName}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {!review.hostReply && (
                              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 font-semibold rounded-full">
                                Needs Reply
                              </span>
                            )}
                            <span className="text-xs text-stone-400">{formatDate(review.date)}</span>
                          </div>
                        </div>

                        {/* Stars row */}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <StarDisplay rating={review.rating} />
                          <span className="text-sm font-bold text-stone-700">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Review comment */}
                    <p className="text-stone-700 text-sm leading-relaxed mb-3">
                      {isExpanded ? review.comment : shortComment}
                      {review.comment.length > 200 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : review.id)}
                          className="ml-1 text-stone-400 hover:text-stone-700 text-xs cursor-pointer underline"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </p>

                    {/* Sub-ratings (expand toggle) */}
                    {isExpanded && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 p-3 bg-stone-50 rounded-xl">
                        {[
                          { label: 'Cleanliness', val: review.cleanlinessRating },
                          { label: 'Communication', val: review.communicationRating },
                          { label: 'Location', val: review.locationRating },
                          { label: 'Value', val: review.valueRating },
                        ].map((cat) => (
                          <div key={cat.label} className="text-center">
                            <p className="text-xs text-stone-400 mb-1">{cat.label}</p>
                            <div className="flex items-center justify-center gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <i key={s} className={`${s <= cat.val ? 'ri-star-fill text-amber-400' : 'ri-star-line text-stone-200'} text-xs`} />
                              ))}
                            </div>
                            <p className="text-xs font-bold text-stone-700 mt-0.5">{cat.val.toFixed(1)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Host Reply section */}
                    {review.hostReply && !isEditing && (
                      <div className="mt-3 p-4 bg-stone-50 rounded-xl border-l-4 border-stone-900">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center bg-stone-900 rounded-full">
                              <i className="ri-user-line text-white text-xs" />
                            </div>
                            <span className="text-xs font-bold text-stone-800">Your Reply</span>
                            {review.hostReplyDate && (
                              <span className="text-xs text-stone-400">· {formatDate(review.hostReplyDate)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setEditingId(review.id); setEditText(review.hostReply!); setReplyingId(null); }}
                              className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                              title="Edit reply"
                            >
                              <i className="ri-edit-line text-xs" />
                            </button>
                            <button
                              onClick={() => handleDeleteReply(review.id)}
                              className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete reply"
                            >
                              <i className="ri-delete-bin-line text-xs" />
                            </button>
                          </div>
                        </div>
                        <p className="text-stone-700 text-sm leading-relaxed">{review.hostReply}</p>
                      </div>
                    )}

                    {/* Edit reply form */}
                    {isEditing && (
                      <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                        <p className="text-xs font-semibold text-stone-600 mb-2">Edit your reply</p>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={4}
                          maxLength={500}
                          className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 resize-none bg-white"
                          placeholder="Update your reply..."
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-stone-400">{editText.length}/500</span>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingId(null)} className="px-4 py-1.5 border border-stone-200 text-stone-600 rounded-xl text-xs font-medium cursor-pointer hover:bg-stone-50 whitespace-nowrap">Cancel</button>
                            <button onClick={() => handleEditSave(review.id)} disabled={!editText.trim()} className="px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-stone-800 disabled:opacity-50 whitespace-nowrap">Save Changes</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reply box */}
                    {isReplying && (
                      <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-xs font-semibold text-amber-800 mb-2">
                          <i className="ri-reply-line mr-1" />
                          Reply to {review.guestName}
                        </p>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={4}
                          maxLength={500}
                          className="w-full px-3 py-2.5 border border-amber-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 resize-none bg-white"
                          placeholder={`Thank ${review.guestName.split(' ')[0]} for their review...`}
                          autoFocus
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-stone-400">{replyText.length}/500 characters</span>
                          <div className="flex gap-2">
                            <button onClick={() => { setReplyingId(null); setReplyText(''); }} className="px-4 py-1.5 border border-stone-200 text-stone-600 rounded-xl text-xs font-medium cursor-pointer hover:bg-stone-50 whitespace-nowrap">Cancel</button>
                            <button onClick={() => handleReply(review.id)} disabled={!replyText.trim()} className="px-4 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-stone-800 disabled:opacity-50 whitespace-nowrap">
                              <i className="ri-send-plane-line mr-1" /> Post Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    {!isReplying && !isEditing && (
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                        {!review.hostReply ? (
                          <button
                            onClick={() => { setReplyingId(review.id); setReplyText(''); setEditingId(null); setExpandedId(review.id); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <i className="ri-reply-line" /> Reply to Review
                          </button>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <i className="ri-check-line" /> You replied on {formatDate(review.hostReplyDate!)}
                          </span>
                        )}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : review.id)}
                          className="ml-auto flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 cursor-pointer whitespace-nowrap"
                        >
                          {isExpanded ? 'Less detail' : 'More detail'}
                          <i className={isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
