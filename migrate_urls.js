import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import Property from './models/Property.js';
import Blog from './models/Blog.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mld_db';
const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
const oldURL = 'http://localhost:5000';

async function migrate() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Helper to replace URLs in strings or arrays
        const replaceURL = (val) => {
            if (typeof val === 'string') return val.replace(oldURL, backendURL);
            if (Array.isArray(val)) return val.map(item => typeof item === 'string' ? item.replace(oldURL, backendURL) : item);
            return val;
        };

        // Migrate Projects
        const projects = await Project.find();
        for (let p of projects) {
            p.images = replaceURL(p.images);
            p.documents = p.documents.map(doc => ({
                ...doc,
                url: replaceURL(doc.url)
            }));
            await p.save();
        }
        console.log(`Migrated ${projects.length} projects`);

        // Migrate Properties
        const properties = await Property.find();
        for (let p of properties) {
            p.images = replaceURL(p.images);
            p.documents = p.documents.map(doc => ({
                ...doc,
                url: replaceURL(doc.url)
            }));
            await p.save();
        }
        console.log(`Migrated ${properties.length} properties`);

        // Migrate Blogs
        const blogs = await Blog.find();
        for (let b of blogs) {
            b.image = replaceURL(b.image);
            b.images = replaceURL(b.images);
            await b.save();
        }
        console.log(`Migrated ${blogs.length} blogs`);

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
