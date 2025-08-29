import * as dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI || process.env.OPENAI_API_KEY });

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/dream', async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const aiResponse = await openai.images.generate({
            model: 'gpt-image-1',
            prompt,
            n: 1,
            size: '1024x1024',
        });
        const imageB64 = aiResponse.data[0]?.b64_json;
        const imageUrl = aiResponse.data[0]?.url;
        const image = imageUrl || (imageB64 ? `data:image/png;base64,${imageB64}` : null);
        if (!image) {
            return res.status(500).send({ error: 'No image returned from OpenAI' });
        }
        res.send({ image });
    } catch (err) {
        console.error('OpenAI image generation error:', err);
        res.status(500).send({ error: 'Failed to generate image' });
    }
});

app.listen(8080, () => console.log("make art on http://localhost:8080/dream"));