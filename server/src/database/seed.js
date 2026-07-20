import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../models/User.js';
import Link from '../models/Link.js';
import Analytics from '../models/Analytics.js';
import { ROLES } from '../constants/index.js';

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log('[seed] Connected. Clearing existing demo data...');

  await Promise.all([User.deleteMany({}), Link.deleteMany({}), Analytics.deleteMany({})]);

  const admin = await User.create({
    name: 'Ava Chen',
    email: 'admin@snaplink.dev',
    password: 'Password123',
    role: ROLES.ADMIN,
    isEmailVerified: true,
  });

  const demoUser = await User.create({
    name: 'Jordan Park',
    email: 'demo@snaplink.dev',
    password: 'Password123',
    role: ROLES.USER,
    isEmailVerified: true,
  });

  const sampleUrls = [
    { url: 'https://www.anthropic.com/research', title: 'Anthropic Research' },
    { url: 'https://react.dev/learn', title: 'React Docs' },
    { url: 'https://tailwindcss.com/docs', title: 'Tailwind Docs' },
    { url: 'https://render.com/docs', title: 'Render Docs' },
    { url: 'https://www.mongodb.com/atlas', title: 'MongoDB Atlas' },
  ];

  const countries = ['US', 'GB', 'IN', 'DE', 'BR', 'RO', 'CA'];
  const devices = ['Desktop', 'Mobile', 'Tablet'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

  for (let i = 0; i < sampleUrls.length; i += 1) {
    const { url, title } = sampleUrls[i];
    const link = await Link.create({
      originalUrl: url,
      shortCode: `demo${i + 1}`,
      owner: demoUser._id,
      title,
      clicks: Math.floor(Math.random() * 400) + 20,
    });

    const events = Array.from({ length: 25 }).map(() => ({
      linkId: link._id,
      country: countries[Math.floor(Math.random() * countries.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: 'Unknown',
      referer: Math.random() > 0.5 ? 'Direct' : 'https://twitter.com',
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
    }));
    await Analytics.insertMany(events);
  }

  console.log('[seed] Done.');
  console.log('[seed] Admin login:  admin@snaplink.dev / Password123');
  console.log('[seed] Demo login:   demo@snaplink.dev  / Password123');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
