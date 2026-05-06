import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Apartment', 'Villa', 'Plot', 'Commercial'], required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    sqft: { type: Number },
    images: [{ type: String }], // URLs to images
    documents: [{ 
        title: { type: String },
        url: { type: String }
    }], // PDF storage
    socialLink: { type: String }, // Optional virtual tour or social link 
    status: { type: String, enum: ['Ongoing', 'Upcoming', 'Completed'], default: 'Ongoing' },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
