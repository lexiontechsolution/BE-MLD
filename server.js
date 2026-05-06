console.log('--- SYSTEM INITIALIZING ---');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import Property from './models/Property.js';
import Project from './models/Project.js';
import Enquiry from './models/Enquiry.js';

// Route imports
import propertyRoutes from './routes/propertyRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // For property images

// Basic DB Connection (using local or Atlas URI from .env)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mld_db';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Milestone Intelligence: Secured MongoDB Connection'))
    .catch(err => console.error('❌ Milestone Alert: DB Connection Failed', err));

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Milestone Land Developers API is operational." });
});

app.get('/api/stats', async (req, res) => {
    try {
        const leads = await Enquiry.countDocuments();
        const estates = await Property.countDocuments();
        const projects = await Project.countDocuments();
        res.json({ leads, estates, projects });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.use('/api/properties', propertyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/blogs', blogRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('--- INTERNAL SYSTEM ERROR ---');
    console.error(err.stack);
    res.status(500).json({ 
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 System Online: Protocol active on port ${PORT}`);
});
