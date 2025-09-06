"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechToTextReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  permission: "granted" | "denied" | "prompt" | "unknown";
  error: string | null;
  startListening: (options?: { lang?: string; continuous?: boolean }) => void;
  stopListening: () => void;
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Feature detection and permission check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Feature detection
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SR);

    // Permission detection (best effort)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "microphone" as PermissionName })
        .then((permissionStatus) => {
          setPermission(permissionStatus.state as "granted" | "denied" | "prompt");
          
          permissionStatus.onchange = () => {
            setPermission(permissionStatus.state as "granted" | "denied" | "prompt");
          };
        })
        .catch(() => {
          setPermission("unknown");
        });
    }
  }, []);

  const startListening = useCallback(({ lang = "en-US", continuous = false } = {}) => {
    if (!isSupported) {
      setError("Speech recognition not supported");
      return;
    }

    // Clear previous transcript data when starting fresh
    setTranscript('');
    setInterimTranscript('');

    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SR();
      
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.continuous = continuous;

             recognition.onstart = () => {
         setIsListening(true);
         setError(null);
       };

       recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (final) {
          setTranscript(prev => {
            const newTranscript = (prev + ' ' + final).trim().replace(/\s+/g, ' ');
            return newTranscript;
          });
        }
        
        setInterimTranscript(interim);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

             recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "aborted") {
          console.warn("Speech recognition aborted by user");
          return;
        }
        
        if (event.error === "no-speech") {
          console.warn("No speech detected, stopping recognition");
          setIsListening(false);
          return;
        }
        
        if (event.error === "not-allowed") {
          setError("Microphone permission denied");
          setIsListening(false);
          return;
        }
        
        if (event.error === "audio-capture") {
          setError("No microphone available");
          setIsListening(false);
          return;
        }
        
        console.error("Speech recognition error:", event.error);
        setError(String(event.error));
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
         } catch (error) {
       setError(error instanceof Error ? error.message : "Failed to start speech recognition");
     }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setInterimTranscript('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
                 try {
           recognitionRef.current.stop();
           recognitionRef.current.abort();
         } catch {
           // Ignore cleanup errors
         }
      }
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    permission,
    error,
    startListening,
    stopListening,
  };
} 