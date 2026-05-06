import express from 'express';
import Property from '../models/Property.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new property with uploads
router.post('/', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'documents', maxCount: 5 }]), async (req, res) => {
    try {
        const propertyData = { ...req.body };
        
        if (req.files['images']) {
            const uploadedImages = req.files['images'].map(file => `http://localhost:5000/uploads/${file.filename}`);
            propertyData.images = [...(propertyData.images || []), ...uploadedImages];
        }

        // Handle documents
        let initialDocs = [];
        if (propertyData.documentsData) {
            try {
                initialDocs = JSON.parse(propertyData.documentsData);
            } catch (e) {
                console.error("Docs parse error", e);
            }
        }

        if (req.files['documents']) {
            const uploadedDocs = req.files['documents'].map(file => ({
                title: file.originalname,
                url: `http://localhost:5000/uploads/${file.filename}`
            }));
            propertyData.documents = [...initialDocs, ...uploadedDocs];
        } else {
            propertyData.documents = initialDocs;
        }

        const property = new Property(propertyData);
        const newProperty = await property.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update property with uploads
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
            const uploadedImages = files['images'].map(file => `http://localhost:5000/uploads/${file.filename}`);
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
                url: `http://localhost:5000/uploads/${file.filename}`
            }));
            updateData.documents = [...currentDocs, ...uploadedDocs];
        } else {
            updateData.documents = currentDocs;
        }

        const updated = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE property
router.delete('/:id', async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.json({ message: 'Property deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
