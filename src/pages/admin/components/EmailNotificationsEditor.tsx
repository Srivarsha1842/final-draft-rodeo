import { useState } from 'react';

interface EmailTemplate {
  id: string;
  trigger: string;
  triggerLabel: string;
  icon: string;
  color: string;
  subject: string;
  body: string;
  enabled: boolean;
  recipientType: 'guest' | 'host' | 'both';
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'booking_confirmed',
    trigger: 'booking_confirmed',
    triggerLabel: 'Booking Confirmed',
    icon: 'ri-checkbox-circle-line',
    color: 'text-emerald-600 bg-emerald-50',
    subject: 'Your booking at {{property_name}} is confirmed! 🎉',
    body: `Hi {{guest_name}},

Great news! Your booking at {{property_name}} has been confirmed.

📅 Check-in: {{check_in_date}}
📅 Check-out: {{check_out_date}}
👥 Guests: {{guest_count}}
💰 Total: ₹{{total_amount}}

Your host {{host_name}} is looking forward to welcoming you. If you have any questions, feel free to reply to this email.

See you soon!
The Triprodeo Team`,
    enabled: true,
    recipientType: 'guest',
  },
  {
    id: 'booking_pending',
    trigger: 'booking_pending',
    triggerLabel: 'Booking Pending Review',
    icon: 'ri-time-line',
    color: 'text-amber-600 bg-amber-50',
    subject: 'We received your booking request for {{property_name}}',
    body: `Hi {{guest_name}},

We've received your booking request for {{property_name}} and it's currently under review by the host.

📅 Requested dates: {{check_in_date}} – {{check_out_date}}
👥 Guests: {{guest_count}}

You'll receive a confirmation email once the host approves your request. This usually takes 2–24 hours.

Thank you for choosing Triprodeo!`,
    enabled: true,
    recipientType: 'both',
  },
  {
    id: 'booking_cancelled',
    trigger: 'booking_cancelled',
    triggerLabel: 'Booking Cancelled',
    icon: 'ri-close-circle-line',
    color: 'text-red-500 bg-red-50',
    subject: 'Your booking at {{property_name}} has been cancelled',
    body: `Hi {{guest_name}},

We're sorry to inform you that your booking at {{property_name}} for {{check_in_date}} – {{check_out_date}} has been cancelled.

If you have any questions about your refund or need assistance booking an alternative property, please contact our support team.

We hope to see you again soon.
The Triprodeo Team`,
    enabled: true,
    recipientType: 'guest',
  },
  {
    id: 'booking_completed',
    trigger: 'booking_completed',
    triggerLabel: 'Stay Completed',
    icon: 'ri-star-line',
    color: 'text-stone-600 bg-stone-100',
    subject: 'How was your stay at {{property_name}}? Leave a review!',
    body: `Hi {{guest_name}},

We hope you had a wonderful time at {{property_name}}! 🌟

Your feedback helps other travellers make informed decisions. It takes just 2 minutes to leave a review.

👉 [Leave a Review] (link)

Thank you for choosing Triprodeo. We can't wait to welcome you on your next adventure!`,
    enabled: true,
    recipientType: 'guest',
  },
  {
    id: 'day_outing_confirmed',
    trigger: 'day_outing_confirmed',
    triggerLabel: 'Day Outing Confirmed',
    icon: 'ri-sun-line',
    color: 'text-amber-500 bg-amber-50',
    subject: 'Your Day Outing at {{property_name}} is confirmed ☀️',
    body: `Hi {{guest_name}},

Your day outing booking at {{property_name}} has been confirmed!

📅 Date: {{outing_date}}
⏰ Time Slot: {{time_slot}}
👥 Guests: {{guest_count}}
🎉 Occasion: {{occasion}}
💰 Estimated Total: ₹{{total_amount}}

Please arrive 10 minutes before your scheduled time. Bring valid ID for entry.

We look forward to hosting you!
The Triprodeo Team`,
    enabled: true,
    recipientType: 'guest',
  },
  {
    id: 'new_host_booking',
    trigger: 'new_host_booking',
    triggerLabel: 'New Booking (Host Alert)',
    icon: 'ri-notification-3-line',
    color: 'text-stone-600 bg-stone-100',
    subject: 'New booking request for {{property_name}}',
    body: `Hi {{host_name}},

You have a new booking request for {{property_name}}!

👤 Guest: {{guest_name}}
📧 Email: {{guest_email}}
📅 Check-in: {{check_in_date}}
📅 Check-out: {{check_out_date}}
👥 Guests: {{guest_count}}
💰 Amount: ₹{{total_amount}}

Please log in to your owner portal to review and confirm this booking within 24 hours.

👉 [Go to Owner Portal] (link)`,
    enabled: true,
    recipientType: 'host',
  },
];

const VARIABLE_HINTS = [
  { key: '{{guest_name}}', desc: 'Guest full name' },
  { key: '{{host_name}}', desc: 'Property owner name' },
  { key: '{{property_name}}', desc: 'Property name' },
  { key: '{{check_in_date}}', desc: 'Check-in date' },
  { key: '{{check_out_date}}', desc: 'Check-out date' },
  { key: '{{guest_count}}', desc: 'Number of guests' },
  { key: '{{total_amount}}', desc: 'Total booking amount' },
  { key: '{{outing_date}}', desc: 'Day outing date' },
  { key: '{{time_slot}}', desc: 'Day outing time slot' },
  { key: '{{occasion}}', desc: 'Occasion type' },
  { key: '{{guest_email}}', desc: 'Guest email address' },
];

export default function EmailNotificationsEditor() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState<string | null>(null);

  const updateTemplate = (id: string, patch: Partial<EmailTemplate>) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, ...patch } : t));
  };

  const handleSave = () => {
    setSaved(true);
    setEditing(null);
    setTimeout(() => setSaved(false), 2500);
  };

  const sendTestEmail = (templateId: string) => {
    setTestEmailSent(templateId);
    setTimeout(() => setTestEmailSent(null), 2500);
  };

  const insertVariable = (varKey: string) => {
    if (!editing) return;
    setEditing((prev) => prev ? { ...prev, body: prev.body + varKey } : null);
  };

  // Render body with fake variable substitution for preview
  const getPreviewBody = (body: string) => {
    return body
      .replace(/\{\{guest_name\}\}/g, 'Priya Mehta')
      .replace(/\{\{host_name\}\}/g, 'Rahul Sharma')
      .replace(/\{\{property_name\}\}/g, 'Serenity Villa Lonavala')
      .replace(/\{\{check_in_date\}\}/g, '20 Apr 2026')
      .replace(/\{\{check_out_date\}\}/g, '23 Apr 2026')
      .replace(/\{\{guest_count\}\}/g, '4')
      .replace(/\{\{total_amount\}\}/g, '42,000')
      .replace(/\{\{outing_date\}\}/g, '19 Apr 2026')
      .replace(/\{\{time_slot\}\}/g, 'Full Day (9AM–6PM)')
      .replace(/\{\{occasion\}\}/g, 'Birthday')
      .replace(/\{\{guest_email\}\}/g, 'priya.m@gmail.com');
  };

  if (editing) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditing(null)} className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 cursor-pointer">
            <i className="ri-arrow-left-line" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-stone-900">Edit Template</h2>
            <p className="text-xs text-stone-400 mt-0.5">Trigger: {editing.triggerLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap transition-colors border ${previewMode ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}
            >
              <i className={previewMode ? 'ri-edit-line' : 'ri-eye-line'} />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
              <i className="ri-save-line" /> Save Template
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
              {/* Enable toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-800">Enable this template</p>
                  <p className="text-xs text-stone-400">Emails will auto-send when this trigger fires</p>
                </div>
                <button
                  onClick={() => setEditing((prev) => prev ? { ...prev, enabled: !prev.enabled } : null)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${editing.enabled ? 'bg-emerald-500' : 'bg-stone-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${editing.enabled ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wider">Send To</label>
                <div className="flex gap-2 flex-wrap">
                  {(['guest', 'host', 'both'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setEditing((prev) => prev ? { ...prev, recipientType: r } : null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer whitespace-nowrap border transition-colors ${editing.recipientType === r ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}
                    >
                      {r === 'both' ? 'Guest + Owner' : r === 'guest' ? 'Guest only' : 'Owner only'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Email Subject</label>
                <input
                  value={editing.subject}
                  onChange={(e) => setEditing((prev) => prev ? { ...prev, subject: e.target.value } : null)}
                  disabled={previewMode}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-stone-400 disabled:bg-stone-50"
                />
                {previewMode && (
                  <p className="text-xs text-stone-400 mt-1 pl-1">Preview: {getPreviewBody(editing.subject)}</p>
                )}
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">Email Body</label>
                {previewMode ? (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                    {/* Email preview card */}
                    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden max-w-lg mx-auto">
                      <div className="bg-stone-900 px-6 py-4">
                        <p className="text-white font-bold text-sm">Triprodeo</p>
                        <p className="text-stone-400 text-xs mt-0.5">{getPreviewBody(editing.subject)}</p>
                      </div>
                      <div className="px-6 py-5">
                        <pre className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">{getPreviewBody(editing.body)}</pre>
                      </div>
                      <div className="bg-stone-50 px-6 py-3 border-t border-stone-100">
                        <p className="text-stone-400 text-xs text-center">© 2026 Triprodeo · Unsubscribe</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={editing.body}
                    onChange={(e) => { if (e.target.value.length <= 2000) setEditing((prev) => prev ? { ...prev, body: e.target.value } : null); }}
                    rows={14}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-700 outline-none focus:border-stone-400 resize-none font-mono"
                  />
                )}
                {!previewMode && (
                  <p className="text-right text-xs text-stone-300 mt-1">{editing.body.length}/2000</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: variable hints + test */}
          <div className="space-y-4">
            {/* Test send */}
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2"><i className="ri-test-tube-line text-stone-400" /> Test Email</h3>
              <p className="text-xs text-stone-400 mb-3">Send a preview with sample data to verify formatting</p>
              <button
                onClick={() => sendTestEmail(editing.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap transition-colors"
              >
                {testEmailSent === editing.id ? (
                  <><i className="ri-check-line text-emerald-500" /><span className="text-emerald-600">Test sent!</span></>
                ) : (
                  <><i className="ri-send-plane-line" /> Send Test Email</>
                )}
              </button>
            </div>

            {/* Variables */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <i className="ri-code-s-slash-line text-amber-500" /> Template Variables
              </h3>
              <p className="text-xs text-stone-500 mb-3">Click to insert at cursor position in body</p>
              <div className="space-y-1.5">
                {VARIABLE_HINTS.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => insertVariable(v.key)}
                    disabled={previewMode}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white border border-amber-100 rounded-lg text-left hover:border-amber-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="font-mono text-xs text-amber-700">{v.key}</span>
                    <span className="text-xs text-stone-400">{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Email Notifications</h1>
          <p className="text-stone-500 text-sm mt-1">Configure auto-send email templates triggered by booking status changes</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <i className="ri-check-line" /> All templates saved!
          </span>
        )}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6">
        <i className="ri-mail-settings-line text-stone-400 text-lg mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-stone-800 mb-0.5">How email notifications work</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            Each template below is automatically sent when a booking status changes. Use <code className="bg-stone-100 px-1 py-0.5 rounded text-xs font-mono">{'{{variable}}'}</code> syntax to insert dynamic booking data. Toggle any template off to disable that notification entirely.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">{templates.filter((t) => t.enabled).length}</p>
          <p className="text-xs text-stone-400 mt-1">Active Templates</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-stone-900">{templates.length}</p>
          <p className="text-xs text-stone-400 mt-1">Total Templates</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{templates.filter((t) => t.enabled && t.recipientType === 'both').length}</p>
          <p className="text-xs text-stone-400 mt-1">Dual Recipients</p>
        </div>
      </div>

      {/* Template list */}
      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.id} className={`bg-white rounded-xl border overflow-hidden transition-all ${t.enabled ? 'border-stone-200' : 'border-stone-100 opacity-60'}`}>
            <div className="flex items-center gap-4 p-4">
              {/* Icon */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${t.color}`}>
                <i className={`${t.icon} text-base`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="font-semibold text-stone-900 text-sm">{t.triggerLabel}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {t.enabled ? 'Active' : 'Disabled'}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                    {t.recipientType === 'both' ? 'Guest + Owner' : t.recipientType === 'guest' ? 'Guest' : 'Owner'}
                  </span>
                </div>
                <p className="text-xs text-stone-400 truncate">{t.subject}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Toggle enable */}
                <button
                  onClick={() => updateTemplate(t.id, { enabled: !t.enabled })}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${t.enabled ? 'bg-emerald-500' : 'bg-stone-200'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${t.enabled ? 'left-5' : 'left-0.5'}`} />
                </button>

                {/* Test button */}
                <button
                  onClick={() => sendTestEmail(t.id)}
                  className="w-8 h-8 flex items-center justify-center bg-stone-50 border border-stone-200 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 cursor-pointer transition-colors"
                  title="Send test email"
                >
                  {testEmailSent === t.id ? (
                    <i className="ri-check-line text-emerald-500" />
                  ) : (
                    <i className="ri-send-plane-line text-xs" />
                  )}
                </button>

                {/* Edit */}
                <button
                  onClick={() => setEditing(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200 cursor-pointer whitespace-nowrap transition-colors"
                >
                  <i className="ri-edit-line text-xs" /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
