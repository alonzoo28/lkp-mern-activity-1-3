import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  category: { type: String, required: true, enum: ['Health', 'Environment', 'Sports', 'Education', 'Leadership', 'Animal welfare', 'Fundraising'] },
  status: { type: String, required: true, enum: ['Proposed', 'Planned', 'Conducted'], default: 'Proposed' },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  location: { type: String, required: true, trim: true, maxlength: 180 },
  reach: { type: String, required: true, trim: true, maxlength: 180 },
  summary: { type: String, required: true, trim: true, maxlength: 1000 },
  result: { type: String, required: true, trim: true, maxlength: 2000 },
  source: { type: String, default: 'Mock data for Activity 1.3', maxlength: 250 },
  image: { type: String, default: '' },
  icon: { type: String, default: 'heart' },
  sample: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

const Project = mongoose.model('Project', projectSchema);
export default Project;
