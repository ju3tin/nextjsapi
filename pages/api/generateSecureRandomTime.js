// Predefined access token
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Validate the access token
        const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
        if (!token || token !== ACCESS_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized: Invalid or missing access token' });
        }

        // Generate a random time between 0.001 and 59.99 seconds
        const randomTime = (Math.random() * (59.99 - 0.01) + 0.01).toFixed(2);

        return res.status(200).json({ randomTime });
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}