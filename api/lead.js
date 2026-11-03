export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, contact, details } = req.body;
    if (!name || !contact || !details) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة.' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'إعدادات تليجرام غير مكتملة على السيرفر.' });
    }

    const text = `🚨 طلب عميل جديد حقيقي:\n👤 الاسم: ${name}\n📞 التواصل: ${contact}\n📝 التفاصيل: ${details}`;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        });

        const data = await response.json();
        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'رفضت بوابة تليجرام الرسالة.' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'فشل الاتصال بخدمة تليجرام.' });
    }
}
