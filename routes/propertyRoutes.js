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
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const propertyData = { ...req.body };
        
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
            propertyData.images = [...(propertyData.images || []), ...uploadedImages];
        }

        const property = new Property(propertyData);
        const newProperty = await property.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update property with uploads
router.patch('/:id', upload.array('images', 10), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
            let currentImages = [];
            if (typeof updateData.images === 'string') {
                currentImages = [updateData.images];
            } else if (Array.isArray(updateData.images)) {
                currentImages = updateData.images;
            }
            updateData.images = [...currentImages, ...uploadedImages];
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
