import express from 'express';
import Enquiry from '../models/Enquiry.js';

const router = express.Router();

// @route   POST api/enquiries
// @desc    Submit a new enquiry
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message, propertyId } = req.body;
        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            subject,
            message,
            propertyId
        });
        const savedEnquiry = await newEnquiry.save();
        res.status(201).json(savedEnquiry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'System Protocol Failure: Unable to store enquiry.' });
    }
});

// @route   GET api/enquiries
// @desc    Get all enquiries
// @access  Private (Admin)
router.get('/', async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'System Protocol Failure: Unable to fetch registry.' });
    }
});

// @route   PATCH api/enquiries/:id
// @desc    Update enquiry status
// @access  Private (Admin)
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedEnquiry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'System Protocol Failure: Unable to update status.' });
    }
});

// @route   DELETE api/enquiries/:id
// @desc    Delete an enquiry
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Entry purged from registry.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'System Protocol Failure: Unable to delete entry.' });
    }
});

export default router;
