/**
 * Two-Factor Authentication (TOTP) Service
 */
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { issueTokens, toUserResponse } from './auth.service.js';

const BACKUP_CODE_COUNT = 10;
const BACKUP_CODE_LENGTH = 10;

function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < BACKUP_CODE_COUNT; i += 1) {
    const raw = crypto.randomBytes(8).toString('base64').replace(/[^A-Z0-9]/gi, '').toUpperCase();
    codes.push(raw.slice(0, BACKUP_CODE_LENGTH));
  }
  return codes;
}

async function hashBackupCodes(codes) {
  const hashed = [];
  for (const code of codes) {
    // bcrypt is fine here; count is small
    hashed.push(await bcrypt.hash(code, 10));
  }
  return hashed;
}

function verifyTotp(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  });
}

async function resolveUserFromTwoFactorToken(twoFactorToken) {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  let decoded;
  try {
    decoded = jwt.verify(twoFactorToken, JWT_SECRET);
  } catch {
    const err = new Error('Invalid or expired 2FA token');
    err.status = 401;
    throw err;
  }
  if (decoded.type !== '2fa') {
    const err = new Error('Invalid 2FA token');
    err.status = 401;
    throw err;
  }
  const user = await User.findById(decoded.sub).select('+twoFactorSecret +twoFactorBackupCodes');
  if (!user) {
    const err = new Error('User not found');
    err.status = 401;
    throw err;
  }
  return user;
}

export async function setup2FA(userId) {
  if (!userId) {
    const err = new Error('User ID is required');
    err.status = 400;
    throw err;
  }

  const user = await User.findById(userId).select('+twoFactorTempSecret');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const secret = speakeasy.generateSecret({
    name: `HSOCIETY (${user.email})`
  });

  user.twoFactorTempSecret = secret.base32;
  await user.save({ validateBeforeSave: false });

  const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
    qrDataUrl
  };
}

export async function enable2FA(userId, code) {
  if (!userId || !code) {
    const err = new Error('User ID and code are required');
    err.status = 400;
    throw err;
  }

  const user = await User.findById(userId).select('+twoFactorTempSecret +twoFactorBackupCodes');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  if (!user.twoFactorTempSecret) {
    const err = new Error('2FA setup is not initialized');
    err.status = 400;
    throw err;
  }

  const ok = verifyTotp(user.twoFactorTempSecret, code);
  if (!ok) {
    const err = new Error('Invalid 2FA code');
    err.status = 401;
    throw err;
  }

  const backupCodes = generateBackupCodes();
  const hashedBackupCodes = await hashBackupCodes(backupCodes);

  user.twoFactorSecret = user.twoFactorTempSecret;
  user.twoFactorTempSecret = undefined;
  user.twoFactorEnabled = true;
  user.twoFactorBackupCodes = hashedBackupCodes;
  await user.save({ validateBeforeSave: false });

  return { backupCodes };
}

export async function disable2FA(userId, code) {
  if (!userId || !code) {
    const err = new Error('User ID and code are required');
    err.status = 400;
    throw err;
  }

  const user = await User.findById(userId).select('+twoFactorSecret +twoFactorBackupCodes');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const isTotpValid = user.twoFactorSecret
    ? verifyTotp(user.twoFactorSecret, code)
    : false;

  let usedBackup = false;
  if (!isTotpValid && user.twoFactorBackupCodes?.length) {
    for (const hashed of user.twoFactorBackupCodes) {
      const match = await bcrypt.compare(code, hashed);
      if (match) {
        usedBackup = true;
        break;
      }
    }
  }

  if (!isTotpValid && !usedBackup) {
    const err = new Error('Invalid 2FA code');
    err.status = 401;
    throw err;
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  user.twoFactorTempSecret = undefined;
  user.twoFactorBackupCodes = [];
  await user.save({ validateBeforeSave: false });

  return { success: true };
}

export async function verify2FA(twoFactorToken, code) {
  if (!twoFactorToken || !code) {
    const err = new Error('2FA token and code are required');
    err.status = 400;
    throw err;
  }

  const user = await resolveUserFromTwoFactorToken(twoFactorToken);

  if (!user.twoFactorSecret || !user.twoFactorEnabled) {
    const err = new Error('2FA is not enabled for this account');
    err.status = 400;
    throw err;
  }

  const ok = verifyTotp(user.twoFactorSecret, code);
  if (!ok) {
    const err = new Error('Invalid 2FA code');
    err.status = 401;
    throw err;
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken, expiresIn } = issueTokens(user._id, user.email, user.role);
  return {
    user: toUserResponse(user),
    token: accessToken,
    refreshToken,
    expiresIn
  };
}

export async function verifyBackupCode(twoFactorToken, backupCode) {
  if (!twoFactorToken || !backupCode) {
    const err = new Error('2FA token and backup code are required');
    err.status = 400;
    throw err;
  }

  const user = await resolveUserFromTwoFactorToken(twoFactorToken);

  if (!user.twoFactorBackupCodes?.length) {
    const err = new Error('No backup codes available');
    err.status = 400;
    throw err;
  }

  let matchIndex = -1;
  for (let i = 0; i < user.twoFactorBackupCodes.length; i += 1) {
    const hashed = user.twoFactorBackupCodes[i];
    // eslint-disable-next-line no-await-in-loop
    const match = await bcrypt.compare(backupCode, hashed);
    if (match) {
      matchIndex = i;
      break;
    }
  }

  if (matchIndex === -1) {
    const err = new Error('Invalid backup code');
    err.status = 401;
    throw err;
  }

  user.twoFactorBackupCodes.splice(matchIndex, 1);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken, expiresIn } = issueTokens(user._id, user.email, user.role);
  return {
    user: toUserResponse(user),
    token: accessToken,
    refreshToken,
    expiresIn
  };
}

export async function regenerateBackupCodes(userId) {
  if (!userId) {
    const err = new Error('User ID is required');
    err.status = 400;
    throw err;
  }

  const user = await User.findById(userId).select('+twoFactorBackupCodes');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const backupCodes = generateBackupCodes();
  user.twoFactorBackupCodes = await hashBackupCodes(backupCodes);
  await user.save({ validateBeforeSave: false });

  return { backupCodes };
}

export async function get2FAStatus(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return { enabled: !!user.twoFactorEnabled };
}

export default {
  setup2FA,
  enable2FA,
  disable2FA,
  verify2FA,
  verifyBackupCode,
  regenerateBackupCodes,
  get2FAStatus
};
