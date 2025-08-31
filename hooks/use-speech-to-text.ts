// Devcanva — chat UI step (week 1-2) — client UI only
// Client-side speech-to-text hook using Web Speech API

import { useState, useCallback, useEffect } from 'react';

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const recognition = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    // @ts-ignore - Web Speech API types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    return recognition;
  }, []);

  const startListening = useCallback(() => {
    const rec = recognition();
    if (!rec) return;

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    rec.onerror = (event: any) => {
      if (event.error === 'aborted') {
        console.warn('Speech recognition aborted by user');
      } else {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
  }, [recognition]);

  const stopListening = useCallback(() => {
    const rec = recognition();
    if (rec) {
      rec.stop();
    }
    setIsListening(false);
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
} 