import express from 'express';
import Project from '../models/Project.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new project with uploads
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const projectData = { ...req.body };
        
        // If files were uploaded, add their paths to images array
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
            // Combine with any URL images sent in body if they exist
            projectData.images = [...(projectData.images || []), ...uploadedImages];
        }

        const project = new Project(projectData);
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update project with uploads
router.patch('/:id', upload.array('images', 10), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Handle image mapping if files were uploaded
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
            // If images were sent as a string (from existing data), parse them
            let currentImages = [];
            if (typeof updateData.images === 'string') {
                currentImages = [updateData.images];
            } else if (Array.isArray(updateData.images)) {
                currentImages = updateData.images;
            }
            updateData.images = [...currentImages, ...uploadedImages];
        }

        const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE project
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
