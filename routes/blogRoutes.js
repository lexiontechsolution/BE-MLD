import express from 'express';
import Blog from '../models/Blog.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE blog
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    try {
        const image = req.files['image'] ? `http://localhost:5000/uploads/${req.files['image'][0].filename}` : req.body.image;
        const images = req.files['images'] ? req.files['images'].map(file => `http://localhost:5000/uploads/${file.filename}`) : [];

        const blog = new Blog({
            ...req.body,
            image,
            images
        });

        const newBlog = await blog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE blog
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const updateData = { ...req.body };
        
        if (req.files['image']) {
            updateData.image = `http://localhost:5000/uploads/${req.files['image'][0].filename}`;
        }
        
        if (req.files['images']) {
            updateData.images = req.files['images'].map(file => `http://localhost:5000/uploads/${file.filename}`);
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE blog
router.delete('/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
