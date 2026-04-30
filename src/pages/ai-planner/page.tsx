import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import {
  ChatMessage,
  initialGreeting,
  suggestionPrompts,
  quickReplies,
} from '@/mocks/aiPlanner';
import { loadCMSData } from '@/pages/admin/cmsStore';
import { runPlannerTurn, QueryState } from './ragEngine';

export default function AIPlannerPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live corpus from the CMS — retrieval grounds every answer in this data.
  const corpus = useMemo(() => loadCMSData().properties, []);

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  // Accumulated dialogue state so follow-ups ("cheaper", "plan an itinerary")
  // retain prior slots like destination & budget.
  const [plannerState, setPlannerState] = useState<QueryState | undefined>(undefined);

  // Auto-scroll the messages container to the newest message.
  // Skip on first render (only the greeting is present) and use `block: 'nearest'`
  // so we never scroll the outer window — just the chat pane itself.
  useEffect(() => {
    if (messages.length <= 1 && !isTyping) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  // Focus input on mount WITHOUT scrolling — otherwise focus() drags the
  // window past the hero/header on first paint.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setShowSuggestions(false);
    setIsTyping(true);

    // RAG planner turn: extract intent, retrieve from CMS properties, generate reply.
    // Wrapped in a short timeout so the typing indicator is visible (UX only).
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const { reply, state } = runPlannerTurn(text, plannerState, corpus);
      setPlannerState(state);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { ...reply, id: `ai-${Date.now()}`, timestamp: new Date() },
      ]);
    }, delay);
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  const handleQuickReply = (action: string) => {
    handleSendMessage(action);
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar />
      
      {/* Main Chat Container */}
      <div className="flex-1 pt-20 pb-4 flex flex-col max-w-4xl mx-auto w-full px-4">
        {/* Chat Header */}
        <div className="bg-white rounded-t-2xl border border-stone-200 border-b-0 p-4 flex items-center gap-4 sticky top-20 z-10">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg">
            <i className="ri-ai-generate text-white text-xl" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-stone-900 text-lg">Triprodeo AI Planner</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-stone-500 text-sm">Online and ready to help</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/search')}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white border-x border-stone-200 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px] p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Avatar for AI */}
                {message.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 flex items-center justify-center bg-amber-400 rounded-full">
                      <i className="ri-ai-generate text-white text-xs" />
                    </div>
                    <span className="text-stone-400 text-xs">Triprodeo AI</span>
                  </div>
                )}

                {/* Message Content */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-stone-900 text-white rounded-br-sm'
                    : 'bg-stone-100 text-stone-800 rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  
                  {/* Property Cards */}
                  {message.type === 'property' && message.data?.properties && (
                    <div className="mt-4 space-y-3">
                      {message.data.properties.map((property) => (
                        <div 
                          key={property.id}
                          onClick={() => handlePropertyClick(property.id)}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex">
                            <img 
                              src={property.image} 
                              alt={property.name}
                              className="w-28 h-24 object-cover shrink-0"
                            />
                            <div className="p-3 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold text-stone-900 text-sm">{property.name}</h3>
                                <p className="text-stone-500 text-xs">{property.location}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <i className="ri-star-fill text-amber-400 text-xs" />
                                  <span className="text-xs font-medium text-stone-900">{property.rating}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-stone-900">₹{property.price.toLocaleString('en-IN')}<span className="text-stone-400 font-normal text-xs">/night</span></span>
                                <div className="flex gap-1">
                                  {property.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => navigate('/search')}
                        className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        View all properties
                      </button>
                    </div>
                  )}

                  {/* Itinerary */}
                  {message.type === 'itinerary' && message.data?.itinerary && (
                    <div className="mt-4 space-y-3">
                      {message.data.itinerary.map((day) => (
                        <div key={day.day} className="bg-white rounded-xl p-4 border border-stone-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full">
                              <span className="text-amber-700 font-bold text-sm">{day.day}</span>
                            </div>
                            <h4 className="font-semibold text-stone-900">{day.title}</h4>
                          </div>
                          <ul className="space-y-2">
                            {day.activities.map((activity, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                                <i className="ri-check-line text-emerald-500 mt-0.5" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {message.data.priceEstimate && (
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <i className="ri-money-rupee-circle-line text-amber-600" />
                            <span className="font-semibold text-amber-900">Estimated Total</span>
                          </div>
                          <p className="text-amber-800 text-sm">
                            {message.data.priceEstimate.currency}{message.data.priceEstimate.min.toLocaleString('en-IN')} - {message.data.priceEstimate.currency}{message.data.priceEstimate.max.toLocaleString('en-IN')}
                          </p>
                          <p className="text-amber-600 text-xs mt-1">Includes stay, activities & meals</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Price Estimate */}
                  {message.type === 'price' && message.data?.priceEstimate && (
                    <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-money-rupee-circle-line text-amber-600 text-lg" />
                        <span className="font-semibold text-amber-900">Price Breakdown</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-stone-600">
                          <span>Accommodation (2 nights)</span>
                          <span>₹25,000 - ₹40,000</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Activities & Experiences</span>
                          <span>₹8,000 - ₹12,000</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Meals & Dining</span>
                          <span>₹5,000 - ₹8,000</span>
                        </div>
                        <div className="border-t border-amber-200 pt-2 flex justify-between font-bold text-amber-900">
                          <span>Total Estimate</span>
                          <span>{message.data.priceEstimate.currency}{message.data.priceEstimate.min.toLocaleString('en-IN')} - {message.data.priceEstimate.currency}{message.data.priceEstimate.max.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Replies */}
                  {message.role === 'ai' && index === messages.length - 1 && !isTyping && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.text}
                          onClick={() => handleQuickReply(reply.text)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-xs text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          <i className={reply.icon} />
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <p className={`text-xs text-stone-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-stone-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {showSuggestions && messages.length === 1 && (
          <div className="bg-white border-x border-stone-200 p-4">
            <p className="text-stone-500 text-xs mb-3 font-medium">Popular trip ideas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handleSuggestionClick(prompt.text)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer hover:scale-105 ${prompt.color}`}
                >
                  <i className={prompt.icon} />
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Describe your dream trip..."
                className="w-full px-4 py-3 pr-12 bg-stone-100 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              />
              <button 
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {inputText && <i className="ri-close-circle-line" />}
              </button>
            </div>
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              className="w-12 h-12 flex items-center justify-center bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <i className="ri-send-plane-fill text-lg" />
            </button>
          </div>
          
          {/* Input Hints */}
          <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <i className="ri-lightbulb-line" />
              Try: "Weekend in Goa under ₹20k"
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-calendar-line" />
              Mention dates for better results
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}