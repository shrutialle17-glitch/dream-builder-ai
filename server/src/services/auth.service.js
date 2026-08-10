import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (credentialToken) => {
  // 1. Verify the token with Google
  const ticket = await googleClient.verifyIdToken({
    idToken: credentialToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  
  // 2. Extract user info from Google's response
  const payload = ticket.getPayload();
  const { email, name } = payload;
  // 3. Check if user exists in our database
  let user = await prisma.user.findUnique({ where: { email } });
  // 4. If they don't exist, create an account automatically (Registration)
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        // Give them a random, highly secure password since they authenticate via Google
        password: await bcrypt.hash(Math.random().toString(36) + Date.now(), 10), 
      }
    });
  }
  // 5. Generate our standard app JWT (just like normal login)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  return { user, token };
};

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
