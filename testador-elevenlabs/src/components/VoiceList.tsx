import React from 'react';

interface VoiceListProps {
  voices: Voice[];
}

interface Voice {
  voice_id: string;
  name: string;
}

const VoiceList: React.FC<VoiceListProps> = ({ voices }) => {
  return (
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
  );
};

export default VoiceList;
