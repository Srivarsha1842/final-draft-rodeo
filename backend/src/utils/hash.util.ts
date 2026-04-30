import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (plain: string): Promise<string> =>
  bcrypt.hash(plain, SALT_ROUNDS);

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> =>
  bcrypt.compare(plain, hashed);
