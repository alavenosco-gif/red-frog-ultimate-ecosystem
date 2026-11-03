export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, contact, details } = req.body;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Telegram environment variables missing.' });
    }

    const text = `🚨 طلب جديد عبر المنظومة:\nالاسم: ${name}\nالتواصل: ${contact}\nالتفاصيل: ${details}`;
    
    try {
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text })
        });
        const data = await tgRes.json();
        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Telegram rejected request.' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Network fetch error.' });
    }
}
