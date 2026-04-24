import mongoose from 'mongoose';
import Blog from './models/Blog.js';

const mongoURI = 'mongodb://localhost:27017/mld_db';

const sampleImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600607687940-c52af0369996?auto=format&fit=crop&q=80&w=1200'
];

async function seed() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to DB');

        const blogs = await Blog.find();
        if (blogs.length === 0) {
            console.log('No blogs found to update.');
            process.exit();
        }

        for (let blog of blogs) {
            blog.images = sampleImages;
            await blog.save();
            console.log(`Updated blog: ${blog.title}`);
        }

        console.log('Success: All blogs updated with multiple images.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
