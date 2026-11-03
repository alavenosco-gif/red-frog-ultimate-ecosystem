import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { product, market } = req.body;
    if (!product || !market) {
        return res.status(400).json({ error: 'الرجاء توفير المنتج والسوق.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'مفتاح النظام غير مُعدّ على الخادم.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `أنت مستشار استراتيجي وتجاري صادق وواقعي. 
قم بتحليل أولي لمنتج/خدمة: "${product}" في سوق: "${market}".
قدم استجابة مختصرة وواقعية تتضمن:
1. التحديات الفعلية في هذا السوق.
2. 3 فرضيات لاستهداف الجمهور.
3. توصية باختبار صغير بميزانية محدودة.
تنبيه صارم: لا تضع عوائد مضمونة ولا أرقام فلكية. اجعل التقرير مهنياً وصادقاً ومبنياً على مبدأ الاختبار التجريبي.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return res.status(200).json({ plan: response.text });
    } catch (err) {
        return res.status(500).json({ error: 'فشل توليد الخطة عبر الذكاء الاصطناعي.' });
    }
}
