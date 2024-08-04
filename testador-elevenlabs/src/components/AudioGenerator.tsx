import React, { useEffect } from 'react';

interface AudioGeneratorProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  voices: Voice[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  audioUrl: string | null;
  setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  totalVoices: number;
}

interface Voice {
  voice_id: string;
  name: string;
}

const AudioGenerator: React.FC<AudioGeneratorProps> = ({
  text,
  setText,
  voices,
  currentIndex,
  setCurrentIndex,
  audioUrl,
  setAudioUrl,
  loading,
  setLoading,
  errorMessage,
  setErrorMessage,
  totalVoices,
}) => {
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
    <div className="generator-section">
      <h1 className="title-right">Testador de vozes <br/> do Elevenlabs!</h1>
      <div className="generator-card">
      
        <h2 className="title-card">Gerar Áudio</h2>
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
            {audioUrl && (
              <>
                <audio controls src={audioUrl || ''}>
                  Seu navegador não suporta o elemento de áudio.
                </audio>
                <a href={audioUrl || ''} download={`audio_${currentVoice.voice_id}.mp3`}>
                  <button>Download</button>
                </a>
              </>
            )}
            <div className="buttons-container">
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
    </div>
  );
};

export default AudioGenerator;
