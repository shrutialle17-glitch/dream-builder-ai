import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma.js';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './email.service.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return { user: userWithoutPassword, token };
};

export const googleLogin = async (credential) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email || !payload?.name) {
    const error = new Error('Invalid Google credential payload');
    error.statusCode = 401;
    throw error;
  }

  const email = payload.email;
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name,
        email,
        password: await bcrypt.hash(Math.random().toString(36) + Date.now(), 12),
      },
    });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return { user: userWithoutPassword, token };
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUser = async (id, data) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      // theme: data.theme // if theme exists in schema
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });
  return user;
};


export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('No account found with that email address.');
    error.statusCode = 404;
    throw error;
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Set token to expire in 30 minutes
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: hashedToken,
      resetTokenExpires: expiresAt,
    }
  });

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
  
  // Send the actual email
  await sendPasswordResetEmail(email, resetUrl);
  
  return resetToken;
};

export const resetPassword = async (token, newPassword) => {
  // Hash the incoming token to compare with DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpires: { gt: new Date() } // not expired
    }
  });

  if (!user) {
    const error = new Error('This reset link is invalid or has expired. Request a new one.');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null
    }
  });

  return { message: 'Password updated successfully' };
};

export const updatePassword = async (id, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Incorrect current password');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  });
  
  return { success: true };
};