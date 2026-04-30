export default function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-2">
      <a href="https://wa.me/917353735364" target="_blank" rel="noopener noreferrer" className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg" aria-label="WhatsApp">
        <i className="ri-whatsapp-line text-xl" />
      </a>
      <a href="/ai-planner" className="hidden md:flex w-12 h-12 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg" aria-label="Chatbot">
        <i className="ri-chat-3-line text-xl" />
      </a>
      <a href="tel:+917353735364" className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-stone-900 border border-stone-200 shadow-lg" aria-label="Call">
        <i className="ri-phone-line text-xl" />
      </a>
      <a href="/support" className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-400 text-stone-900 shadow-lg" aria-label="Enquiry form">
        <i className="ri-file-list-3-line text-xl" />
      </a>
    </div>
  );
}
