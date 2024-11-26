export default function handler(req, res) {
    if (req.method === 'GET') {
        // Generate a random time between 0.001 and 59.99 seconds
        const randomTime = (Math.random() * (59.99 - 0.01) + 0.01).toFixed(2);

        return res.status(200).json({ randomTime });
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}