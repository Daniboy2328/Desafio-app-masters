import React, { useState } from 'react';

interface VoiceListProps {
  voices: Voice[];
}

interface Voice {
  voice_id: string;
  name: string;
}

const VoiceList: React.FC<VoiceListProps> = ({ voices }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVoices = voices.filter(voice =>
    voice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="voices-section">
      <h1 className="title-left">Vozes Disponíveis</h1>
      <input
        type="text"
        placeholder="Pesquisar vozes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="voices-grid">
        {filteredVoices.map((voice, index) => (
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
