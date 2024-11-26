import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { id, number } = req.body;

        if (typeof id !== 'string' || typeof number !== 'number') {
            return res.status(400).json({ error: 'Invalid input. Expected id as string and number as number.' });
        }

        try {
            const client = await clientPromise;
            const db = client.db('myDatabase'); // Replace with your database name
            const collection = db.collection('myCollection'); // Replace with your collection name

            const result = await collection.insertOne({ id, number });

            return res.status(200).json({ message: 'Data inserted successfully', data: result.ops[0] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}