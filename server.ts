import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Spiritual Motivation Generator endpoint
  app.post('/api/spiritual-digest', async (req, res) => {
    const { theme } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        message: `"Barangsiapa mengerjakan kebaikan sekecil apa pun, niscaya dia akan melihat balasan kebaikan itu." (QS. Az-Zalzalah: 7)\n\nSemangat untuk seluruh anggota tim Spiritual Company! Keistiqomahan Anda dalam beribadah dan bekerja adalah fondasi keberkahan perusahaan kita bersama.`,
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Buatkan 1 paragraf singkat pesan apresiasi dan motivasi islami dalam Bahasa Indonesia untuk karyawan perusahaan bertema "${theme || 'Keistiqomahan Ibadah dan Kerja Suci'}". Sertakan 1 potong ayat Al-Qur'an atau Hadits pendek yang relevan. Gaya bahasa hangat, menginspirasi, dan penuh kehangatan persaudaraan.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || 'Semangat menjaga keistiqomahan spiritual company!';
      res.json({ message: text });
    } catch (err) {
      console.error('Error calling Gemini API:', err);
      res.json({
        message: `"Barangsiapa mengerjakan kebaikan sekecil apa pun, niscaya dia akan melihat balasan kebaikan itu." (QS. Az-Zalzalah: 7)\n\nSemangat untuk seluruh anggota tim Spiritual Company! Keistiqomahan Anda dalam beribadah dan bekerja adalah fondasi keberkahan perusahaan kita bersama.`,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Spiritual Company Dashboard Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
