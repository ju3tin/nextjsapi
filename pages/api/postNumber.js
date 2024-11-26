import clientPromise from '../../lib/mongodb';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
    origin: '*', // Allow all origins (adjust as needed for security)
    methods: ['POST'], // Only allow POST requests
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// Predefined access token (or replace this with a JWT validation logic)
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export default async function handler(req, res) {
    // Run CORS middleware
    await runMiddleware(req, res, cors);

    // Validate the access token
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
    if (!token || token !== ACCESS_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing access token' });
    }

    if (req.method === 'POST') {
        const { id, number } = req.body;

        // Validate input
        if (typeof id !== 'string' || typeof number !== 'number') {
            return res.status(400).json({ error: 'Invalid input. Expected id as string and number as number.' });
        }

        try {
            // Connect to MongoDB
            const client = await clientPromise;
            const db = client.db('myDatabase'); // Replace with your database name
            const collection = db.collection('myCollection'); // Replace with your collection name

            // Insert data into the collection
            const result = await collection.insertOne({ id, number });

            return res.status(200).json({ message: 'Data inserted successfully', data: result.ops[0] });
        } catch (error) {
            console.error('Error saving to MongoDB:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}