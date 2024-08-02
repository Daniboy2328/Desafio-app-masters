import { useState, useEffect } from 'react';

interface Voice {
  voice_id: string;
  name: string;
  // Adicione outros campos conforme necessário
}

export default function Home() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalVoices, setTotalVoices] = useState<number>(0);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/speak'); // GET method para obter as vozes
        if (!response.ok) {
          throw new Error('Erro ao obter as vozes');
        }
        const data = await response.json();
        setVoices(data.voices || []);
        setTotalVoices(data.voices.length || 0);
      } catch (error) {
        console.error('Erro ao obter as vozes:', error);
        setErrorMessage('Houve um erro ao obter as vozes. Tente novamente mais tarde.');
      }
    };

    fetchVoices();
  }, []);

  // Chamamos handleSubmit sempre que currentIndex mudar e se o texto não estiver vazio
  useEffect(() => {
    if (text.trim() && voices.length > 0) {
      handleSubmit();
    }
  }, [currentIndex]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Por favor, insira um texto.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const currentVoice = voices[currentIndex];
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: currentVoice.voice_id }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar o áudio');
      }

      const data = await response.json();
      setAudioUrl(data.audioUrl || null);
    } catch (error) {
      console.error('Erro ao gerar o áudio:', error);
      setErrorMessage('Houve um erro ao gerar o áudio. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextVoice = () => {
    if (currentIndex < voices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevVoice = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentVoice = voices[currentIndex];

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite o texto"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Gerando...' : 'Gerar Áudio'}
      </button>
      {errorMessage && <p>{errorMessage}</p>}
      {currentVoice && (
        <div>
          <h2>{currentVoice.name}</h2>
          <audio controls src={audioUrl || ''} />
          <a href={audioUrl || ''} download={`audio_${currentVoice.voice_id}.mp3`}>
            <button>Download</button>
          </a>
          <div>
            <button onClick={handlePrevVoice} disabled={currentIndex === 0}>
              Anterior
            </button>
            <button onClick={handleNextVoice} disabled={currentIndex === voices.length - 1}>
              Próxima Voz
            </button>
          </div>
          <p>Total de vozes: {totalVoices}</p>
        </div>
      )}
    </div>
  );
}
