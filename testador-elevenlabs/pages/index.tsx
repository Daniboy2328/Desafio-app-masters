import { useState, useEffect } from 'react';
interface Voice {
  voice_id: string;
  name: string;
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
        const response = await fetch('/api/speak');
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
    <div className="container"> 
      <div className="generator-section">
        <div className="generator-card">
          <h1>Gerar Áudio</h1>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o texto"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Áudio'}
          </button>
          {errorMessage && <p>{errorMessage}</p>}
          {currentVoice && (
            <div>
              <h2>{currentVoice.name}</h2>
              {audioUrl && (
                <>
                  <audio controls src={audioUrl || ''}>
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                  <a
                    href={audioUrl || ''}
                    download={`audio_${currentVoice.voice_id}.mp3`}
                  >
                    <button>
                      Download
                    </button>
                  </a>
                </>
              )}
              <div className="buttons-container">
                <button
                  onClick={handlePrevVoice}
                  disabled={currentIndex === 0}
                >
                  Anterior
                </button>
                <button
                  onClick={handleNextVoice}
                  disabled={currentIndex === voices.length - 1}
                >
                  Próxima Voz
                </button>
              </div>
              <p>Total de vozes: {totalVoices}</p>
            </div>
          )}
        </div>
      </div>
      <div className="voices-section">
        <h1>Vozes Disponíveis</h1>
        <div className="voices-grid">
          {voices.map((voice, index) => (
            <div key={voice.voice_id} className="voice-card">
              <h2>{voice.name}</h2>
              <audio controls>
                <source src={`/assets/voices/audio_${index + 1}.mp3`} type="audio/mp3" />
                Seu navegador não suporta o elemento de áudio.
              </audio>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
