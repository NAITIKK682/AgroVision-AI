export class VoiceService {
  constructor() {
    this.isListening = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  // Start listening for speech
  startListening(onResult, onError, lang = 'en-IN') {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported'));
      return;
    }

    this.recognition.lang = lang;
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event) => {
      onError(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      onError(error);
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Speak text
  speak(text, lang = 'en-IN', onEnd = null) {
    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Slower for rural comprehension
    utterance.pitch = 0.9;
    utterance.volume = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synthesis.speak(utterance);
    return utterance;
  }

  // Check if speech is supported
  isSpeechSupported() {
    return 'webkitSpeechRecognition' in window && 'speechSynthesis' in window;
  }

  // Get available voices
  getVoices() {
    return this.synthesis.getVoices();
  }
}

export const voiceService = new VoiceService();