export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { product, market } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });
    }

    try {
        const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `قم بتحليل استراتيجي واقعي لمنتج "${product}" في السوق المستهدف "${market}" باللغة العربية، موضحاً التحديات والفرص وفرضيات الاختبار بدون مبالغات أو وعود وهمية.` }]
                }]
            })
        });

        const data = await aiRes.json();
        if (data.candidates && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ plan: text });
        } else {
            return res.status(500).json({ error: 'Invalid response from Gemini API.' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to connect to AI server.' });
    }
}
