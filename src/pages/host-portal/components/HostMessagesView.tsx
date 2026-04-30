import { useState, useEffect, useRef } from 'react';
import { HostMessage, HostBooking } from '@/pages/admin/types';
import { addHostMessage, markMessagesAsRead, loadHostData, saveHostData } from '@/pages/admin/hostStore';

interface Props {
  hostId: string;
  hostName: string;
  messages: HostMessage[];
  bookings: HostBooking[];
  onMessagesUpdate: (messages: HostMessage[]) => void;
}

interface Conversation {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  messages: HostMessage[];
  lastMessageAt: string;
  unreadCount: number;
}

function groupByBooking(msgs: HostMessage[]): Conversation[] {
  const map: Record<string, HostMessage[]> = {};
  msgs.forEach((m) => {
    if (!map[m.bookingId]) map[m.bookingId] = [];
    map[m.bookingId].push(m);
  });
  return Object.entries(map)
    .map(([bookingId, messages]) => {
      const sorted = [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const last = sorted[sorted.length - 1];
      const unreadCount = sorted.filter((m) => m.sender === 'guest' && !m.read).length;
      return {
        bookingId,
        guestName: last.guestName,
        guestEmail: last.guestEmail,
        propertyName: last.propertyName,
        messages: sorted,
        lastMessageAt: last.timestamp,
        unreadCount,
      };
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export default function HostMessagesView({ hostId, hostName, messages, bookings, onMessagesUpdate }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(() => groupByBooking(messages));
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Refresh conversations when messages prop changes
  useEffect(() => {
    setConversations(groupByBooking(messages));
  }, [messages]);

  // Auto-scroll to bottom when conversation changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedBookingId, conversations]);

  const selectedConversation = conversations.find((c) => c.bookingId === selectedBookingId);

  const handleSelectConversation = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    // Mark messages as read
    const conv = conversations.find((c) => c.bookingId === bookingId);
    if (conv && conv.unreadCount > 0) {
      markMessagesAsRead(hostId, bookingId);
      // Update local state
      const updated = conversations.map((c) => (c.bookingId === bookingId ? { ...c, unreadCount: 0 } : c));
      setConversations(updated);
      // Update parent
      const data = loadHostData();
      onMessagesUpdate(data.messages.filter((m) => m.hostId === hostId));
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;
    setSending(true);

    const newMessage: HostMessage = {
      id: `m_${Date.now()}`,
      bookingId: selectedConversation.bookingId,
      hostId,
      guestName: selectedConversation.guestName,
      guestEmail: selectedConversation.guestEmail,
      propertyName: selectedConversation.propertyName,
      sender: 'host',
      content: replyText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    addHostMessage(newMessage);

    // Update local state
    const updatedConversations = conversations.map((c) =>
      c.bookingId === selectedConversation.bookingId
        ? { ...c, messages: [...c.messages, newMessage], lastMessageAt: newMessage.timestamp }
        : c
    );
    setConversations(updatedConversations);
    setReplyText('');
    setSending(false);

    // Update parent
    const data = loadHostData();
    onMessagesUpdate(data.messages.filter((m) => m.hostId === hostId));
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-stone-900">Messages</h2>
          {totalUnread > 0 && (
            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              {totalUnread} new
            </span>
          )}
        </div>
        <p className="text-stone-500 text-sm mt-1">Chat with your guests about their bookings</p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 h-full flex overflow-hidden">
        {/* Conversations list */}
        <div className="w-full md:w-80 border-r border-stone-200 flex flex-col">
          <div className="p-3 border-b border-stone-100 bg-stone-50">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <div className="p-8 text-center text-stone-400">
                <i className="ri-chat-3-line text-3xl mb-2 block" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Guests will appear here when they message you</p>
              </div>
            )}
            {conversations.map((c) => {
              const lastMsg = c.messages[c.messages.length - 1];
              const isSelected = selectedBookingId === c.bookingId;
              return (
                <button
                  key={c.bookingId}
                  onClick={() => handleSelectConversation(c.bookingId)}
                  className={`w-full text-left p-4 border-b border-stone-100 transition-colors cursor-pointer ${
                    isSelected ? 'bg-amber-50 border-l-4 border-l-amber-400' : 'hover:bg-stone-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-full shrink-0">
                      <i className="ri-user-line text-stone-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm truncate ${c.unreadCount > 0 ? 'text-stone-900' : 'text-stone-700'}`}>
                          {c.guestName}
                        </p>
                        {c.unreadCount > 0 && (
                          <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full shrink-0">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 truncate">{c.propertyName}</p>
                      <p className={`text-xs mt-1 truncate ${c.unreadCount > 0 ? 'font-medium text-stone-700' : 'text-stone-400'}`}>
                        {lastMsg.sender === 'host' ? 'You: ' : ''}{lastMsg.content}
                      </p>
                      <p className="text-xs text-stone-300 mt-1">{formatDate(lastMsg.timestamp)} · {formatTime(lastMsg.timestamp)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div className="hidden md:flex flex-1 flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-stone-400">
              <div className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
                  <i className="ri-chat-3-line text-3xl text-stone-300" />
                </div>
                <p className="font-medium text-stone-500">Select a conversation</p>
                <p className="text-sm mt-1">Choose a guest from the list to view messages</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-stone-200 rounded-full">
                    <i className="ri-user-line text-stone-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{selectedConversation.guestName}</p>
                    <p className="text-xs text-stone-500">{selectedConversation.propertyName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400">Booking ID</p>
                  <p className="text-xs font-mono text-stone-600">{selectedConversation.bookingId}</p>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
                {selectedConversation.messages.map((msg, idx) => {
                  const isHost = msg.sender === 'host';
                  const showDate = idx === 0 || formatDate(msg.timestamp) !== formatDate(selectedConversation.messages[idx - 1].timestamp);
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{formatDate(msg.timestamp)}</span>
                        </div>
                      )}
                      <div className={`flex ${isHost ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${isHost ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-800'} rounded-2xl px-4 py-3`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-xs mt-1.5 ${isHost ? 'text-stone-400' : 'text-stone-400'}`}>
                            {formatTime(msg.timestamp)}
                            {isHost && <span className="ml-2"><i className="ri-check-double-line" /></span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-stone-200 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !sending && handleSendReply()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                    className="px-5 py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex items-center gap-2"
                  >
                    {sending ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-send-plane-fill" />}
                    Send
                  </button>
                </div>
                <p className="text-xs text-stone-400 mt-2">Press Enter to send quickly</p>
              </div>
            </>
          )}
        </div>

        {/* Mobile chat view (when selected) */}
        {selectedConversation && (
          <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
            {/* Mobile header */}
            <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
              <button onClick={() => setSelectedBookingId(null)} className="w-8 h-8 flex items-center justify-center text-stone-500 cursor-pointer">
                <i className="ri-arrow-left-line text-xl" />
              </button>
              <div className="w-9 h-9 flex items-center justify-center bg-stone-200 rounded-full">
                <i className="ri-user-line text-stone-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900 text-sm truncate">{selectedConversation.guestName}</p>
                <p className="text-xs text-stone-500 truncate">{selectedConversation.propertyName}</p>
              </div>
            </div>

            {/* Mobile messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
              {selectedConversation.messages.map((msg, idx) => {
                const isHost = msg.sender === 'host';
                const showDate = idx === 0 || formatDate(msg.timestamp) !== formatDate(selectedConversation.messages[idx - 1].timestamp);
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{formatDate(msg.timestamp)}</span>
                      </div>
                    )}
                    <div className={`flex ${isHost ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${isHost ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-800'} rounded-2xl px-4 py-3`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1.5 ${isHost ? 'text-stone-400' : 'text-stone-400'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile reply */}
            <div className="p-4 border-t border-stone-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !sending && handleSendReply()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sending}
                  className="w-12 h-12 flex items-center justify-center bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {sending ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-send-plane-fill" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
