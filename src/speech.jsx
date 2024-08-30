// SpeechRecognitionComponent.jsx
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const SpeechRecognitionComponent = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [textResponse, setTextResponse] = useState('');

  const handleSpeechRecognition = () => {
    SpeechRecognition.startListening();
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    processTranscript(transcript);
  };

  const processTranscript = async (transcript) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions', // Replace with your API endpoint
        {
          prompt: transcript,
          model: "text-davinci-003", // Replace with the appropriate model
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setTextResponse(response.data.choices[0].text);
    } catch (error) {
      console.error("Error processing transcript:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSpeechRecognition}>Start Listening</button>
      <button onClick={handleStop}>Stop Listening</button>
      <p>Transcript: {transcript}</p>
      <p>Response: {textResponse}</p>
    </div>
  );
};

export default SpeechRecognitionComponent;
