import { useState, useEffect } from 'react';
import AudioGenerator from '../components/AudioGenerator';
import VoiceList from '../components/VoiceList';

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

  return (
    
    <div className="container">
      <AudioGenerator 
        text={text}
        setText={setText}
        voices={voices}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        audioUrl={audioUrl}
        setAudioUrl={setAudioUrl}
        loading={loading}
        setLoading={setLoading}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        totalVoices={totalVoices}
      />
      <VoiceList voices={voices} />
    </div>
  );
}
