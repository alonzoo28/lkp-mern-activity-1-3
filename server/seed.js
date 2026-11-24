import 'dotenv/config';
import mongoose from 'mongoose';
import Project from './models/Project.js';
import mockProjects from './mockProjects.js';

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and set the connection string.');
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await Project.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped: ${count} project records already exist.`);
  } else {
    await Project.insertMany(mockProjects);
    console.log(`Seeded ${mockProjects.length} mock projects.`);
  }
  await mongoose.disconnect();
}

seed().catch(async error => {
  console.error(`Could not seed MongoDB: ${error.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
