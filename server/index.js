import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import Project from './models/Project.js';
import mockProjects from './mockProjects.js';

const app = express();
const port = Number(process.env.PORT || 5000);
app.use(express.json({ limit: '100kb' }));

function projectJson(project) {
  const item = project.toObject ? project.toObject() : project;
  return { ...item, id: String(item._id) };
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', databaseName: mongoose.connection.name || null });
});

app.get('/api/projects', async (_request, response, next) => {
  try {
    const records = await Project.find().sort({ date: -1, createdAt: -1 }).lean();
    response.json({ count: records.length, data: records.map(projectJson) });
  } catch (error) { next(error); }
});

app.get('/api/projects/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) return response.status(400).json({ message: 'Invalid project ID.' });
    const record = await Project.findById(request.params.id).lean();
    if (!record) return response.status(404).json({ message: 'Project not found.' });
    response.json({ data: projectJson(record) });
  } catch (error) { next(error); }
});

app.post('/api/projects', async (request, response, next) => {
  try {
    const record = await Project.create(request.body);
    response.status(201).json({ message: 'Project created.', data: projectJson(record) });
  } catch (error) { next(error); }
});

app.put('/api/projects/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) return response.status(400).json({ message: 'Invalid project ID.' });
    const allowed = ['title', 'category', 'status', 'date', 'location', 'reach', 'summary', 'result', 'source', 'image', 'icon', 'sample'];
    const updates = Object.fromEntries(Object.entries(request.body).filter(([key]) => allowed.includes(key)));
    const record = await Project.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true });
    if (!record) return response.status(404).json({ message: 'Project not found.' });
    response.json({ message: 'Project updated.', data: projectJson(record) });
  } catch (error) { next(error); }
});

app.delete('/api/projects/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) return response.status(400).json({ message: 'Invalid project ID.' });
    const record = await Project.findByIdAndDelete(request.params.id);
    if (!record) return response.status(404).json({ message: 'Project not found.' });
    response.json({ message: 'Project deleted.', data: { id: String(record._id) } });
  } catch (error) { next(error); }
});

app.use((error, _request, response, _next) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return response.status(400).json({ message: 'Invalid project data.', details: error.message });
  }
  console.error(error.message);
  response.status(500).json({ message: 'Server error while processing the request.' });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Copy .env.example to .env and add your MongoDB connection string.');
    process.exitCode = 1;
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(mockProjects);
      console.log(`Inserted ${mockProjects.length} mock projects into MongoDB.`);
    }
    app.listen(port, () => console.log(`LKP API running at http://localhost:${port} (MongoDB connected)`));
  } catch (error) {
    console.error(`Could not connect to MongoDB: ${error.message}`);
    process.exitCode = 1;
  }
}

start();
