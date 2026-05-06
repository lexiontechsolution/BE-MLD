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

// GET single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new project with uploads
router.post('/', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'documents', maxCount: 5 }]), async (req, res) => {
    try {
        const projectData = { ...req.body };
        
        // Handle images
        if (req.files['images']) {
            const uploadedImages = req.files['images'].map(file => `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`);
            projectData.images = [...(projectData.images || []), ...uploadedImages];
        }

        // Handle documents
        let initialDocs = [];
        if (projectData.documentsData) {
            try {
                initialDocs = JSON.parse(projectData.documentsData);
            } catch (e) {
                console.error("Docs parse error", e);
            }
        }

        if (req.files['documents']) {
            const uploadedDocs = req.files['documents'].map(file => ({
                title: file.originalname,
                url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`
            }));
            projectData.documents = [...initialDocs, ...uploadedDocs];
        } else {
            projectData.documents = initialDocs;
        }

        const project = new Project(projectData);
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update project with uploads
router.patch('/:id', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'documents', maxCount: 5 }]), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Handle image mapping
        const imagesData = updateData['images[]'] || updateData.images;
        let currentImages = [];
        if (imagesData) {
            currentImages = Array.isArray(imagesData) ? imagesData : [imagesData];
        }

        // Defensive check for files
        const files = req.files || {};

        if (files['images']) {
            const uploadedImages = files['images'].map(file => `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`);
            updateData.images = [...currentImages, ...uploadedImages];
        } else {
            updateData.images = currentImages;
        }

        // Handle documents
        let currentDocs = [];
        try {
            if (updateData.documentsData) {
                currentDocs = typeof updateData.documentsData === 'string' ? JSON.parse(updateData.documentsData) : updateData.documentsData;
            }
        } catch (e) {
            console.error("Docs parsing error", e);
        }

        if (files['documents']) {
            const uploadedDocs = files['documents'].map(file => ({
                title: file.originalname,
                url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${file.filename}`
            }));
            updateData.documents = [...currentDocs, ...uploadedDocs];
        } else {
            updateData.documents = currentDocs;
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
