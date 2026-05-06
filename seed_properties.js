import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';

dotenv.config();

const properties = [
    {
        title: "Milestone Signature Villas",
        type: "Villa",
        price: "₹1.2 Cr",
        location: "Coimbatore, Tamil Nadu",
        description: "Luxury villas with premium amenities and sustainable design.",
        bedrooms: 4,
        bathrooms: 4,
        sqft: 3500,
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"],
        status: "Ongoing",
        isFeatured: true
    },
    {
        title: "Emerald Green Plots",
        type: "Plot",
        price: "₹45 Lakhs",
        location: "Madurai, Tamil Nadu",
        description: "Premium DTCP approved plots in a fast-growing neighborhood.",
        sqft: 2400,
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"],
        status: "Upcoming",
        isFeatured: true
    },
    {
        title: "Milestone Heights",
        type: "Apartment",
        price: "₹75 Lakhs",
        location: "Kochi, Kerala",
        description: "Modern apartments with stunning views and 24/7 security.",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200"],
        status: "Ongoing",
        isFeatured: true
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Property.deleteMany({});
        await Property.insertMany(properties);
        console.log('Properties seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
