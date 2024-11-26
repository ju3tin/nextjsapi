import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
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
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}