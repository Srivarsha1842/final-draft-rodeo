import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { properties } from '@/mocks/properties';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const property = properties.find((p) => p.id === id) || properties[0];
  
  // Parse URL params
  const checkInParam = searchParams.get('checkIn') || '';
  const checkOutParam = searchParams.get('checkOut') || '';
  const guestsParam = parseInt(searchParams.get('guests') || '2');
  const addOnsParam = searchParams.get('addOns')?.split(',').filter(Boolean) || [];
  
  const [step, setStep] = useState(1);
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [partialAmount, setPartialAmount] = useState(50);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
    saveCard: false,
  });
  
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(addOnsParam);
  const [checkIn, setCheckIn] = useState(checkInParam);
  const [checkOut, setCheckOut] = useState(checkOutParam);
  const [guests, setGuests] = useState(guestsParam);
  
  // Calculate pricing
  const nights = checkIn && checkOut 
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 2;
  const subtotal = property.pricePerNight * nights;
  const addOnTotal = property.addOns.filter((a) => selectedAddOns.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const serviceFee = Math.round(subtotal * 0.1);
  const totalBeforeDiscount = subtotal + serviceFee + addOnTotal;
  const total = totalBeforeDiscount - discount;
  const partialPayAmount = Math.round(total * (partialAmount / 100));
  const balanceDue = total - partialPayAmount;
  
  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'triprodeo20') {
      setDiscount(Math.round(totalBeforeDiscount * 0.2));
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(Math.round(totalBeforeDiscount * 0.1));
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };
  
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleAddOnsSubmit = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setBookingId('TRP' + Math.random().toString(36).substr(2, 9).toUpperCase());
    setIsConfirmed(true);
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };
  
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        
        <div className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 md:px-8">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-emerald-600 text-4xl" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Booking Confirmed!
              </h1>
              <p className="text-stone-600">Your reservation is confirmed. We&apos;ve sent the details to your email.</p>
            </div>
            
            {/* Booking Card */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-6">
              <div className="bg-stone-900 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-stone-400 text-sm">Booking ID</span>
                  <span className="font-mono font-semibold">{bookingId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={property.images[0]} alt={property.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-semibold">{property.name}</h3>
                    <p className="text-stone-400 text-sm">{property.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Check-in</p>
                    <p className="font-semibold text-stone-900">{checkIn ? new Date(checkIn).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}</p>
                    <p className="text-stone-500 text-sm">After 2:00 PM</p>
                  </div>
                  <div>
                    <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Check-out</p>
                    <p className="font-semibold text-stone-900">{checkOut ? new Date(checkOut).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}</p>
                    <p className="text-stone-500 text-sm">Before 11:00 AM</p>
                  </div>
                </div>
                
                <div className="border-t border-stone-100 pt-4">
                  <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Guests</p>
                  <p className="font-semibold text-stone-900">{guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
                </div>
                
                {selectedAddOns.length > 0 && (
                  <div className="border-t border-stone-100 pt-4">
                    <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">Add-ons</p>
                    <div className="space-y-1">
                      {property.addOns.filter((a) => selectedAddOns.includes(a.id)).map((addon) => (
                        <p key={addon.id} className="text-stone-700 text-sm">{addon.name}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t border-stone-100 pt-4">
                  <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Guest</p>
                  <p className="font-semibold text-stone-900">{guestDetails.firstName} {guestDetails.lastName}</p>
                  <p className="text-stone-500 text-sm">{guestDetails.email}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
              <h3 className="font-semibold text-stone-900 mb-4">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>₹{property.pricePerNight.toLocaleString('en-IN')} × {nights} nights</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {addOnTotal > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Add-ons</span>
                    <span>₹{addOnTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Service fee</span>
                  <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                
                {isPartialPayment ? (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl">
                    <div className="flex justify-between text-amber-800 font-semibold mb-1">
                      <span>Paid Now ({partialAmount}%)</span>
                      <span>₹{partialPayAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-stone-600 text-sm">
                      <span>Balance Due on Arrival</span>
                      <span>₹{balanceDue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Paid in Full</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate('/')}
                className="flex-1 py-3.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Back to Home
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3.5 border border-stone-300 text-stone-900 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-download-line" /> Download Invoice
              </button>
            </div>
            
            {/* WhatsApp Support */}
            <div className="mt-6 text-center">
              <p className="text-stone-500 text-sm mb-2">Need help with your booking?</p>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:underline"
              >
                <i className="ri-whatsapp-line text-lg" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4 cursor-pointer"
            >
              <i className="ri-arrow-left-line" /> Back to property
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Complete Your Booking
            </h1>
            <p className="text-stone-500 mt-1">Just a few steps to secure your stay at {property.name}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step Indicator */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="flex items-center justify-between">
                  {[
                    { num: 1, label: 'Guest Details' },
                    { num: 2, label: 'Add-ons' },
                    { num: 3, label: 'Payment' },
                  ].map((s, i) => (
                    <div key={s.num} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        step >= s.num ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-400'
                      }`}>
                        {step > s.num ? <i className="ri-check-line" /> : s.num}
                      </div>
                      <span className={`ml-2 text-sm font-medium hidden sm:block ${
                        step >= s.num ? 'text-stone-900' : 'text-stone-400'
                      }`}>
                        {s.label}
                      </span>
                      {i < 2 && <div className="w-8 sm:w-16 h-0.5 bg-stone-200 mx-2 sm:mx-4" />}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Step 1: Guest Details */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-stone-900 mb-6">Guest Details</h2>
                  
                  <form onSubmit={handleGuestSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">First Name *</label>
                        <input
                          type="text"
                          required
                          value={guestDetails.firstName}
                          onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={guestDetails.lastName}
                          onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={guestDetails.email}
                        onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number *</label>
                      <div className="flex gap-2">
                        <div className="px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-600 flex items-center gap-1">
                          <img src="https://flagcdn.com/w40/in.png" alt="IN" className="w-5 h-3.5 object-cover rounded-sm" />
                          <span className="text-sm">+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          value={guestDetails.phone}
                          onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                          className="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                          placeholder="98765 43210"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Special Requests (Optional)</label>
                      <textarea
                        value={guestDetails.specialRequests}
                        onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                        rows={3}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all resize-none"
                        placeholder="Any special requests for your stay? (e.g., early check-in, dietary requirements, celebration setup)"
                      />
                      <p className="text-stone-400 text-xs mt-1">{guestDetails.specialRequests.length}/500 characters</p>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                      <input type="checkbox" required id="terms" className="mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
                      <label htmlFor="terms" className="text-sm text-stone-600">
                        I agree to the <a href="#" className="underline hover:text-stone-900">Terms of Service</a>, <a href="#" className="underline hover:text-stone-900">Privacy Policy</a>, and <a href="#" className="underline hover:text-stone-900">Cancellation Policy</a>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-4 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Continue to Add-ons
                    </button>
                  </form>
                </div>
              )}
              
              {/* Step 2: Add-ons */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-stone-900 mb-2">Enhance Your Stay</h2>
                  <p className="text-stone-500 text-sm mb-6">Optional extras to make your trip unforgettable</p>
                  
                  {property.addOns.length > 0 ? (
                    <div className="mb-6">
                      {/* Side-scroll container */}
                      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1" style={{ scrollSnapType: 'x mandatory' }}>
                        {property.addOns.map((addon) => {
                          const selected = selectedAddOns.includes(addon.id);
                          return (
                            <div
                              key={addon.id}
                              onClick={() => toggleAddOn(addon.id)}
                              style={{ scrollSnapAlign: 'start', minWidth: '220px', maxWidth: '220px' }}
                              className={`flex-shrink-0 rounded-2xl border-2 cursor-pointer transition-all overflow-hidden ${
                                selected ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              <div className="relative h-36 bg-stone-100">
                                {addon.image ? (
                                  <img src={addon.image} alt={addon.name} className="w-full h-full object-cover object-top" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <i className="ri-gift-line text-stone-300 text-3xl" />
                                  </div>
                                )}
                                <div className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  selected ? 'border-stone-900 bg-stone-900' : 'border-white bg-white/80'
                                }`}>
                                  {selected && <i className="ri-check-line text-white text-xs" />}
                                </div>
                              </div>
                              <div className="p-3">
                                <h3 className="font-semibold text-stone-900 text-sm leading-tight line-clamp-1">{addon.name}</h3>
                                <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">{addon.description}</p>
                                <p className="font-bold text-stone-900 text-sm mt-2">+₹{addon.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {property.addOns.length > 3 && (
                        <p className="text-xs text-stone-400 mt-2 flex items-center gap-1">
                          <i className="ri-arrow-right-s-line" /> Scroll to see all {property.addOns.length} add-ons
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-stone-500">
                      <i className="ri-gift-line text-4xl mb-2" />
                      <p>No add-ons available for this property</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 border border-stone-300 text-stone-900 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAddOnsSubmit}
                      className="flex-1 py-3.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Payment Options */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-stone-900 mb-6">Payment Options</h2>
                    
                    {/* Partial Payment Toggle */}
                    <div className="mb-6 p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <i className="ri-wallet-3-line text-stone-600" />
                          <span className="font-semibold text-stone-900">Partial Payment</span>
                        </div>
                        <button
                          onClick={() => setIsPartialPayment(!isPartialPayment)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            isPartialPayment ? 'bg-stone-900' : 'bg-stone-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                            isPartialPayment ? 'left-6' : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                      <p className="text-stone-500 text-sm">Pay a portion now and the rest at check-in</p>
                      
                      {isPartialPayment && (
                        <div className="mt-4 pt-4 border-t border-stone-200">
                          <label className="block text-sm font-medium text-stone-700 mb-2">Pay Now: {partialAmount}%</label>
                          <input
                            type="range"
                            min="30"
                            max="70"
                            value={partialAmount}
                            onChange={(e) => setPartialAmount(parseInt(e.target.value))}
                            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                          />
                          <div className="flex justify-between text-sm text-stone-500 mt-1">
                            <span>30%</span>
                            <span>70%</span>
                          </div>
                          <div className="mt-3 p-3 bg-white rounded-lg border border-stone-200">
                            <div className="flex justify-between text-sm">
                              <span className="text-stone-600">Pay now</span>
                              <span className="font-semibold text-stone-900">₹{partialPayAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-stone-600">Balance due on arrival</span>
                              <span className="font-semibold text-stone-900">₹{balanceDue.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Promo Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-stone-700 mb-2">Promo Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          disabled={promoApplied}
                          className="flex-1 px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all uppercase"
                          placeholder="Enter code (try TRIPRODEO20)"
                        />
                        <button
                          onClick={applyPromoCode}
                          disabled={!promoCode || promoApplied}
                          className="px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                        >
                          {promoApplied ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="text-emerald-600 text-sm mt-2 flex items-center gap-1">
                          <i className="ri-check-line" /> Promo code applied! You saved ₹{discount.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                    
                    {/* Card Payment Form */}
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={paymentDetails.cardNumber}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: formatCardNumber(e.target.value) })}
                            className="w-full px-4 py-3 pl-12 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                            placeholder="1234 5678 9012 3456"
                          />
                          <i className="ri-bank-card-line absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">Expiry Date</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={paymentDetails.expiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '');
                              if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                              setPaymentDetails({ ...paymentDetails, expiry: v });
                            }}
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">CVV</label>
                          <input
                            type="text"
                            required
                            maxLength={3}
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={paymentDetails.cardholderName}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })}
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
                          placeholder="Name on card"
                        />
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="saveCard"
                          checked={paymentDetails.saveCard}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, saveCard: e.target.checked })}
                          className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                        />
                        <label htmlFor="saveCard" className="text-sm text-stone-600">Save card for future bookings</label>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-6 py-3.5 border border-stone-300 text-stone-900 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="flex-1 py-3.5 bg-stone-900 text-white rounded-xl font-semibold text-sm hover:bg-stone-800 transition-colors disabled:opacity-70 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <i className="ri-loader-4-line animate-spin" /> Processing...
                            </>
                          ) : (
                            <>Pay ₹{(isPartialPayment ? partialPayAmount : total).toLocaleString('en-IN')}</>
                          )}
                        </button>
                      </div>
                    </form>
                    
                    {/* Security Note */}
                    <div className="mt-4 flex items-center gap-2 text-stone-500 text-sm">
                      <i className="ri-shield-check-line text-emerald-600" />
                      <span>Your payment is secured with 256-bit SSL encryption</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right: Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  {/* Property Card */}
                  <div className="p-4 border-b border-stone-100">
                    <div className="flex gap-3">
                      <img src={property.images[0]} alt={property.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div>
                        <h3 className="font-semibold text-stone-900 text-sm line-clamp-2">{property.name}</h3>
                        <p className="text-stone-500 text-xs mt-0.5">{property.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <i className="ri-star-fill text-amber-400 text-xs" />
                          <span className="text-xs font-semibold text-stone-900">{property.rating}</span>
                          <span className="text-stone-400 text-xs">({property.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dates & Guests */}
                  <div className="p-4 border-b border-stone-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <i className="ri-calendar-line text-stone-400" />
                        <span className="text-stone-600">{checkIn ? new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Check-in'}</span>
                        <i className="ri-arrow-right-line text-stone-400" />
                        <span className="text-stone-600">{checkOut ? new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Check-out'}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="text-stone-900 text-sm font-semibold underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <i className="ri-user-line text-stone-400" />
                      <span className="text-stone-600">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>₹{property.pricePerNight.toLocaleString('en-IN')} × {nights} nights</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {addOnTotal > 0 && (
                      <div className="flex justify-between text-stone-600">
                        <span>Add-ons</span>
                        <span>₹{addOnTotal.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-600">
                      <span>Service fee</span>
                      <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Promo discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900">
                      <span>Total</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {isPartialPayment && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                        <div className="flex justify-between text-amber-800 font-semibold text-sm mb-1">
                          <span>Pay Now ({partialAmount}%)</span>
                          <span>₹{partialPayAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-stone-600 text-xs">
                          <span>Balance Due</span>
                          <span>₹{balanceDue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Cancellation Policy */}
                  <div className="p-4 bg-stone-50 border-t border-stone-100">
                    <h4 className="font-semibold text-stone-900 text-sm mb-2">Cancellation Policy</h4>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      Free cancellation up to 48 hours before check-in. After that, the first night is non-refundable.
                    </p>
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: 'ri-shield-check-line', label: 'Secure' },
                    { icon: 'ri-customer-service-2-line', label: '24/7 Support' },
                    { icon: 'ri-verified-badge-line', label: 'Verified' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-stone-200">
                      <i className={`${icon} text-stone-600`} />
                      <span className="text-xs text-stone-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}