import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ['Ongoing', 'Upcoming', 'Completed', 'Sold Out'], default: 'Ongoing' },
    images: [{ type: String }], // Gallery storage
    socialLink: { type: String }, // Optional project site or social link
    description: { type: String },
    completedDate: { type: String },
    units: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
