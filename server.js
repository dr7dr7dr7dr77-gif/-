import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "اكتب سؤالك أولاً." });
    if (message.length > 4000) return res.status(400).json({ error: "السؤال طويل جداً." });
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "أضف OPENAI_API_KEY إلى متغيرات البيئة في الاستضافة." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "أنت VANTA AI، مساعد ودود ومفيد. أجب بلغة المستخدم، واستخدم العربية بلهجة بسيطة عندما يكتب بالعربية.",
        input: message
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(502).json({ error: "خدمة الذكاء الاصطناعي رفضت الطلب. تحقق من إعدادات API." });
    }
    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n");
    res.json({ reply: reply || "ما وصلني رد نصي. جرّب مرة ثانية." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ في الخادم." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`VANTA AI running on port ${port}`));
