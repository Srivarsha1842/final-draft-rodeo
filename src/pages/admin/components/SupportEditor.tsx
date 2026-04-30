import { useState } from 'react';
import { CMSSupportContent } from '../types';

interface SupportEditorProps {
  data: CMSSupportContent;
  onSave: (data: CMSSupportContent) => void;
}

export default function SupportEditor({ data, onSave }: SupportEditorProps) {
  const [form, setForm] = useState<CMSSupportContent>(JSON.parse(JSON.stringify(data)));
  const [saved, setSaved] = useState(false);
  const [editingFaq, setEditingFaq] = useState<number | null>(null);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateFaq = (index: number, field: string, val: string) => {
    const faqs = [...form.faqs];
    faqs[index] = { ...faqs[index], [field]: val };
    setForm({ ...form, faqs });
  };

  const addFaq = () => {
    const newFaq = { id: `f${Date.now()}`, question: '', answer: '', category: 'Bookings & Payments' };
    setForm({ ...form, faqs: [...form.faqs, newFaq] });
    setEditingFaq(form.faqs.length);
  };

  const removeFaq = (index: number) => {
    setForm({ ...form, faqs: form.faqs.filter((_, i) => i !== index) });
    if (editingFaq === index) setEditingFaq(null);
  };

  const categories = ['Bookings & Payments', 'Cancellations & Refunds', 'Check-in & Stay', 'Account & Loyalty', 'Hosting'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Support & FAQs</h2>
          <p className="text-stone-500 text-sm">Edit hero text, contact info, and manage FAQs.</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
          <i className={saved ? 'ri-check-line' : 'ri-save-line'} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-stone-700">Hero Text</h3>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Headline</label>
            <input type="text" value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Subheadline</label>
            <textarea value={form.heroSubheadline} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={2} maxLength={500} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Phone Number</label>
              <input type="text" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="+91 1800-123-4567" />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Email Address</label>
              <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="support@triprodeo.com" />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">WhatsApp Number</label>
              <input type="text" value={form.contactWhatsapp} onChange={(e) => setForm({ ...form, contactWhatsapp: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-700">FAQs ({form.faqs.length})</h3>
            <button onClick={addFaq} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-add-line" />Add FAQ
            </button>
          </div>
          <div className="space-y-3">
            {form.faqs.map((faq, i) => (
              <div key={faq.id} className="border border-stone-100 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-stone-50"
                  onClick={() => setEditingFaq(editingFaq === i ? null : i)}
                >
                  <span className="text-xs text-stone-400 font-mono w-5">{i + 1}</span>
                  <span className="flex-1 text-sm text-stone-700 truncate">{faq.question || 'Untitled FAQ'}</span>
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full shrink-0">{faq.category}</span>
                  <i className={`text-stone-400 text-sm ${editingFaq === i ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                  <button onClick={(e) => { e.stopPropagation(); removeFaq(i); }} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                    <i className="ri-delete-bin-line text-xs" />
                  </button>
                </div>
                {editingFaq === i && (
                  <div className="px-4 pb-4 space-y-3 bg-stone-50 border-t border-stone-100">
                    <div className="pt-3">
                      <label className="block text-xs text-stone-500 mb-1">Category</label>
                      <select value={faq.category} onChange={(e) => updateFaq(i, 'category', e.target.value)} className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white outline-none focus:border-stone-400 cursor-pointer">
                        {categories.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Question</label>
                      <input type="text" value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white outline-none focus:border-stone-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1">Answer</label>
                      <textarea value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white outline-none focus:border-stone-400 resize-none" rows={3} maxLength={500} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
