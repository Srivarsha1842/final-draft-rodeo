import { Request, Response, NextFunction } from 'express';
import * as cmsService from '../services/cms.service';
import { sendSuccess, sendError } from '../utils/response.util';
import prisma from '../config/database';

// ── Pages ──────────────────────────────────────────────────────────────────────

export const listPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const pages = await cmsService.getAllPages(status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | undefined);
    sendSuccess(res, pages);
  } catch (err) { next(err); }
};

export const getPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.getPageById(req.params.id);
    sendSuccess(res, page);
  } catch (err) { next(err); }
};

export const getPageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.getPageBySlug(req.params.slug);
    sendSuccess(res, page);
  } catch (err) { next(err); }
};

export const getPageHead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.getPageBySlug(req.params.slug);
    const head = cmsService.generateFullHead(page);
    sendSuccess(res, head);
  } catch (err) { next(err); }
};

export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.slug || !req.body.name) return sendError(res, 'slug and name required', 400);
    const page = await cmsService.createPage({
      slug: req.body.slug,
      name: req.body.name,
      content: req.body.content || {},
      ...req.body,
    });
    sendSuccess(res, page, 201, 'Page created');
  } catch (err) { next(err); }
};

export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.updatePage(req.params.id, req.body);
    sendSuccess(res, page);
  } catch (err) { next(err); }
};

export const publishPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.publishPage(req.params.id);
    sendSuccess(res, page, 200, 'Page published');
  } catch (err) { next(err); }
};

export const unpublishPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.unpublishPage(req.params.id);
    sendSuccess(res, page, 200, 'Page unpublished');
  } catch (err) { next(err); }
};

export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cmsService.deletePage(req.params.id);
    sendSuccess(res, null, 200, 'Page archived');
  } catch (err) { next(err); }
};

// ── Public content blob (consumed by frontend to render the site) ──────────────

export const getPublicContent = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await cmsService.getSetting('cms_content');
    sendSuccess(res, value);
  } catch (err) { next(err); }
};

// ── SEO ────────────────────────────────────────────────────────────────────────

export const getSitemap = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const xml = await cmsService.generateSitemap();
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) { next(err); }
};

export const getRobots = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const txt = cmsService.generateRobots();
    res.set('Content-Type', 'text/plain');
    res.send(txt);
  } catch (err) { next(err); }
};

// ── Site Settings ──────────────────────────────────────────────────────────────

export const getSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await cmsService.getAllSettings()); }
  catch (err) { next(err); }
};

export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, value } = req.body;
    if (!key) return sendError(res, 'key required', 400);
    await cmsService.upsertSetting(key, value);
    sendSuccess(res, null, 200, 'Setting updated');
  } catch (err) { next(err); }
};

// ── Admin: Hosts ───────────────────────────────────────────────────────────────

export const listHosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const result = await import('../services/hosts.service').then((s) =>
      s.getAllHosts(
        page ? parseInt(page as string) : 1,
        limit ? parseInt(limit as string) : 20
      )
    );
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

export const updateHostStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, 'status required', 400);
    const host = await import('../services/hosts.service').then((s) =>
      s.updateHostStatus(req.params.hostId, status)
    );
    sendSuccess(res, host);
  } catch (err) { next(err); }
};

// ── Admin: All Bookings ────────────────────────────────────────────────────────

export const listAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const [total, bookings] = await prisma.$transaction([
      prisma.booking.count(),
      prisma.booking.findMany({
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          property: { select: { name: true, city: true } },
          host: { select: { name: true } },
        },
      }),
    ]);
    sendSuccess(res, { bookings, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (err) { next(err); }
};

// ── Admin: Revenue ─────────────────────────────────────────────────────────────

export const getRevenue = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalRevenue, monthRevenue, totalBookings, totalHosts, totalProperties] =
      await prisma.$transaction([
        prisma.booking.aggregate({
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
          _sum: { platformFee: true },
        }),
        prisma.booking.aggregate({
          where: {
            status: { in: ['CONFIRMED', 'COMPLETED'] },
            createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
          _sum: { platformFee: true },
        }),
        prisma.booking.count(),
        prisma.host.count(),
        prisma.property.count({ where: { status: 'ACTIVE' } }),
      ]);

    sendSuccess(res, {
      totalRevenue: totalRevenue._sum.platformFee ?? 0,
      monthRevenue: monthRevenue._sum.platformFee ?? 0,
      totalBookings,
      totalHosts,
      totalProperties,
    });
  } catch (err) { next(err); }
};

// ── Experiences ────────────────────────────────────────────────────────────────

export const listExperiences = async (_req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await prisma.experience.findMany({ orderBy: { createdAt: 'desc' } })); }
  catch (err) { next(err); }
};

export const createExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = await prisma.experience.create({ data: req.body });
    sendSuccess(res, exp, 201);
  } catch (err) { next(err); }
};

export const updateExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = await prisma.experience.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, exp);
  } catch (err) { next(err); }
};

export const deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 200, 'Deleted');
  } catch (err) { next(err); }
};

// ── Trending Destinations ──────────────────────────────────────────────────────

export const listDestinations = async (_req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await prisma.trendingDestination.findMany({ orderBy: { createdAt: 'desc' } })); }
  catch (err) { next(err); }
};

export const createDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dest = await prisma.trendingDestination.create({ data: req.body });
    sendSuccess(res, dest, 201);
  } catch (err) { next(err); }
};

export const updateDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dest = await prisma.trendingDestination.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, dest);
  } catch (err) { next(err); }
};

export const deleteDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.trendingDestination.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 200, 'Deleted');
  } catch (err) { next(err); }
};
