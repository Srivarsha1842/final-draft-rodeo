import app from './app';
import { env } from './config/env';
import prisma from './config/database';

const server = app.listen(env.PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║        TRIPRODEO BACKEND SERVER              ║
  ║  Port:  ${env.PORT}                              ║
  ║  Mode:  ${env.NODE_ENV.padEnd(12)}                  ║
  ╚══════════════════════════════════════════════╝

  API:       http://localhost:${env.PORT}/api
  Health:    http://localhost:${env.PORT}/health
  CMS Admin: http://localhost:${env.PORT}/cms-admin
  Sitemap:   http://localhost:${env.PORT}/sitemap.xml
  Robots:    http://localhost:${env.PORT}/robots.txt
  `);
});

const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
