import assert from 'node:assert/strict';

const baseUrl = process.env.API_BASE || 'http://localhost:5000/api';
const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  return { response, body };
};

const { response: healthResponse, body: health } = await request('/health');
assert.equal(healthResponse.status, 200, 'health endpoint should return HTTP 200');
assert.equal(health.database, 'connected', 'API must be connected to MongoDB before running CRUD checks');

const { response: listResponse, body: list } = await request('/projects');
assert.equal(listResponse.status, 200, 'list endpoint should return HTTP 200');
assert.ok(Array.isArray(list.data), 'list endpoint should return an array');

const unique = Date.now();
const payload = {
  title: `API test project ${unique}`,
  category: 'Education',
  status: 'Proposed',
  date: '2026-11-24',
  location: 'Paco, Obando, Bulacan',
  reach: 'Mock test record',
  summary: 'Temporary record created by the Activity 1.3 API test.',
  result: 'Will be updated, then deleted by the test.'
};
let projectId;
try {
  const created = await request('/projects', { method: 'POST', body: JSON.stringify(payload) });
  assert.equal(created.response.status, 201, 'create should return HTTP 201');
  projectId = created.body.data?.id;
  assert.ok(projectId, 'create response should include a project ID');

  const read = await request(`/projects/${projectId}`);
  assert.equal(read.response.status, 200, 'read should return HTTP 200');
  assert.equal(read.body.data.title, payload.title, 'read should return the created project');

  const updated = await request(`/projects/${projectId}`, {
    method: 'PUT', body: JSON.stringify({ title: `${payload.title} updated`, status: 'Planned' })
  });
  assert.equal(updated.response.status, 200, 'update should return HTTP 200');
  assert.equal(updated.body.data.status, 'Planned', 'update should persist changes');

  const removed = await request(`/projects/${projectId}`, { method: 'DELETE' });
  assert.equal(removed.response.status, 200, 'delete should return HTTP 200');
  projectId = undefined;
  console.log('PASS: MongoDB API health, list, create, read, update, and delete checks.');
} finally {
  if (projectId) await request(`/projects/${projectId}`, { method: 'DELETE' });
}
