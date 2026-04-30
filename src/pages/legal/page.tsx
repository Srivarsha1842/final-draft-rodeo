import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

type LegalContent = {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

const CONTENT: Record<string, LegalContent> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    intro:
      'Triprodeo respects your privacy. This policy explains what information we collect, how we use it, and the choices you have.',
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'Account details (name, email, phone) you provide when signing up or booking.',
          'Booking information, including travel dates, guest counts, and payment confirmation metadata.',
          'Device and usage data such as IP address, browser type, and pages viewed, collected via standard analytics.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          'To confirm and manage your bookings and communicate about your trips.',
          'To improve our products, personalise recommendations, and prevent fraud.',
          'To send transactional emails and, with your consent, marketing updates.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can request access, correction, or deletion of your personal data by writing to support@triprodeo.com.',
          'You may opt out of marketing emails at any time using the unsubscribe link in every message.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro:
      'By accessing or booking on Triprodeo you agree to the following terms. Please read them carefully before using the platform.',
    sections: [
      {
        heading: 'Bookings and payments',
        body: [
          'All bookings are confirmed only after full or partial payment, as specified at checkout.',
          'Prices listed include applicable taxes unless otherwise stated.',
          'You are responsible for providing accurate guest details at the time of booking.',
        ],
      },
      {
        heading: 'User conduct',
        body: [
          'Do not use Triprodeo for any unlawful purpose or to infringe the rights of others.',
          'We reserve the right to suspend accounts that misuse the platform or violate host property rules.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'Triprodeo acts as an intermediary between you and the property. On-ground experience is delivered by the property operator.',
          'Our maximum liability for any booking-related dispute is limited to the booking value paid to us.',
        ],
      },
    ],
  },
  'cancellation-policy': {
    title: 'Cancellation Policy',
    intro:
      'Cancellation terms vary by property and package. The exact window is shown on the property page and in your booking confirmation.',
    sections: [
      {
        heading: 'Standard timeline',
        body: [
          'Cancellations 14+ days before check-in: full refund minus payment gateway charges.',
          'Cancellations 7–13 days before check-in: 50% refund.',
          'Cancellations within 7 days of check-in: non-refundable; dates may be shifted subject to availability.',
        ],
      },
      {
        heading: 'How to cancel',
        body: [
          'Go to My Bookings → select the booking → Cancel booking.',
          'Refunds are processed to the original payment method within 7–10 business days.',
        ],
      },
      {
        heading: 'Force majeure',
        body: [
          'In the event of natural calamities, government restrictions, or other force-majeure events, we work with properties to reschedule or refund at their discretion.',
        ],
      },
    ],
  },
  'copyright-policy': {
    title: 'Copyright Policy',
    intro:
      'All content on Triprodeo — including text, photographs, logos, and layout — is owned by Triprodeo or its licensors and is protected by copyright law.',
    sections: [
      {
        heading: 'Permitted use',
        body: [
          'You may browse and share links to Triprodeo pages for personal, non-commercial purposes.',
          'Partners and properties may use their own uploaded assets under the terms of their listing agreement.',
        ],
      },
      {
        heading: 'Reporting infringement',
        body: [
          'If you believe content on Triprodeo infringes your copyright, please email legal@triprodeo.com with the URL, a description of the original work, and proof of ownership.',
          'We review valid takedown requests within 7 business days.',
        ],
      },
    ],
  },
  'fraud-alert': {
    title: 'Fraud Alert & Safety Advisory',
    intro:
      'Your safety matters. Triprodeo will never ask you to share OTPs, bank passwords, or transfer money to personal accounts.',
    sections: [
      {
        heading: 'Common scams to avoid',
        body: [
          'Messages asking you to pay into a personal UPI handle or bank account to "unlock" a booking.',
          'Calls claiming to be from Triprodeo support asking for your card CVV or OTP.',
          'Unofficial WhatsApp numbers offering deep discounts outside the platform.',
        ],
      },
      {
        heading: 'Safe booking checklist',
        body: [
          'Always pay through the Triprodeo website or app — never off-platform.',
          'Verify confirmation emails come from @triprodeo.com.',
          'Report suspicious activity to support@triprodeo.com immediately.',
        ],
      },
    ],
  },
};

export default function LegalPage() {
  const { slug = '' } = useParams();
  const content = CONTENT[slug];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-16">
        {content ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">{content.title}</h1>
            <p className="text-stone-600 mb-10 leading-relaxed">{content.intro}</p>
            {content.sections.map((section) => (
              <section key={section.heading} className="mb-10">
                <h2 className="text-xl font-semibold text-stone-900 mb-3">{section.heading}</h2>
                <ul className="list-disc pl-5 space-y-2 text-stone-700 text-sm leading-relaxed">
                  {section.body.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-xs text-stone-500 mt-12">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}.
              For questions, contact{' '}
              <a href="mailto:support@triprodeo.com" className="underline">
                support@triprodeo.com
              </a>
              .
            </p>
          </>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Policy not found</h1>
            <p className="text-stone-600 mb-6">The legal page you’re looking for doesn’t exist.</p>
            <Link to="/" className="text-emerald-600 underline">
              Go back home
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
