import clientPromise from '../../lib/mongodb';

// Predefined access token
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Validate the access token
        const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
        if (!token || token !== ACCESS_TOKEN) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or missing access token' });
        }

        try {
            // Connect to MongoDB
            const client = await clientPromise;
            const db = client.db('myDatabase'); // Replace with your database name

            // Access the collection and fetch data
            const collection = db.collection('myCollection'); // Replace with your collection name
            const data = await collection.find({}).toArray(); // Fetch all documents

            // Return the fetched data
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.error('Error reading from MongoDB:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch data from the database' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
    }
}