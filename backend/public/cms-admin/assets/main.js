/* ═══════════════════════════════════════════════════════════
   TRIPRODEO CMS ADMIN — main.js
   Full SEO + AEO + GEO + AIO + SXO management
   ═══════════════════════════════════════════════════════════ */

const API = '/api';
let TOKEN = localStorage.getItem('cms_token') || '';
let currentPage = null; // page being edited

/* ─── API Helper ─────────────────────────────────────────── */
async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data.data;
}

/* ─── Toast ──────────────────────────────────────────────── */
let toastEl = null;
function toast(msg, type = 'success') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast-container';
    document.body.appendChild(toastEl);
  }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  toastEl.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ─── Auth ───────────────────────────────────────────────── */
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Signing in…';
  try {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const data = await api('/auth/admin/login', { method: 'POST', body: { email, password } });
    TOKEN = data.accessToken;
    localStorage.setItem('cms_token', TOKEN);
    showApp();
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  TOKEN = '';
  localStorage.removeItem('cms_token');
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
});

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  navigateTo('dashboard');
}

if (TOKEN) {
  api('/auth/me').then(() => showApp()).catch(() => { TOKEN = ''; localStorage.removeItem('cms_token'); });
}

/* ─── Navigation ─────────────────────────────────────────── */
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', () => navigateTo(el.dataset.view));
});

/* ─── Mobile sidebar drawer ──────────────────────────────── */
(function () {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const openSidebar = () => { sidebar && sidebar.classList.add('open'); backdrop && backdrop.classList.add('show'); };
  const closeSidebar = () => { sidebar && sidebar.classList.remove('open'); backdrop && backdrop.classList.remove('show'); };
  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
  // Auto-close sidebar after nav tap on mobile
  document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 768px)').matches) closeSidebar();
  }));
})();

function navigateTo(view) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById(`view-${view}`);
  if (el) el.classList.remove('hidden');
  switch (view) {
    case 'dashboard': renderDashboard(); break;
    case 'pages': renderPages(); break;
    case 'blog': renderBlog(); break;
    case 'experiences': renderExperiences(); break;
    case 'destinations': renderDestinations(); break;
    case 'settings': renderSettings(); break;
    case 'hosts': renderHosts(); break;
    case 'bookings': renderBookings(); break;
    case 'revenue': renderRevenue(); break;
    case 'sitemap': renderSitemap(); break;
  }
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════ */
async function renderDashboard() {
  const el = document.getElementById('view-dashboard');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Dashboard</h1><p class="page-subtitle">Overview of Triprodeo platform</p></div></div><div class="stats-grid" id="dash-stats"><div class="stat-card"><div class="stat-label">Loading…</div></div></div>`;
  try {
    const rev = await api('/cms/revenue');
    document.getElementById('dash-stats').innerHTML = `
      ${statCard('💰', 'Platform Revenue', '₹' + num(rev.totalRevenue), 'All time')}
      ${statCard('📅', 'Total Bookings', num(rev.totalBookings), 'All time')}
      ${statCard('🏠', 'Active Properties', num(rev.totalProperties), 'Listed')}
      ${statCard('👥', 'Total Hosts', num(rev.totalHosts), 'Registered')}
    `;
  } catch { el.querySelector('#dash-stats').innerHTML = statCard('⚠️', 'Error', 'Could not load', ''); }
}

function statCard(icon, label, value, sub) {
  return `<div class="stat-card"><div class="stat-label">${icon} ${label}</div><div class="stat-value">${value}</div><div class="stat-sub">${sub}</div></div>`;
}

/* ═══════════════════════════════════════════════════════════
   PAGES (CMS + SEO)
   ═══════════════════════════════════════════════════════════ */
async function renderPages() {
  const el = document.getElementById('view-pages');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Pages</h1><p class="page-subtitle">Manage content & full SEO for every page</p></div><button class="btn btn-primary" onclick="openPageEditor(null)">+ New Page</button></div><div class="table-wrap" id="pages-table"><p style="padding:2rem;color:var(--text-muted)">Loading…</p></div>`;
  try {
    const pages = await api('/cms/pages');
    if (!pages.length) { document.getElementById('pages-table').innerHTML = `<div class="empty-state"><div class="icon">📄</div><p>No pages yet. Create your first page.</p></div>`; return; }
    document.getElementById('pages-table').innerHTML = `<table><thead><tr><th>Name</th><th>Slug</th><th>Status</th><th>SEO Title</th><th>Updated</th><th>Actions</th></tr></thead><tbody>${pages.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td><code>/${p.slug}</code></td>
        <td>${badge(p.status)}</td>
        <td class="text-muted text-sm">${p.seoTitle || '<em>Not set</em>'}</td>
        <td class="text-muted text-sm">${fmtDate(p.updatedAt)}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-ghost btn-sm" onclick="openPageEditor('${p.id}')">Edit</button>
            ${p.status === 'PUBLISHED'
              ? `<button class="btn btn-warning btn-sm" onclick="unpublishPage('${p.id}')">Unpublish</button>`
              : `<button class="btn btn-success btn-sm" onclick="publishPage('${p.id}')">Publish</button>`}
            <button class="btn btn-danger btn-sm" onclick="deletePage('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>`).join('')}</tbody></table>`;
  } catch (err) { toast(err.message, 'error'); }
}

async function publishPage(id) {
  try { await api(`/cms/pages/${id}/publish`, { method: 'POST' }); toast('Page published!'); renderPages(); }
  catch (err) { toast(err.message, 'error'); }
}
async function unpublishPage(id) {
  try { await api(`/cms/pages/${id}/unpublish`, { method: 'POST' }); toast('Page unpublished'); renderPages(); }
  catch (err) { toast(err.message, 'error'); }
}
async function deletePage(id) {
  if (!confirm('Archive this page?')) return;
  try { await api(`/cms/pages/${id}`, { method: 'DELETE' }); toast('Page archived'); renderPages(); }
  catch (err) { toast(err.message, 'error'); }
}

/* ═══════════════════════════════════════════════════════════
   BLOG — filtered Pages view (slug prefix `blog/`)
   Reuses the Pages editor + /cms/pages endpoints.
   ═══════════════════════════════════════════════════════════ */
async function renderBlog() {
  const el = document.getElementById('view-blog');
  el.innerHTML = `<div class="page-header">
      <div><h1 class="page-title">Blog</h1><p class="page-subtitle">Write, optimise &amp; publish articles — full SEO · AEO · GEO · AIO · SXO</p></div>
      <button class="btn btn-primary" onclick="newBlogPost()">+ New Blog Post</button>
    </div>
    <div class="table-wrap" id="blog-table"><p style="padding:2rem;color:var(--text-muted)">Loading…</p></div>`;
  try {
    const pages = await api('/cms/pages');
    const posts = pages.filter(p => (p.slug || '').startsWith('blog/'));
    if (!posts.length) {
      document.getElementById('blog-table').innerHTML = `<div class="empty-state"><div class="icon">✍️</div><p>No blog posts yet. Click <strong>+ New Blog Post</strong> to write your first article.</p></div>`;
      return;
    }
    document.getElementById('blog-table').innerHTML = `<table><thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>SEO Title</th><th>Updated</th><th>Actions</th></tr></thead><tbody>${posts.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td><code>/${p.slug}</code></td>
        <td>${badge(p.status)}</td>
        <td class="text-muted text-sm">${p.seoTitle || '<em>Not set</em>'}</td>
        <td class="text-muted text-sm">${fmtDate(p.updatedAt)}</td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-ghost btn-sm" onclick="openPageEditor('${p.id}')">Edit</button>
            ${p.status === 'PUBLISHED'
              ? `<button class="btn btn-warning btn-sm" onclick="unpublishPage('${p.id}').then(renderBlog)">Unpublish</button>`
              : `<button class="btn btn-success btn-sm" onclick="publishPage('${p.id}').then(renderBlog)">Publish</button>`}
            <button class="btn btn-danger btn-sm" onclick="deletePage('${p.id}').then(renderBlog)">Delete</button>
          </div>
        </td>
      </tr>`).join('')}</tbody></table>`;
  } catch (err) { toast(err.message, 'error'); }
}

function newBlogPost() {
  openPageEditor(null, {
    slug: 'blog/',
    contentType: 'article',
    ogType: 'article',
    priority: 0.7,
    changefreq: 'monthly',
  });
}

/* ═══════════════════════════════════════════════════════════
   PAGE EDITOR — full SEO / AEO / GEO / AIO / SXO
   (reused for both regular pages and blog posts)
   ═══════════════════════════════════════════════════════════ */
async function openPageEditor(id, prefill) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById('view-page-editor');
  el.classList.remove('hidden');

  let page = {
    name: '', slug: '', content: {}, status: 'DRAFT',
    seoTitle: '', seoDescription: '', seoKeywords: [], canonicalUrl: '', robots: 'index, follow',
    ogTitle: '', ogDescription: '', ogImage: '', ogImageAlt: '', ogType: 'website', ogLocale: 'en_IN',
    twitterCard: 'summary_large_image', twitterTitle: '', twitterDescription: '', twitterImage: '',
    twitterSite: '', twitterCreator: '',
    geoLatitude: '', geoLongitude: '', geoRegion: '', geoCountry: 'IN', geoPlaceName: '',
    entityName: '', entityType: 'Organization', entitySameAs: [],
    faqItems: [], howToSteps: [], speakableSelectors: [], definedTerms: [],
    topicClusters: [], pillarContent: false, contentSummary: '', keyFacts: [], targetQuestions: [],
    breadcrumbs: [], internalLinks: [], relatedPages: [], cta: null,
    readingTimeMin: '', contentType: 'guide',
    hreflangTags: [], customMeta: [], schemaOrg: null,
    priority: 0.8, changefreq: 'weekly',
    ...(prefill || {}),
  };

  if (id) {
    try { page = { ...page, ...(await api(`/cms/pages/${id}`)) }; } catch (err) { toast(err.message, 'error'); return; }
  }
  currentPage = page;

  const isBlog = (page.slug || '').startsWith('blog/') || (prefill && (prefill.slug || '').startsWith('blog/'));
  const parentView = isBlog ? 'blog' : 'pages';
  const parentLabel = isBlog ? 'Blog' : 'Pages';
  const kindLabel = isBlog ? 'Blog Post' : 'Page';

  el.innerHTML = `
  <div class="breadcrumb"><a onclick="navigateTo('${parentView}')">${parentLabel}</a> › ${id ? page.name : 'New ' + kindLabel}</div>
  <div class="flex justify-between items-center mb-2">
    <div><h1 class="page-title">${id ? 'Edit ' + kindLabel : 'New ' + kindLabel}</h1><p class="page-subtitle">Manage content, SEO, AEO, GEO, AIO &amp; SXO settings</p></div>
    <div class="flex gap-1">
      <button class="btn btn-ghost" onclick="navigateTo('${parentView}')">Cancel</button>
      <button class="btn btn-primary" id="save-page-btn" onclick="savePage('${id || ''}')">Save</button>
      ${id ? `<button class="btn btn-success" onclick="publishPage('${id}')">Publish</button>` : ''}
    </div>
  </div>

  <!-- SEO Score -->
  <div id="seo-score-bar"></div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab-btn active" data-tab="general">General</button>
    <button class="tab-btn" data-tab="seo">🔍 SEO Core</button>
    <button class="tab-btn" data-tab="social">📱 Social Cards</button>
    <button class="tab-btn" data-tab="schema">🏗️ Schema.org</button>
    <button class="tab-btn" data-tab="aeo">🤖 AEO</button>
    <button class="tab-btn" data-tab="geo">🌍 GEO</button>
    <button class="tab-btn" data-tab="aio">⚡ AIO</button>
    <button class="tab-btn" data-tab="sxo">✨ SXO</button>
    <button class="tab-btn" data-tab="preview">👁️ Preview</button>
  </div>

  <!-- GENERAL -->
  <div class="tab-panel active" data-panel="general">
    <div class="card">
      <div class="form-grid">
        <label>Page Name <input id="f-name" value="${esc(page.name)}" oninput="updateSeoScore()" /></label>
        <label>Slug (URL path) <input id="f-slug" value="${esc(page.slug)}" placeholder="e.g. about-us" /></label>
        <label class="form-full">Content (JSON) <textarea id="f-content" rows="6">${esc(JSON.stringify(page.content || {}, null, 2))}</textarea></label>
        <label>Status
          <select id="f-status">
            ${['DRAFT','PUBLISHED','ARCHIVED'].map(s => `<option value="${s}" ${page.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </label>
        <label>Content Type
          <select id="f-contentType">
            ${['guide','listing','faq','article','landing','product'].map(s => `<option value="${s}" ${(page.contentType||'guide')===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </label>
        <label>Reading Time (min) <input type="number" id="f-readingTimeMin" value="${page.readingTimeMin||''}" min="1" /></label>
      </div>
    </div>
  </div>

  <!-- SEO CORE -->
  <div class="tab-panel" data-panel="seo">
    <div class="card mb-2">
      <div class="card-header"><div class="card-title">🔍 SEO Core</div><span class="text-xs text-muted">Google search result preview updates live</span></div>
      <div class="seo-preview" id="seo-preview-google">
        <div class="seo-preview-url" id="prev-url">https://triprodeo.com/page-slug</div>
        <div class="seo-preview-title" id="prev-title">Page Title | Triprodeo</div>
        <div class="seo-preview-desc" id="prev-desc">Meta description will appear here...</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Core Meta Tags</div>
        <div class="form-grid">
          <label class="form-full">SEO Title (50–60 chars)
            <input id="f-seoTitle" value="${esc(page.seoTitle||'')}" maxlength="80" oninput="updateSeoPreview(); updateSeoScore()" />
            <div class="char-counter" id="cc-title">${(page.seoTitle||'').length}/60</div>
          </label>
          <label class="form-full">Meta Description (120–160 chars)
            <textarea id="f-seoDescription" rows="3" maxlength="320" oninput="updateSeoPreview(); updateSeoScore()">${esc(page.seoDescription||'')}</textarea>
            <div class="char-counter" id="cc-desc">${(page.seoDescription||'').length}/160</div>
          </label>
          <label class="form-full">Keywords (press Enter to add)
            <div class="tag-input-wrap" id="keywords-wrap"></div>
          </label>
          <label>Canonical URL <input id="f-canonicalUrl" value="${esc(page.canonicalUrl||'')}" placeholder="https://triprodeo.com/page" oninput="updateSeoPreview()" /></label>
          <label>Robots
            <select id="f-robots">
              ${['index, follow','noindex, nofollow','index, nofollow','noindex, follow'].map(r=>`<option value="${r}" ${page.robots===r?'selected':''}>${r}</option>`).join('')}
            </select>
          </label>
          <label>Sitemap Priority (0–1) <input type="number" id="f-priority" value="${page.priority||0.8}" min="0" max="1" step="0.1" /></label>
          <label>Change Frequency
            <select id="f-changefreq">
              ${['always','hourly','daily','weekly','monthly','yearly','never'].map(f=>`<option value="${f}" ${(page.changefreq||'weekly')===f?'selected':''}>${f}</option>`).join('')}
            </select>
          </label>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">hreflang (Multilingual / International)</div>
        <div id="hreflang-list" class="faq-list"></div>
        <button class="btn btn-ghost btn-sm mt-1" onclick="addHreflang()">+ Add Language</button>
      </div>
      <div class="form-section">
        <div class="form-section-title">Custom Meta Tags</div>
        <div id="custom-meta-list" class="faq-list"></div>
        <button class="btn btn-ghost btn-sm mt-1" onclick="addCustomMeta()">+ Add Meta Tag</button>
      </div>
    </div>
  </div>

  <!-- SOCIAL CARDS -->
  <div class="tab-panel" data-panel="social">
    <div class="card mb-2">
      <div class="card-header"><div class="card-title">📱 Open Graph (Facebook, LinkedIn, WhatsApp)</div></div>
      <div class="grid-2" style="gap:1.5rem;align-items:start">
        <div>
          <div class="form-grid">
            <label class="form-full">OG Title <input id="f-ogTitle" value="${esc(page.ogTitle||'')}" oninput="updateSocialPreview()" /></label>
            <label class="form-full">OG Description <textarea id="f-ogDescription" rows="2" oninput="updateSocialPreview()">${esc(page.ogDescription||'')}</textarea></label>
            <label class="form-full">OG Image URL <input id="f-ogImage" value="${esc(page.ogImage||'')}" placeholder="https://..." oninput="updateSocialPreview()" /></label>
            <label>OG Image Alt <input id="f-ogImageAlt" value="${esc(page.ogImageAlt||'')}" /></label>
            <label>OG Type <select id="f-ogType">${['website','article','product','place'].map(t=>`<option value="${t}" ${(page.ogType||'website')===t?'selected':''}>${t}</option>`).join('')}</select></label>
            <label>OG Locale <input id="f-ogLocale" value="${esc(page.ogLocale||'en_IN')}" placeholder="en_IN" /></label>
          </div>
        </div>
        <div>
          <p class="text-sm font-bold mb-2">Preview</p>
          <div class="social-card" id="og-preview">
            <div class="social-card-img" id="og-img-wrap"><span>No image</span></div>
            <div class="social-card-body">
              <div class="social-card-site">triprodeo.com</div>
              <div class="social-card-title" id="og-prev-title">${esc(page.ogTitle||page.seoTitle||'Page Title')}</div>
              <div class="social-card-desc" id="og-prev-desc">${esc(page.ogDescription||page.seoDescription||'Description…')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🐦 Twitter Card</div></div>
      <div class="form-grid">
        <label>Card Type <select id="f-twitterCard">${['summary_large_image','summary','app','player'].map(t=>`<option value="${t}" ${(page.twitterCard||'summary_large_image')===t?'selected':''}>${t}</option>`).join('')}</select></label>
        <label>Twitter Site (e.g. @triprodeo) <input id="f-twitterSite" value="${esc(page.twitterSite||'')}" /></label>
        <label>Twitter Creator <input id="f-twitterCreator" value="${esc(page.twitterCreator||'')}" /></label>
        <label>Twitter Title <input id="f-twitterTitle" value="${esc(page.twitterTitle||'')}" /></label>
        <label class="form-full">Twitter Description <textarea id="f-twitterDescription" rows="2">${esc(page.twitterDescription||'')}</textarea></label>
        <label class="form-full">Twitter Image URL <input id="f-twitterImage" value="${esc(page.twitterImage||'')}" placeholder="https://..." /></label>
      </div>
    </div>
  </div>

  <!-- SCHEMA.ORG -->
  <div class="tab-panel" data-panel="schema">
    <div class="card mb-2">
      <div class="card-header"><div class="card-title">🏗️ Schema.org (JSON-LD)</div><span class="text-xs text-muted">Auto-generated + custom overrides</span></div>
      <p class="text-sm text-muted mb-2">Auto-generated schemas based on your page settings. The following are always injected: Organization, WebSite. Additional schemas are built from FAQ, HowTo, Breadcrumbs, and Speakable settings.</p>
      <div class="form-section">
        <div class="form-section-title">Custom Schema Override (JSON-LD array)</div>
        <textarea id="f-schemaOrg" rows="12" style="font-family:monospace;font-size:.8rem">${esc(page.schemaOrg ? JSON.stringify(page.schemaOrg, null, 2) : '')}</textarea>
        <div class="input-hint">Paste a JSON array of additional schema.org objects. Leave blank to use auto-generated schemas only.</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Schema Preview (Auto-generated)</div>
        <button class="btn btn-ghost btn-sm mb-2" onclick="previewSchema()">Generate Preview</button>
        <div class="code-block" id="schema-preview-code">Click "Generate Preview" to see the full JSON-LD output</div>
      </div>
    </div>
  </div>

  <!-- AEO -->
  <div class="tab-panel" data-panel="aeo">
    <div class="card mb-2">
      <div class="card-header">
        <div><div class="card-title">🤖 AEO — Answer Engine Optimization</div><div class="card-subtitle">Optimize for AI answer engines: Perplexity, ChatGPT, Google AI Overview, Bing Copilot</div></div>
      </div>
      <div class="form-section">
        <div class="form-section-title">FAQ Schema (FAQPage — directly feeds Google AIO &amp; Perplexity)</div>
        <div class="faq-list" id="faq-list"></div>
        <button class="btn btn-ghost btn-sm mt-1" onclick="addFaq()">+ Add Q&amp;A</button>
      </div>
      <div class="form-section">
        <div class="form-section-title">HowTo Schema (Step-by-step — triggers rich results)</div>
        <div class="faq-list" id="howto-list"></div>
        <button class="btn btn-ghost btn-sm mt-1" onclick="addHowToStep()">+ Add Step</button>
      </div>
      <div class="form-section">
        <div class="form-section-title">Speakable CSS Selectors (Voice Search — Google Home, Alexa)</div>
        <div class="tag-input-wrap" id="speakable-wrap"></div>
        <div class="input-hint">Add CSS selectors for content that should be read aloud. e.g. <code>.hero-title</code>, <code>#faq-section</code></div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Questions This Page Answers (AEO signal)</div>
        <div class="tag-input-wrap" id="targetquestions-wrap"></div>
        <div class="input-hint">Natural language questions your page answers — used by AI to match queries</div>
      </div>
    </div>
  </div>

  <!-- GEO -->
  <div class="tab-panel" data-panel="geo">
    <div class="card mb-2">
      <div class="card-header">
        <div><div class="card-title">🌍 GEO — Geographic &amp; Generative Engine Optimization</div><div class="card-subtitle">Geo meta tags + entity markup for Google Knowledge Graph, AI models &amp; local search</div></div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Geographic Meta Tags</div>
        <div class="form-grid col-3">
          <label>Latitude <input type="number" id="f-geoLatitude" value="${page.geoLatitude||''}" placeholder="e.g. 18.9220" step="any" /></label>
          <label>Longitude <input type="number" id="f-geoLongitude" value="${page.geoLongitude||''}" placeholder="e.g. 72.8347" step="any" /></label>
          <label>Country Code <input id="f-geoCountry" value="${esc(page.geoCountry||'IN')}" placeholder="IN" maxlength="2" /></label>
          <label>Region (ISO) <input id="f-geoRegion" value="${esc(page.geoRegion||'')}" placeholder="e.g. IN-MH" /></label>
          <label class="form-full">Place Name <input id="f-geoPlaceName" value="${esc(page.geoPlaceName||'')}" placeholder="e.g. Mumbai, Maharashtra, India" /></label>
        </div>
        <div class="input-hint">Generates: &lt;meta name="geo.position"&gt;, &lt;meta name="ICBM"&gt;, &lt;meta name="geo.region"&gt;, &lt;meta name="geo.placename"&gt;</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Entity Markup (Knowledge Graph / GEO)</div>
        <div class="form-grid">
          <label>Entity Name <input id="f-entityName" value="${esc(page.entityName||'')}" placeholder="e.g. Triprodeo" /></label>
          <label>Entity Type <select id="f-entityType">${['Organization','LocalBusiness','LodgingBusiness','TouristAttraction','Place','Product','Person','Event'].map(t=>`<option value="${t}" ${(page.entityType||'Organization')===t?'selected':''}>${t}</option>`).join('')}</select></label>
          <label class="form-full">SameAs URLs (Wikidata, DBpedia — press Enter)
            <div class="tag-input-wrap" id="sameas-wrap"></div>
            <div class="input-hint">Links to authoritative sources — helps AI models resolve your entity</div>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- AIO -->
  <div class="tab-panel" data-panel="aio">
    <div class="card mb-2">
      <div class="card-header">
        <div><div class="card-title">⚡ AIO — AI Overview Optimization</div><div class="card-subtitle">Optimize for Google AI Overviews, Bing Copilot, and AI-generated summaries</div></div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Topic Clusters (Topical Authority)</div>
        <div class="tag-input-wrap" id="topicclusters-wrap"></div>
        <div class="input-hint">Keywords that cluster around this page's topic. AI uses these to understand topical depth &amp; authority.</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">AI-Readable Content Summary</div>
        <textarea id="f-contentSummary" rows="5" placeholder="Write a clear, factual summary of this page for AI extraction. Use simple sentences. State the most important facts first.">${esc(page.contentSummary||'')}</textarea>
        <div class="input-hint">This maps to &lt;meta name="description:ai"&gt; — consumed by AI crawlers (GPTBot, ClaudeBot, PerplexityBot)</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Key Facts (structured for AI extraction)</div>
        <div class="faq-list" id="keyfacts-list"></div>
        <button class="btn btn-ghost btn-sm mt-1" onclick="addKeyFact()">+ Add Fact</button>
        <div class="input-hint mt-1">Label–value pairs AI models extract for knowledge base entries</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Pillar Content</div>
        <label style="flex-direction:row;align-items:center;gap:.5rem">
          <input type="checkbox" id="f-pillarContent" ${page.pillarContent?'checked':''} style="width:auto" />
          <span>Mark as Pillar Content (cornerstone page for this topic cluster)</span>
        </label>
      </div>
    </div>
  </div>

  <!-- SXO -->
  <div class="tab-panel" data-panel="sxo">
    <div class="card mb-2">
      <div class="card-header">
        <div><div class="card-title">✨ SXO — Search Experience Optimization</div><div class="card-subtitle">Combines SEO + UX signals: breadcrumbs, internal links, CTAs &amp; related content</div></div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Breadcrumbs (BreadcrumbList Schema)</div>
        <div class="faq-list" id="breadcrumb-list"></div>
        <button class="btn btn-ghost btn-sm mt-1" onclick="addBreadcrumb()">+ Add Breadcrumb</button>
      </div>
      <div class="form-section">
        <div class="form-section-title">Call to Action</div>
        <div class="form-grid">
          <label>CTA Text <input id="f-ctaText" value="${esc((page.cta && page.cta.text)||'')}" placeholder="Book Now" /></label>
          <label>CTA URL <input id="f-ctaUrl" value="${esc((page.cta && page.cta.url)||'')}" placeholder="/search" /></label>
          <label>CTA Type <select id="f-ctaType"><option value="primary">Primary</option><option value="secondary">Secondary</option></select></label>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Internal Links (SXO signal)</div>
        <div class="faq-list" id="internallinks-list"></div>
        <button class="btn btn-ghost btn-sm mt-1" onclick="addInternalLink()">+ Add Internal Link</button>
        <div class="input-hint mt-1">Contextual internal links boost crawlability &amp; user engagement (both SXO &amp; SEO)</div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Related Pages (slugs)</div>
        <div class="tag-input-wrap" id="relatedpages-wrap"></div>
        <div class="input-hint">Slugs of related pages — used to build related content modules</div>
      </div>
    </div>
  </div>

  <!-- PREVIEW -->
  <div class="tab-panel" data-panel="preview">
    <div class="card">
      <div class="card-title mb-2">Complete HEAD Tag Output</div>
      <p class="text-sm text-muted mb-2">Save the page first, then generate the full &lt;head&gt; output with all meta tags, schema markup, and canonical.</p>
      <button class="btn btn-primary mb-2" onclick="generateHeadPreview('${id||''}')">Generate Full HEAD</button>
      <div class="code-block" id="head-preview-code">Save page and click "Generate Full HEAD"</div>
    </div>
  </div>`;

  // Init dynamic components
  initTagInput('keywords-wrap', page.seoKeywords || [], 'f-keywords');
  initTagInput('speakable-wrap', page.speakableSelectors || [], 'f-speakable');
  initTagInput('targetquestions-wrap', page.targetQuestions || [], 'f-targetquestions');
  initTagInput('topicclusters-wrap', page.topicClusters || [], 'f-topicclusters');
  initTagInput('sameas-wrap', page.entitySameAs || [], 'f-sameas');
  initTagInput('relatedpages-wrap', page.relatedPages || [], 'f-relatedpages');

  renderFaqList(page.faqItems || []);
  renderHowToList(page.howToSteps || []);
  renderKeyFactsList(page.keyFacts || []);
  renderBreadcrumbList(page.breadcrumbs || []);
  renderHreflangList(page.hreflangTags || []);
  renderCustomMetaList(page.customMeta || []);
  renderInternalLinksList(page.internalLinks || []);

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });

  // Char counters
  ['seoTitle','seoDescription'].forEach(f => {
    const el = document.getElementById(`f-${f}`);
    const cc = document.getElementById(`cc-${f === 'seoTitle' ? 'title' : 'desc'}`);
    const max = f === 'seoTitle' ? 60 : 160;
    if (el && cc) el.addEventListener('input', () => {
      cc.textContent = `${el.value.length}/${max}`;
      cc.className = `char-counter ${el.value.length > max ? 'danger' : el.value.length > max * 0.9 ? 'warn' : ''}`;
    });
  });

  updateSeoPreview();
  updateSocialPreview();
  updateSeoScore();
}

/* ─── Save Page ───────────────────────────────────────────── */
async function savePage(id) {
  const btn = document.getElementById('save-page-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Saving…';

  // Parse JSON fields safely
  const parseJSON = (id, fallback) => {
    try { const v = document.getElementById(id)?.value; return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  };

  const data = {
    name: val('f-name'), slug: val('f-slug'),
    content: parseJSON('f-content', {}),
    status: val('f-status'), contentType: val('f-contentType'),
    readingTimeMin: intVal('f-readingTimeMin'),
    // SEO Core
    seoTitle: val('f-seoTitle'), seoDescription: val('f-seoDescription'),
    seoKeywords: getTagValues('keywords-wrap'),
    canonicalUrl: val('f-canonicalUrl'), robots: val('f-robots'),
    priority: floatVal('f-priority'), changefreq: val('f-changefreq'),
    // OG
    ogTitle: val('f-ogTitle'), ogDescription: val('f-ogDescription'),
    ogImage: val('f-ogImage'), ogImageAlt: val('f-ogImageAlt'),
    ogType: val('f-ogType'), ogLocale: val('f-ogLocale'),
    // Twitter
    twitterCard: val('f-twitterCard'), twitterTitle: val('f-twitterTitle'),
    twitterDescription: val('f-twitterDescription'), twitterImage: val('f-twitterImage'),
    twitterSite: val('f-twitterSite'), twitterCreator: val('f-twitterCreator'),
    // Schema
    schemaOrg: parseJSON('f-schemaOrg', null),
    // GEO
    geoLatitude: floatVal('f-geoLatitude'), geoLongitude: floatVal('f-geoLongitude'),
    geoCountry: val('f-geoCountry'), geoRegion: val('f-geoRegion'), geoPlaceName: val('f-geoPlaceName'),
    entityName: val('f-entityName'), entityType: val('f-entityType'),
    entitySameAs: getTagValues('sameas-wrap'),
    // AEO
    faqItems: getFaqItems(), howToSteps: getHowToSteps(),
    speakableSelectors: getTagValues('speakable-wrap'),
    targetQuestions: getTagValues('targetquestions-wrap'),
    // AIO
    topicClusters: getTagValues('topicclusters-wrap'),
    contentSummary: val('f-contentSummary'),
    keyFacts: getKeyFacts(),
    pillarContent: document.getElementById('f-pillarContent')?.checked || false,
    // SXO
    breadcrumbs: getBreadcrumbs(),
    internalLinks: getInternalLinks(),
    relatedPages: getTagValues('relatedpages-wrap'),
    cta: val('f-ctaText') ? { text: val('f-ctaText'), url: val('f-ctaUrl'), type: val('f-ctaType') } : null,
    hreflangTags: getHreflangTags(),
    customMeta: getCustomMeta(),
  };

  try {
    if (id) {
      await api(`/cms/pages/${id}`, { method: 'PATCH', body: data });
      toast('Page saved!');
    } else {
      const created = await api('/cms/pages', { method: 'POST', body: data });
      toast('Page created!');
      openPageEditor(created.id);
      return;
    }
    updateSeoScore();
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save';
  }
}

/* ─── SEO Preview ─────────────────────────────────────────── */
function updateSeoPreview() {
  const title = val('f-seoTitle') || val('f-name') || 'Page Title';
  const desc = val('f-seoDescription') || 'Meta description…';
  const slug = val('f-slug') || 'page-slug';
  const canon = val('f-canonicalUrl') || `https://triprodeo.com/${slug}`;
  const prevTitle = document.getElementById('prev-title');
  const prevDesc = document.getElementById('prev-desc');
  const prevUrl = document.getElementById('prev-url');
  if (prevTitle) prevTitle.textContent = title + ' | Triprodeo';
  if (prevDesc) prevDesc.textContent = desc;
  if (prevUrl) prevUrl.textContent = canon;
}

function updateSocialPreview() {
  const title = val('f-ogTitle') || val('f-seoTitle') || 'Page Title';
  const desc = val('f-ogDescription') || val('f-seoDescription') || 'Description…';
  const img = val('f-ogImage');
  const el = document.getElementById('og-prev-title');
  const de = document.getElementById('og-prev-desc');
  const ie = document.getElementById('og-img-wrap');
  if (el) el.textContent = title;
  if (de) de.textContent = desc;
  if (ie) ie.innerHTML = img ? `<img src="${img}" alt="OG" />` : '<span>No image set</span>';
}

/* ─── SEO Score ───────────────────────────────────────────── */
function updateSeoScore() {
  const checks = [
    { label: 'SEO Title', pass: (val('f-seoTitle')||'').length >= 30 && (val('f-seoTitle')||'').length <= 70 },
    { label: 'Meta Desc', pass: (val('f-seoDescription')||'').length >= 100 && (val('f-seoDescription')||'').length <= 160 },
    { label: 'Keywords', pass: getTagValues('keywords-wrap').length > 0 },
    { label: 'Canonical', pass: !!val('f-canonicalUrl') },
    { label: 'OG Image', pass: !!val('f-ogImage') },
    { label: 'OG Title', pass: !!val('f-ogTitle') },
    { label: 'Twitter Card', pass: !!val('f-twitterCard') },
    { label: 'FAQ Items', pass: getFaqItems().length > 0 },
    { label: 'Breadcrumbs', pass: getBreadcrumbs().length > 0 },
    { label: 'Topic Clusters', pass: getTagValues('topicclusters-wrap').length > 0 },
  ];
  const score = Math.round((checks.filter(c => c.pass).length / checks.length) * 100);
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const scoreEl = document.getElementById('seo-score-bar');
  if (!scoreEl) return;
  const r = 26, circ = 2 * Math.PI * r;
  const dash = ((100 - score) / 100) * circ;
  scoreEl.innerHTML = `<div class="seo-score">
    <div class="score-ring">
      <svg width="60" height="60"><circle cx="30" cy="30" r="${r}" stroke="#e2e8f0" stroke-width="6" fill="none"/><circle cx="30" cy="30" r="${r}" stroke="${color}" stroke-width="6" fill="none" stroke-dasharray="${circ}" stroke-dashoffset="${dash}" stroke-linecap="round"/></svg>
      <div class="score-text" style="color:${color}">${score}</div>
    </div>
    <div class="score-details">
      <div class="score-label">SEO Health Score</div>
      <div class="score-sub">${checks.filter(c=>c.pass).length}/${checks.length} checks passed</div>
      <div class="score-checks">${checks.map(c=>`<span class="score-check ${c.pass?'pass':'fail'}">${c.pass?'✓':'✗'} ${c.label}</span>`).join('')}</div>
    </div>
  </div>`;
}

/* ─── Schema Preview ──────────────────────────────────────── */
function previewSchema() {
  const faqs = getFaqItems();
  const schemas = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'Triprodeo', url: 'https://triprodeo.com' },
    { '@context': 'https://schema.org', '@type': 'WebSite', url: 'https://triprodeo.com', name: 'Triprodeo' },
  ];
  if (faqs.length) schemas.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
  const crumbs = getBreadcrumbs();
  if (crumbs.length) schemas.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) });
  const el = document.getElementById('schema-preview-code');
  if (el) el.textContent = JSON.stringify(schemas, null, 2);
}

/* ─── HEAD Preview ────────────────────────────────────────── */
async function generateHeadPreview(id) {
  if (!id) { toast('Save the page first', 'error'); return; }
  try {
    const data = await api(`/cms/pages/slug/${val('f-slug')}/head`);
    const el = document.getElementById('head-preview-code');
    if (el) el.textContent = JSON.stringify(data, null, 2);
  } catch (err) { toast(err.message, 'error'); }
}

/* ─── Tag Input ───────────────────────────────────────────── */
const tagData = {};
function initTagInput(wrapperId, initial, key) {
  tagData[key] = [...(initial || [])];
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  const render = () => {
    wrap.innerHTML = tagData[key].map((t, i) => `<span class="tag">${esc(t)}<span class="tag-remove" onclick="removeTag('${key}',${i})">×</span></span>`).join('') + `<input class="tag-input" placeholder="Type &amp; Enter" data-key="${key}" />`;
    wrap.querySelector('.tag-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const v = e.target.value.trim().replace(/,$/, '');
        if (v && !tagData[key].includes(v)) { tagData[key].push(v); render(); }
        else e.target.value = '';
      }
    });
  };
  render();
}
function removeTag(key, i) { tagData[key].splice(i, 1); /* re-render same wrap */ Object.keys(tagData).forEach(k => { if (k === key) { const el = document.querySelector(`[data-key="${k}"]`); if (el) el.closest('.tag-input-wrap').innerHTML = tagData[key].map((t, i) => `<span class="tag">${esc(t)}<span class="tag-remove" onclick="removeTag('${key}',${i})">×</span></span>`).join('') + `<input class="tag-input" placeholder="Type &amp; Enter" data-key="${key}" />`; } }); }
function getTagValues(wrapperId) {
  const wrap = document.getElementById(wrapperId);
  if (!wrap) return [];
  const key = wrap.querySelector('.tag-input')?.dataset.key;
  return key ? (tagData[key] || []) : [];
}

/* ─── FAQ Builder ─────────────────────────────────────────── */
let faqs = [];
function renderFaqList(items) { faqs = items || []; _renderFaqs(); }
function _renderFaqs() {
  const el = document.getElementById('faq-list'); if (!el) return;
  if (!faqs.length) { el.innerHTML = '<div class="text-muted text-sm">No FAQ items yet.</div>'; return; }
  el.innerHTML = faqs.map((f, i) => `<div class="faq-item"><div class="faq-item-header"><strong>Q${i+1}</strong><div class="faq-actions"><button class="btn btn-ghost btn-sm" onclick="removeFaq(${i})">Remove</button></div></div><label>Question <input value="${esc(f.question)}" oninput="faqs[${i}].question=this.value" /></label><label class="mt-1">Answer <textarea rows="2" oninput="faqs[${i}].answer=this.value">${esc(f.answer)}</textarea></label></div>`).join('');
}
function addFaq() { faqs.push({ question: '', answer: '' }); _renderFaqs(); }
function removeFaq(i) { faqs.splice(i, 1); _renderFaqs(); }
function getFaqItems() { return faqs; }

/* ─── HowTo Builder ───────────────────────────────────────── */
let howToSteps = [];
function renderHowToList(items) { howToSteps = items || []; _renderHowTo(); }
function _renderHowTo() {
  const el = document.getElementById('howto-list'); if (!el) return;
  if (!howToSteps.length) { el.innerHTML = '<div class="text-muted text-sm">No steps yet.</div>'; return; }
  el.innerHTML = howToSteps.map((s, i) => `<div class="faq-item"><div class="faq-item-header"><strong>Step ${i+1}</strong><button class="btn btn-ghost btn-sm" onclick="removeHowToStep(${i})">Remove</button></div><label>Name <input value="${esc(s.name||'')}" oninput="howToSteps[${i}].name=this.value" /></label><label class="mt-1">Instructions <textarea rows="2" oninput="howToSteps[${i}].text=this.value">${esc(s.text||'')}</textarea></label><label class="mt-1">Image URL (optional) <input value="${esc(s.image||'')}" oninput="howToSteps[${i}].image=this.value" /></label></div>`).join('');
}
function addHowToStep() { howToSteps.push({ name: '', text: '', image: '' }); _renderHowTo(); }
function removeHowToStep(i) { howToSteps.splice(i, 1); _renderHowTo(); }
function getHowToSteps() { return howToSteps; }

/* ─── Key Facts Builder ───────────────────────────────────── */
let keyFacts = [];
function renderKeyFactsList(items) { keyFacts = items || []; _renderKeyFacts(); }
function _renderKeyFacts() {
  const el = document.getElementById('keyfacts-list'); if (!el) return;
  if (!keyFacts.length) { el.innerHTML = '<div class="text-muted text-sm">No facts yet.</div>'; return; }
  el.innerHTML = keyFacts.map((f, i) => `<div class="faq-item"><div class="flex gap-2 items-center"><input placeholder="Label (e.g. Founded)" value="${esc(f.label||'')}" oninput="keyFacts[${i}].label=this.value" style="flex:1" /><input placeholder="Value (e.g. 2020)" value="${esc(f.value||'')}" oninput="keyFacts[${i}].value=this.value" style="flex:2" /><button class="btn btn-ghost btn-sm" onclick="removeKeyFact(${i})">×</button></div></div>`).join('');
}
function addKeyFact() { keyFacts.push({ label: '', value: '' }); _renderKeyFacts(); }
function removeKeyFact(i) { keyFacts.splice(i, 1); _renderKeyFacts(); }
function getKeyFacts() { return keyFacts; }

/* ─── Breadcrumb Builder ──────────────────────────────────── */
let breadcrumbs = [];
function renderBreadcrumbList(items) { breadcrumbs = items || []; _renderBreadcrumbs(); }
function _renderBreadcrumbs() {
  const el = document.getElementById('breadcrumb-list'); if (!el) return;
  if (!breadcrumbs.length) { el.innerHTML = '<div class="text-muted text-sm">No breadcrumbs yet.</div>'; return; }
  el.innerHTML = breadcrumbs.map((b, i) => `<div class="faq-item"><div class="flex gap-2 items-center"><input placeholder="Name (e.g. Home)" value="${esc(b.name||'')}" oninput="breadcrumbs[${i}].name=this.value" style="flex:1" /><input placeholder="URL (e.g. /)" value="${esc(b.url||'')}" oninput="breadcrumbs[${i}].url=this.value" style="flex:2" /><button class="btn btn-ghost btn-sm" onclick="removeBreadcrumb(${i})">×</button></div></div>`).join('');
}
function addBreadcrumb() { breadcrumbs.push({ name: '', url: '' }); _renderBreadcrumbs(); }
function removeBreadcrumb(i) { breadcrumbs.splice(i, 1); _renderBreadcrumbs(); }
function getBreadcrumbs() { return breadcrumbs; }

/* ─── hreflang Builder ────────────────────────────────────── */
let hreflangTags = [];
function renderHreflangList(items) { hreflangTags = items || []; _renderHreflang(); }
function _renderHreflang() {
  const el = document.getElementById('hreflang-list'); if (!el) return;
  if (!hreflangTags.length) { el.innerHTML = '<div class="text-muted text-sm">No hreflang tags. Add for multilingual/regional targeting.</div>'; return; }
  el.innerHTML = hreflangTags.map((h, i) => `<div class="faq-item"><div class="flex gap-2 items-center"><input placeholder="Lang (e.g. hi, en-GB)" value="${esc(h.lang||'')}" oninput="hreflangTags[${i}].lang=this.value" style="flex:1" /><input placeholder="URL" value="${esc(h.url||'')}" oninput="hreflangTags[${i}].url=this.value" style="flex:3" /><button class="btn btn-ghost btn-sm" onclick="removeHreflang(${i})">×</button></div></div>`).join('');
}
function addHreflang() { hreflangTags.push({ lang: '', url: '' }); _renderHreflang(); }
function removeHreflang(i) { hreflangTags.splice(i, 1); _renderHreflang(); }
function getHreflangTags() { return hreflangTags; }

/* ─── Custom Meta Builder ─────────────────────────────────── */
let customMeta = [];
function renderCustomMetaList(items) { customMeta = items || []; _renderCustomMeta(); }
function _renderCustomMeta() {
  const el = document.getElementById('custom-meta-list'); if (!el) return;
  if (!customMeta.length) { el.innerHTML = '<div class="text-muted text-sm">No custom meta tags.</div>'; return; }
  el.innerHTML = customMeta.map((m, i) => `<div class="faq-item"><div class="flex gap-2 items-center"><input placeholder="name" value="${esc(m.name||'')}" oninput="customMeta[${i}].name=this.value" style="flex:1" /><input placeholder="content" value="${esc(m.content||'')}" oninput="customMeta[${i}].content=this.value" style="flex:3" /><button class="btn btn-ghost btn-sm" onclick="removeCustomMeta(${i})">×</button></div></div>`).join('');
}
function addCustomMeta() { customMeta.push({ name: '', content: '' }); _renderCustomMeta(); }
function removeCustomMeta(i) { customMeta.splice(i, 1); _renderCustomMeta(); }
function getCustomMeta() { return customMeta; }

/* ─── Internal Links Builder ──────────────────────────────── */
let internalLinks = [];
function renderInternalLinksList(items) { internalLinks = items || []; _renderInternalLinks(); }
function _renderInternalLinks() {
  const el = document.getElementById('internallinks-list'); if (!el) return;
  if (!internalLinks.length) { el.innerHTML = '<div class="text-muted text-sm">No internal links defined.</div>'; return; }
  el.innerHTML = internalLinks.map((l, i) => `<div class="faq-item"><div class="flex gap-2 items-center"><input placeholder="Anchor text" value="${esc(l.anchor||'')}" oninput="internalLinks[${i}].anchor=this.value" style="flex:1" /><input placeholder="URL (/search)" value="${esc(l.url||'')}" oninput="internalLinks[${i}].url=this.value" style="flex:2" /><button class="btn btn-ghost btn-sm" onclick="removeInternalLink(${i})">×</button></div></div>`).join('');
}
function addInternalLink() { internalLinks.push({ anchor: '', url: '' }); _renderInternalLinks(); }
function removeInternalLink(i) { internalLinks.splice(i, 1); _renderInternalLinks(); }
function getInternalLinks() { return internalLinks; }

/* ═══════════════════════════════════════════════════════════
   EXPERIENCES
   ═══════════════════════════════════════════════════════════ */
async function renderExperiences() {
  const el = document.getElementById('view-experiences');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Experiences</h1><p class="page-subtitle">Manage experience listings</p></div><button class="btn btn-primary" onclick="openExperienceForm()">+ Add</button></div><div id="exp-list"></div>`;
  const items = await api('/cms/experiences').catch(() => []);
  const list = document.getElementById('exp-list');
  if (!items.length) { list.innerHTML = '<div class="empty-state"><div class="icon">✨</div><p>No experiences yet.</p></div>'; return; }
  list.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Title</th><th>Location</th><th>Category</th><th>Price</th><th>Rating</th><th>Actions</th></tr></thead><tbody>${items.map(e => `<tr><td><strong>${esc(e.title)}</strong></td><td>${esc(e.location)}</td><td>${esc(e.category)}</td><td>₹${num(e.price)}</td><td>${e.rating}⭐</td><td class="flex gap-1"><button class="btn btn-ghost btn-sm" onclick="openExperienceForm('${e.id}')">Edit</button><button class="btn btn-danger btn-sm" onclick="deleteExperience('${e.id}')">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}

function openExperienceForm(id) {
  const existing = null; // in a full impl, fetch by id
  const modal = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center" id="exp-modal">
  <div class="card" style="width:500px;max-height:90vh;overflow-y:auto">
    <div class="card-header"><div class="card-title">${id ? 'Edit' : 'New'} Experience</div><button class="btn btn-ghost btn-sm" onclick="document.getElementById('exp-modal').remove()">✕</button></div>
    <div class="form-grid">
      <label>Title <input id="em-title" /></label>
      <label>Location <input id="em-location" /></label>
      <label>Category <input id="em-category" /></label>
      <label>Price <input type="number" id="em-price" /></label>
      <label>Duration <input id="em-duration" placeholder="e.g. 3 hours" /></label>
      <label>Rating <input type="number" id="em-rating" value="4.5" min="1" max="5" step="0.1" /></label>
      <label class="form-full">Image URL <input id="em-image" /></label>
      <label class="form-full">Description <textarea id="em-desc" rows="3"></textarea></label>
    </div>
    <div class="flex gap-2 mt-2">
      <button class="btn btn-primary" onclick="saveExperience('${id||''}')">Save</button>
      <button class="btn btn-ghost" onclick="document.getElementById('exp-modal').remove()">Cancel</button>
    </div>
  </div></div>`;
  document.body.insertAdjacentHTML('beforeend', modal);
}

async function saveExperience(id) {
  const data = { title: val('em-title'), location: val('em-location'), category: val('em-category'), price: floatVal('em-price'), duration: val('em-duration'), rating: floatVal('em-rating'), image: val('em-image'), description: val('em-desc') };
  try {
    if (id) await api(`/cms/experiences/${id}`, { method: 'PATCH', body: data });
    else await api('/cms/experiences', { method: 'POST', body: data });
    toast('Saved!'); document.getElementById('exp-modal')?.remove(); renderExperiences();
  } catch (err) { toast(err.message, 'error'); }
}

async function deleteExperience(id) {
  if (!confirm('Delete?')) return;
  try { await api(`/cms/experiences/${id}`, { method: 'DELETE' }); toast('Deleted'); renderExperiences(); }
  catch (err) { toast(err.message, 'error'); }
}

/* ═══════════════════════════════════════════════════════════
   DESTINATIONS
   ═══════════════════════════════════════════════════════════ */
async function renderDestinations() {
  const el = document.getElementById('view-destinations');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Trending Destinations</h1></div><button class="btn btn-primary" onclick="openDestForm()">+ Add</button></div><div id="dest-list"></div>`;
  const items = await api('/cms/destinations').catch(() => []);
  const list = document.getElementById('dest-list');
  if (!items.length) { list.innerHTML = '<div class="empty-state"><div class="icon">📍</div><p>No destinations yet.</p></div>'; return; }
  list.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Tagline</th><th>Properties</th><th>Starting Price</th><th>Actions</th></tr></thead><tbody>${items.map(d => `<tr><td><strong>${esc(d.name)}</strong></td><td class="text-muted">${esc(d.tagline||'')}</td><td>${d.properties}</td><td>₹${num(d.startingPrice||0)}</td><td class="flex gap-1"><button class="btn btn-ghost btn-sm" onclick="openDestForm('${d.id}')">Edit</button><button class="btn btn-danger btn-sm" onclick="deleteDest('${d.id}')">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}

function openDestForm(id) {
  document.body.insertAdjacentHTML('beforeend', `<div style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:flex;align-items:center;justify-content:center" id="dest-modal">
  <div class="card" style="width:480px"><div class="card-header"><div class="card-title">${id?'Edit':'New'} Destination</div><button class="btn btn-ghost btn-sm" onclick="document.getElementById('dest-modal').remove()">✕</button></div>
  <div class="form-grid">
    <label>Name <input id="dm-name" /></label>
    <label>Tagline <input id="dm-tagline" /></label>
    <label>Country <input id="dm-country" value="India" /></label>
    <label># Properties <input type="number" id="dm-properties" /></label>
    <label>Starting Price <input type="number" id="dm-price" /></label>
    <label>Badge <input id="dm-badge" placeholder="e.g. 🔥 Trending" /></label>
    <label class="form-full">Image URL <input id="dm-image" /></label>
  </div>
  <div class="flex gap-2 mt-2"><button class="btn btn-primary" onclick="saveDest('${id||''}')">Save</button><button class="btn btn-ghost" onclick="document.getElementById('dest-modal').remove()">Cancel</button></div>
  </div></div>`);
}

async function saveDest(id) {
  const data = { name: val('dm-name'), tagline: val('dm-tagline'), country: val('dm-country'), properties: intVal('dm-properties'), startingPrice: floatVal('dm-price'), badge: val('dm-badge'), image: val('dm-image') };
  try {
    if (id) await api(`/cms/destinations/${id}`, { method: 'PATCH', body: data });
    else await api('/cms/destinations', { method: 'POST', body: data });
    toast('Saved!'); document.getElementById('dest-modal')?.remove(); renderDestinations();
  } catch (err) { toast(err.message, 'error'); }
}
async function deleteDest(id) {
  if (!confirm('Delete?')) return;
  try { await api(`/cms/destinations/${id}`, { method: 'DELETE' }); toast('Deleted'); renderDestinations(); }
  catch (err) { toast(err.message, 'error'); }
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════════════════ */
async function renderSettings() {
  const el = document.getElementById('view-settings');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Site Settings</h1></div></div><div class="card" id="settings-card"><p class="text-muted">Loading…</p></div>`;
  const settings = await api('/cms/settings').catch(() => ({}));
  document.getElementById('settings-card').innerHTML = `
    <div class="form-section"><div class="form-section-title">Global SEO Settings</div>
    <div class="form-grid">
      <label>Site Name <input id="s-siteName" value="${esc((settings.siteName)||'Triprodeo')}" /></label>
      <label>Site URL <input id="s-siteUrl" value="${esc((settings.siteUrl)||'https://triprodeo.com')}" /></label>
      <label class="form-full">Default Meta Description <textarea id="s-defaultDesc" rows="2">${esc((settings.defaultDesc)||'')}</textarea></label>
      <label>Twitter Handle <input id="s-twitterHandle" value="${esc((settings.twitterHandle)||'@triprodeo')}" /></label>
      <label>Default OG Image <input id="s-defaultOgImage" value="${esc((settings.defaultOgImage)||'')}" /></label>
    </div></div>
    <button class="btn btn-primary" onclick="saveSettings()">Save Settings</button>`;
}

async function saveSettings() {
  const settings = { siteName: val('s-siteName'), siteUrl: val('s-siteUrl'), defaultDesc: val('s-defaultDesc'), twitterHandle: val('s-twitterHandle'), defaultOgImage: val('s-defaultOgImage') };
  try {
    for (const [key, value] of Object.entries(settings)) await api('/cms/settings', { method: 'POST', body: { key, value } });
    toast('Settings saved!');
  } catch (err) { toast(err.message, 'error'); }
}

/* ═══════════════════════════════════════════════════════════
   HOSTS
   ═══════════════════════════════════════════════════════════ */
async function renderHosts() {
  const el = document.getElementById('view-hosts');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Hosts</h1></div></div><div id="hosts-table"><p class="text-muted">Loading…</p></div>`;
  try {
    const { hosts } = await api('/cms/hosts');
    document.getElementById('hosts-table').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Package</th><th>Status</th><th>Properties</th><th>Joined</th><th>Actions</th></tr></thead><tbody>${hosts.map(h => `<tr><td><strong>${esc(h.name)}</strong></td><td class="text-muted">${esc(h.email)}</td><td>${badge(h.package)}</td><td>${badge(h.status)}</td><td>${h._count.properties}</td><td class="text-muted text-sm">${fmtDate(h.joinedAt)}</td><td><div class="flex gap-1">${h.status==='ACTIVE'?`<button class="btn btn-warning btn-sm" onclick="updateHostStatus('${h.id}','SUSPENDED')">Suspend</button>`:`<button class="btn btn-success btn-sm" onclick="updateHostStatus('${h.id}','ACTIVE')">Activate</button>`}</div></td></tr>`).join('')}</tbody></table></div>`;
  } catch (err) { toast(err.message, 'error'); }
}

async function updateHostStatus(id, status) {
  try { await api(`/cms/hosts/${id}/status`, { method: 'PATCH', body: { status } }); toast('Updated'); renderHosts(); }
  catch (err) { toast(err.message, 'error'); }
}

/* ═══════════════════════════════════════════════════════════
   BOOKINGS
   ═══════════════════════════════════════════════════════════ */
async function renderBookings() {
  const el = document.getElementById('view-bookings');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">All Bookings</h1></div></div><div id="bookings-table"><p class="text-muted">Loading…</p></div>`;
  try {
    const { bookings } = await api('/cms/bookings');
    document.getElementById('bookings-table').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Guest</th><th>Property</th><th>Host</th><th>Check-In</th><th>Nights</th><th>Total</th><th>Status</th></tr></thead><tbody>${bookings.map(b => `<tr><td><strong>${esc(b.guestName)}</strong><br><span class="text-xs text-muted">${esc(b.guestEmail)}</span></td><td>${esc(b.property?.name||'')}</td><td>${esc(b.host?.name||'')}</td><td>${fmtDate(b.checkIn)}</td><td>${b.nights}</td><td>₹${num(b.totalAmount)}</td><td>${badge(b.status)}</td></tr>`).join('')}</tbody></table></div>`;
  } catch (err) { toast(err.message, 'error'); }
}

/* ═══════════════════════════════════════════════════════════
   REVENUE
   ═══════════════════════════════════════════════════════════ */
async function renderRevenue() {
  const el = document.getElementById('view-revenue');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Revenue</h1></div></div><div class="stats-grid" id="rev-stats"><p>Loading…</p></div>`;
  try {
    const r = await api('/cms/revenue');
    document.getElementById('rev-stats').innerHTML = `
      ${statCard('💰', 'Platform Revenue (All Time)', '₹' + num(r.totalRevenue), '10% of all bookings')}
      ${statCard('📅', 'This Month Revenue', '₹' + num(r.monthRevenue), 'Current month')}
      ${statCard('🔖', 'Total Bookings', num(r.totalBookings), 'All time')}
      ${statCard('🏠', 'Active Properties', num(r.totalProperties), 'Live listings')}
      ${statCard('👥', 'Total Hosts', num(r.totalHosts), 'Registered')}
    `;
  } catch (err) { toast(err.message, 'error'); }
}

/* ═══════════════════════════════════════════════════════════
   SITEMAP
   ═══════════════════════════════════════════════════════════ */
async function renderSitemap() {
  const el = document.getElementById('view-sitemap');
  el.innerHTML = `<div class="page-header"><div><h1 class="page-title">Sitemap & SEO Tools</h1></div></div>
  <div class="grid-2" style="gap:1rem">
    <div class="card"><div class="card-title mb-2">🗺️ XML Sitemap</div><p class="text-sm text-muted mb-2">Auto-generated from all published pages and active properties.</p><a href="/sitemap.xml" target="_blank" class="btn btn-primary">View sitemap.xml</a></div>
    <div class="card"><div class="card-title mb-2">🤖 Robots.txt</div><p class="text-sm text-muted mb-2">Controls search engine crawler access.</p><a href="/robots.txt" target="_blank" class="btn btn-primary">View robots.txt</a></div>
    <div class="card"><div class="card-title mb-2">📊 SEO Checklist</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem">
        ${['All pages have canonical URLs','OG images set for social sharing','FAQ schema on relevant pages','Breadcrumbs on all inner pages','hreflang for multilingual support','Speakable content for voice search','Entity markup (GEO) configured','AI-readable summaries (AIO) added','Topic clusters defined (AIO)','Internal linking strategy (SXO)'].map(c=>`<li class="text-sm">✅ ${c}</li>`).join('')}
      </ul>
    </div>
    <div class="card"><div class="card-title mb-2">🔍 Optimization Guide</div>
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <div><strong class="text-sm">SEO</strong><p class="text-xs text-muted">Title 50–60 chars, meta desc 120–160 chars, canonical on every page, proper robots tags</p></div>
        <div><strong class="text-sm">AEO</strong><p class="text-xs text-muted">FAQ schema, HowTo schema, Speakable selectors, target questions for AI engines</p></div>
        <div><strong class="text-sm">GEO</strong><p class="text-xs text-muted">Geo meta tags (lat/lng), entity SameAs links to Wikidata, entity type markup</p></div>
        <div><strong class="text-sm">AIO</strong><p class="text-xs text-muted">AI-readable content summary, key facts, topic clusters, pillar content flags</p></div>
        <div><strong class="text-sm">SXO</strong><p class="text-xs text-muted">Breadcrumbs, CTAs, internal links, related pages, content type declaration</p></div>
      </div>
    </div>
  </div>`;
}

/* ─── Helpers ─────────────────────────────────────────────── */
function val(id) { return document.getElementById(id)?.value?.trim() || ''; }
function intVal(id) { const v = parseInt(val(id)); return isNaN(v) ? null : v; }
function floatVal(id) { const v = parseFloat(val(id)); return isNaN(v) ? null : v; }
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function num(n) { return Number(n || 0).toLocaleString('en-IN'); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '-'; }
function badge(status) {
  const map = { ACTIVE:'success', PUBLISHED:'success', CONFIRMED:'success', COMPLETED:'success', PREMIUM:'info', STANDARD:'info', BASIC:'muted', DRAFT:'muted', SUSPENDED:'danger', CANCELLED:'danger', PENDING:'warning', ARCHIVED:'muted', NO_SHOW:'danger' };
  const cls = map[status] || 'muted';
  return `<span class="badge badge-${cls}">${status}</span>`;
}
