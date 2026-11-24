import test from 'node:test';
import assert from 'node:assert/strict';
import Project from '../server/models/Project.js';

const validProject = {
  title: 'Test community project',
  category: 'Education',
  status: 'Proposed',
  date: '2026-11-24',
  location: 'Paco, Obando, Bulacan',
  reach: 'Mock data',
  summary: 'A sample project for model validation.',
  result: 'Results to be confirmed.'
};

test('accepts a valid mock project', async () => {
  await assert.doesNotReject(new Project(validProject).validate());
});

test('rejects an unsupported category', async () => {
  await assert.rejects(new Project({ ...validProject, category: 'Unknown' }).validate(), { name: 'ValidationError' });
});

test('rejects a date outside YYYY-MM-DD format', async () => {
  await assert.rejects(new Project({ ...validProject, date: '11/24/2026' }).validate(), { name: 'ValidationError' });
});

test('requires a project title', async () => {
  const { title, ...withoutTitle } = validProject;
  await assert.rejects(new Project(withoutTitle).validate(), { name: 'ValidationError' });
});
