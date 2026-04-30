import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash.util';
import { signAccessToken, signRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt.util';

// ── Admin ──────────────────────────────────────────────────────────────────────

export const adminLogin = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const valid = await comparePassword(password, admin.password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const payload: TokenPayload = { id: admin.id, email: admin.email, role: 'admin' };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    admin: { id: admin.id, email: admin.email, name: admin.name },
  };
};

// ── Host ───────────────────────────────────────────────────────────────────────

export const hostLogin = async (email: string, password: string) => {
  const host = await prisma.host.findUnique({ where: { email } });
  if (!host) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  if (host.status === 'SUSPENDED')
    throw Object.assign(new Error('Account suspended. Contact support.'), { statusCode: 403 });

  const valid = await comparePassword(password, host.password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const payload: TokenPayload = { id: host.id, email: host.email, role: 'host' };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.host.update({ where: { id: host.id }, data: { refreshToken } });

  return {
    accessToken,
    refreshToken,
    host: {
      id: host.id,
      email: host.email,
      name: host.name,
      package: host.package,
      status: host.status,
      avatar: host.avatar,
      phone: host.phone,
    },
  };
};

export const hostSignup = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const existing = await prisma.host.findUnique({ where: { email: data.email } });
  if (existing) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });

  const hashed = await hashPassword(data.password);
  const host = await prisma.host.create({
    data: { name: data.name, email: data.email, password: hashed, phone: data.phone },
  });

  const payload: TokenPayload = { id: host.id, email: host.email, role: 'host' };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    host: { id: host.id, email: host.email, name: host.name, package: host.package },
  };
};

// ── Guest / User ───────────────────────────────────────────────────────────────

export const userLogin = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const valid = await comparePassword(password, user.password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

  const payload: TokenPayload = { id: user.id, email: user.email, role: 'user' };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
  };
};

export const userSignup = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });

  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed, phone: data.phone },
  });

  const payload: TokenPayload = { id: user.id, email: user.email, role: 'user' };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: { id: user.id, email: user.email, name: user.name },
  };
};

// ── Refresh ────────────────────────────────────────────────────────────────────

export const refreshTokens = async (token: string) => {
  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
  }

  const newAccess = signAccessToken(payload);
  const newRefresh = signRefreshToken(payload);

  if (payload.role === 'host') {
    await prisma.host.update({ where: { id: payload.id }, data: { refreshToken: newRefresh } });
  } else if (payload.role === 'user') {
    await prisma.user.update({ where: { id: payload.id }, data: { refreshToken: newRefresh } });
  }

  return { accessToken: newAccess, refreshToken: newRefresh };
};
