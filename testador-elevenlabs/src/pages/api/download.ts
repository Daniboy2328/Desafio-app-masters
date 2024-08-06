import type { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream } from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Caminho inválido para o arquivo' });
  }

  try {
    const stream = createReadStream(path);

    res.setHeader('Content-Type', 'audio/mpeg');
    stream.pipe(res);

    stream.on('error', (error) => {
      console.error('Erro ao enviar o arquivo:', error);
      res.status(500).json({ error: 'Erro ao enviar o arquivo' });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao enviar o arquivo:', error.message);
      res.status(500).json({ error: 'Erro ao enviar o arquivo', details: error.message });
    } else {
      console.error('Erro desconhecido:', error);
      res.status(500).json({ error: 'Erro desconhecido', details: 'Ocorreu um erro desconhecido' });
    }
  }
}
