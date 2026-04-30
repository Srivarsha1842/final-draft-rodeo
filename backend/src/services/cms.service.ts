import prisma from '../config/database';
import { CmsPageStatus, Prisma } from '@prisma/client';
import {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  speakableSchema,
} from '../utils/schemaMarkup.util';
import { env } from '../config/env';

// ── Page CRUD ──────────────────────────────────────────────────────────────────

export const getAllPages = async (status?: CmsPageStatus) => {
  return prisma.cmsPage.findMany({
    where: status ? { status } : {},
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, slug: true, name: true, status: true,
      publishedAt: true, updatedAt: true,
      seoTitle: true, seoDescription: true,
    },
  });
};

export const getPageBySlug = async (slug: string) => {
  const page = await prisma.cmsPage.findUnique({ where: { slug } });
  if (!page) throw Object.assign(new Error('Page not found'), { statusCode: 404 });
  return page;
};

export const getPageById = async (id: string) => {
  const page = await prisma.cmsPage.findUnique({ where: { id } });
  if (!page) throw Object.assign(new Error('Page not found'), { statusCode: 404 });
  return page;
};

export const createPage = async (data: Prisma.CmsPageCreateInput) => {
  return prisma.cmsPage.create({ data });
};

export const updatePage = async (id: string, data: Prisma.CmsPageUpdateInput) => {
  return prisma.cmsPage.update({ where: { id }, data });
};

export const publishPage = async (id: string) => {
  return prisma.cmsPage.update({
    where: { id },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });
};

export const unpublishPage = async (id: string) => {
  return prisma.cmsPage.update({
    where: { id },
    data: { status: 'DRAFT', publishedAt: null },
  });
};

export const deletePage = async (id: string) => {
  return prisma.cmsPage.update({ where: { id }, data: { status: 'ARCHIVED' } });
};

// ── SEO Meta Generation ────────────────────────────────────────────────────────

export const generateFullHead = (page: Prisma.CmsPageGetPayload<object>) => {
  const canonical = page.canonicalUrl || `${env.SITE_URL}/${page.slug === 'home' ? '' : page.slug}`;
  const ogImage = page.ogImage || `${env.SITE_URL}/og-default.jpg`;
  const title = page.seoTitle || env.SITE_NAME;
  const description = page.seoDescription || env.SITE_DESCRIPTION;

  // Build schema array
  const schemas: object[] = [organizationSchema(), websiteSchema()];

  if (page.breadcrumbs) {
    const crumbs = page.breadcrumbs as { name: string; url: string }[];
    schemas.push(breadcrumbSchema(crumbs));
  }
  if (page.faqItems) {
    const faqs = page.faqItems as { question: string; answer: string }[];
    if (faqs.length > 0) schemas.push(faqSchema(faqs));
  }
  if (page.howToSteps) {
    const steps = page.howToSteps as { name: string; text: string; image?: string; url?: string }[];
    if (steps.length > 0) schemas.push(howToSchema(page.name, steps));
  }
  if (page.speakableSelectors && page.speakableSelectors.length > 0) {
    schemas.push(speakableSchema(page.speakableSelectors));
  }
  if (page.schemaOrg) {
    const extra = Array.isArray(page.schemaOrg) ? page.schemaOrg : [page.schemaOrg];
    schemas.push(...extra as object[]);
  }

  const geoMeta: { name: string; content: string }[] = [];
  if (page.geoLatitude && page.geoLongitude) {
    geoMeta.push(
      { name: 'geo.position', content: `${page.geoLatitude};${page.geoLongitude}` },
      { name: 'ICBM', content: `${page.geoLatitude}, ${page.geoLongitude}` }
    );
  }
  if (page.geoRegion) geoMeta.push({ name: 'geo.region', content: page.geoRegion });
  if (page.geoPlaceName) geoMeta.push({ name: 'geo.placename', content: page.geoPlaceName });

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: page.robots },
      { name: 'keywords', content: page.seoKeywords.join(', ') },
      // Open Graph
      { property: 'og:title', content: page.ogTitle || title },
      { property: 'og:description', content: page.ogDescription || description },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:alt', content: page.ogImageAlt || title },
      { property: 'og:type', content: page.ogType },
      { property: 'og:url', content: page.ogUrl || canonical },
      { property: 'og:site_name', content: page.ogSiteName || env.SITE_NAME },
      { property: 'og:locale', content: page.ogLocale },
      // Twitter
      { name: 'twitter:card', content: page.twitterCard },
      { name: 'twitter:title', content: page.twitterTitle || title },
      { name: 'twitter:description', content: page.twitterDescription || description },
      { name: 'twitter:image', content: page.twitterImage || ogImage },
      { name: 'twitter:image:alt', content: page.twitterImageAlt || title },
      ...(page.twitterSite ? [{ name: 'twitter:site', content: page.twitterSite }] : []),
      ...(page.twitterCreator ? [{ name: 'twitter:creator', content: page.twitterCreator }] : []),
      // GEO
      ...geoMeta,
      // AIO
      ...(page.contentSummary
        ? [{ name: 'description:ai', content: page.contentSummary }]
        : []),
      // Custom
      ...((page.customMeta as { name: string; content: string }[]) || []),
    ],
    links: [
      { rel: 'canonical', href: canonical },
      ...((page.hreflangTags as { lang: string; url: string }[]) || []).map((h) => ({
        rel: 'alternate',
        hreflang: h.lang,
        href: h.url,
      })),
    ],
    schemas,
    // AEO data
    faqItems: page.faqItems,
    keyFacts: page.keyFacts,
    targetQuestions: page.targetQuestions,
    breadcrumbs: page.breadcrumbs,
    // SXO
    relatedPages: page.relatedPages,
    cta: page.cta,
    internalLinks: page.internalLinks,
    readingTimeMin: page.readingTimeMin,
    contentType: page.contentType,
  };
};

// ── Sitemap ────────────────────────────────────────────────────────────────────

export const generateSitemap = async (): Promise<string> => {
  const [pages, properties] = await prisma.$transaction([
    prisma.cmsPage.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true, priority: true, changefreq: true },
    }),
    prisma.property.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const today = new Date().toISOString().split('T')[0];
  const staticUrls = [
    { loc: env.SITE_URL, changefreq: 'daily', priority: '1.0', lastmod: today },
    { loc: `${env.SITE_URL}/search`, changefreq: 'daily', priority: '0.9', lastmod: today },
    { loc: `${env.SITE_URL}/blog`, changefreq: 'daily', priority: '0.8', lastmod: today },
    { loc: `${env.SITE_URL}/experiences`, changefreq: 'weekly', priority: '0.8', lastmod: today },
    { loc: `${env.SITE_URL}/about`, changefreq: 'monthly', priority: '0.6', lastmod: today },
    { loc: `${env.SITE_URL}/support`, changefreq: 'monthly', priority: '0.5', lastmod: today },
    { loc: `${env.SITE_URL}/partner`, changefreq: 'monthly', priority: '0.5', lastmod: today },
  ];

  const pageUrls = pages.map((p) => ({
    loc: `${env.SITE_URL}/${p.slug === 'home' ? '' : p.slug}`,
    changefreq: p.changefreq,
    priority: p.priority.toFixed(1),
    lastmod: p.updatedAt.toISOString().split('T')[0],
  }));

  const propertyUrls = properties.map((p) => ({
    loc: `${env.SITE_URL}/property/${p.id}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: p.updatedAt.toISOString().split('T')[0],
  }));

  const allUrls = [...staticUrls, ...pageUrls, ...propertyUrls];

  const urlEntries = allUrls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
};

// ── Robots.txt ─────────────────────────────────────────────────────────────────

export const generateRobots = (): string => `User-agent: *
Allow: /
Disallow: /admin
Disallow: /host-portal
Disallow: /resort-owner-portal
Disallow: /api/
Disallow: /cms-admin/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${env.SITE_URL}/sitemap.xml
`;

// ── Site Settings ──────────────────────────────────────────────────────────────

export const getSetting = async (key: string) => {
  const setting = await prisma.siteSettings.findUnique({ where: { key } });
  return setting?.value ?? null;
};

export const upsertSetting = async (key: string, value: unknown) => {
  return prisma.siteSettings.upsert({
    where: { key },
    update: { value: value as Prisma.InputJsonValue },
    create: { key, value: value as Prisma.InputJsonValue },
  });
};

export const getAllSettings = async () => {
  const settings = await prisma.siteSettings.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
};
