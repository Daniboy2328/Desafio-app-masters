import type { NextApiRequest, NextApiResponse } from 'next';
import { ElevenLabsClient } from 'elevenlabs';
import { createWriteStream, promises as fsPromises } from 'fs'; 
import { join } from 'path';
import fetch from 'node-fetch'; 

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY as string,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text, voiceId, stability, similarityBoost, style, languageCode } = req.body;

    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Falta o texto ou o ID da voz' });
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: stability || 0.75,
            similarity_boost: similarityBoost || 0.75,
            style: style || 0,
            use_speaker_boost: true,
          },
        }),
      };

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao gerar áudio: ${errorText}`);
      }

      const audioStream = response.body;

      const tempDir = join(process.cwd(), 'public', 'audio');
      await fsPromises.mkdir(tempDir, { recursive: true });
      const filePath = join(tempDir, `${voiceId}.mp3`);
      const fileStream = createWriteStream(filePath);

      if (audioStream) {
        audioStream.pipe(fileStream);

        await new Promise((resolve, reject) => {
          fileStream.on('finish', resolve);
          fileStream.on('error', reject);
        });

        res.status(200).json({ audioUrl: `/audio/${voiceId}.mp3` });
      } else {
        throw new Error('Erro ao receber o stream de áudio');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao gerar o áudio:', error.message);
        res.status(500).json({ error: 'Erro ao gerar o áudio', details: error.message });
      } else {
        console.error('Erro desconhecido:', error);
        res.status(500).json({ error: 'Erro desconhecido', details: 'Ocorreu um erro desconhecido' });
      }
    }
  } else if (req.method === 'GET') {
    try {
      const response = await elevenlabs.voices.getAll();
      const voices = response.voices;
      res.status(200).json({ voices });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao obter as vozes:', error.message);
        res.status(500).json({ error: 'Erro ao obter as vozes', details: error.message });
      } else {
        console.error('Erro desconhecido:', error);
        res.status(500).json({ error: 'Erro desconhecido', details: 'Ocorreu um erro desconhecido' });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}