"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionOptions {
  onFinalResult?: (text: string) => void;
}

interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  interimTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);
  const noSpeechStreakRef = useRef(0);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    // Feature detection can only run client-side after mount; the server always
    // renders the unsupported (mic hidden) state to keep hydration consistent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSupported(true);

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "zh-TW";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      noSpeechStreakRef.current = 0;
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimTranscript(interim);
      if (final) optionsRef.current.onFinalResult?.(final);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        shouldRestartRef.current = false;
        setIsListening(false);
        setError("麥克風使用權限被拒絕，請改用打字輸入。");
      } else if (event.error === "no-speech") {
        // Continuous mode fires this on brief pauses too, so only warn once it
        // keeps happening with zero audio ever detected (likely wrong/blocked mic).
        noSpeechStreakRef.current += 1;
        if (noSpeechStreakRef.current >= 3) {
          shouldRestartRef.current = false;
          setIsListening(false);
          setError("沒有偵測到聲音，請確認麥克風權限、裝置選擇是否正確，或改用打字輸入。");
        }
      } else if (event.error === "audio-capture") {
        shouldRestartRef.current = false;
        setIsListening(false);
        setError("找不到可用的麥克風，請確認裝置已連接，或改用打字輸入。");
      } else {
        shouldRestartRef.current = false;
        setIsListening(false);
        setError("語音辨識發生問題，請改用打字輸入。");
      }
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          setError("語音辨識發生問題，請改用打字輸入。");
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.stop();
    };
  }, []);

  const start = useCallback(() => {
    setError(null);
    setInterimTranscript("");
    noSpeechStreakRef.current = 0;
    shouldRestartRef.current = true;
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch {
      // Most commonly an InvalidStateError from double-clicking or a stale
      // instance already running; surface it instead of hanging silently.
      shouldRestartRef.current = false;
      setIsListening(false);
      setError("語音辨識發生問題，請改用打字輸入。");
    }
  }, []);

  const stop = useCallback(() => {
    shouldRestartRef.current = false;
    setIsListening(false);
    setInterimTranscript("");
    recognitionRef.current?.stop();
  }, []);

  return { isSupported, isListening, interimTranscript, error, start, stop };
}
