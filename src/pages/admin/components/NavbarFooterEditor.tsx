import { useState } from 'react';
import { CMSNavbarContent, CMSFooterContent } from '../types';

interface NavbarFooterEditorProps {
  navbarData: CMSNavbarContent;
  footerData: CMSFooterContent;
  onSaveNavbar: (data: CMSNavbarContent) => void;
  onSaveFooter: (data: CMSFooterContent) => void;
  section: 'navbar' | 'footer';
}

export default function NavbarFooterEditor({ navbarData, footerData, onSaveNavbar, onSaveFooter, section }: NavbarFooterEditorProps) {
  const [navbar, setNavbar] = useState<CMSNavbarContent>(JSON.parse(JSON.stringify(navbarData)));
  const [footer, setFooter] = useState<CMSFooterContent>(JSON.parse(JSON.stringify(footerData)));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveNavbar(navbar);
    onSaveFooter(footer);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateLink = (index: number, field: 'label' | 'href', val: string) => {
    const links = [...navbar.links];
    links[index] = { ...links[index], [field]: val };
    setNavbar({ ...navbar, links });
  };

  const addLink = () => setNavbar({ ...navbar, links: [...navbar.links, { label: '', href: '/' }] });
  const removeLink = (index: number) => setNavbar({ ...navbar, links: navbar.links.filter((_, i) => i !== index) });

  const updateSocial = (index: number, field: string, val: string) => {
    const socialLinks = [...footer.socialLinks];
    socialLinks[index] = { ...socialLinks[index], [field]: val };
    setFooter({ ...footer, socialLinks });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {section === 'navbar' ? 'Navigation' : 'Footer'}
          </h2>
          <p className="text-stone-500 text-sm">Edit site-wide navigation and footer content.</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
          <i className={saved ? 'ri-check-line' : 'ri-save-line'} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">
        {/* Navbar */}
        <div className="bg-white rounded-xl border border-stone-100 p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Logo URL</h3>
          <input type="text" value={navbar.logoUrl} onChange={(e) => setNavbar({ ...navbar, logoUrl: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="https://..." />
          {navbar.logoUrl && <img src={navbar.logoUrl} alt="Logo preview" className="mt-3 h-10 object-contain" />}
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-700">Navigation Links</h3>
            <button onClick={addLink} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-add-line" />Add Link
            </button>
          </div>
          <div className="space-y-3">
            {navbar.links.map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input type="text" value={link.label} onChange={(e) => updateLink(i, 'label', e.target.value)} placeholder="Label" className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  <input type="text" value={link.href} onChange={(e) => updateLink(i, 'href', e.target.value)} placeholder="/path" className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
                <button onClick={() => removeLink(i)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors cursor-pointer">
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-stone-700">Footer Content</h3>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Tagline</label>
            <input type="text" value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">About Text</label>
            <textarea value={footer.aboutText} onChange={(e) => setFooter({ ...footer, aboutText: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={3} maxLength={500} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Copyright Text</label>
            <input type="text" value={footer.copyrightText} onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Social Links</h3>
          <div className="space-y-3">
            {footer.socialLinks.map((social, i) => (
              <div key={i} className="grid grid-cols-3 gap-3">
                <input type="text" value={social.platform} onChange={(e) => updateSocial(i, 'platform', e.target.value)} placeholder="Platform" className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                <input type="text" value={social.url} onChange={(e) => updateSocial(i, 'url', e.target.value)} placeholder="URL" className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                <input type="text" value={social.icon} onChange={(e) => updateSocial(i, 'icon', e.target.value)} placeholder="ri-instagram-line" className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
