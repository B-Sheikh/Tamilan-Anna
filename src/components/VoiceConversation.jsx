import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw, Send, AlertCircle, VolumeX } from 'lucide-react';

export default function VoiceConversation({ apiKey }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'வணக்கம்! நாம் தமிழில் பேசலாமா? நீங்கள் என்னைப் பற்றி அல்லது உங்கள் நாளைப் பற்றி பேசலாம்.' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [error, setError] = useState(null);
  const [autoListen, setAutoListen] = useState(true); // Continuous loop mode
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('default-female');

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const topics = [
    { label: "Introduce Yourself", prompt: "வணக்கம்! உங்களை அறிமுகம் செய்து கொள்ளுங்கள் (உங்க பெயர், ஊர், படிப்பு)." },
    { label: "Favorite Food", prompt: "உங்களுக்கு பிடித்த உணவுகள் என்னென்ன? ஏன் பிடிக்கும்?" },
    { label: "Daily Routine", prompt: "இன்று காலை முதல் நீங்கள் என்ன செய்தீர்கள் என்று சொல்லுங்கள்?" },
    { label: "Weather & Plans", prompt: "இன்று வானிலை எப்படி இருக்கிறது? மாலை என்ன செய்யப் போகிறீர்கள்?" }
  ];

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    // Initialize Web Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const rec = new SpeechRecognition();
      rec.lang = 'ta-IN';
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      rec.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        if (spokenText.trim()) {
          handleUserResponse(spokenText);
        }
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(`Listening issue: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        const taVoices = availableVoices.filter(v => v.lang.toLowerCase().includes('ta'));
        setVoices(taVoices);
      }
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  // Text-to-Speech playback
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const systemVoices = window.speechSynthesis.getVoices();
    
    if (selectedVoiceName === 'default-male') {
      const maleVoice = systemVoices.find(v => (v.lang.toLowerCase().includes('ta')) && 
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('valluvar')));
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.pitch = 0.8; // Lower pitch for simulated male voice
    } else if (selectedVoiceName === 'default-female') {
      const femaleVoice = systemVoices.find(v => (v.lang.toLowerCase().includes('ta')) && 
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('google')));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.pitch = 1.15; // Slightly higher pitch for simulated female voice
    } else {
      const chosenVoice = systemVoices.find(v => v.name === selectedVoiceName);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    utterance.lang = 'ta-IN';
    utterance.rate = 0.8; // Slower rate for clear learner speech delivery

    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-listen trigger once speaking finishes (creates hands-free loop)
      if (autoListen && recognitionRef.current && !loading) {
        setTimeout(() => {
          startListening();
        }, 300);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      try {
        window.speechSynthesis.cancel(); // stop any current speech
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Trigger Gemini API and fallback
  const handleUserResponse = async (text) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    if (!apiKey) {
      // Offline simulated response
      setTimeout(() => {
        let reply = "நான் உங்களுடன் பேச விரும்புகிறேன்! தயவுசெய்து Gemini API சாவியை Render அமைப்புகளில் சேர்க்கவும்.";
        if (text.toLowerCase().includes("வணக்கம்") || text.includes("நலம்")) {
          reply = "வணக்கம்! நான் நன்றாக இருக்கிறேன். நீங்கள் எப்படி இருக்கிறீர்கள்?";
        }
        setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        setLoading(false);
        speakText(reply);
      }, 1200);
      return;
    }

    // Prepare message history formatted for Gemini
    const historyPrompt = messages.slice(-6).map(m => 
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`
    ).join("\n");

    const prompt = `You are a friendly Tamil conversation partner. The user is practicing speaking Tamil.
Here is our conversation history:
${historyPrompt}
User says: "${text}"

Provide a brief, natural response in Tamil script. Do not write any English translation. Keep the sentence structure simple and correct so that a student can easily understand and speak back to you. Speak only in Tamil.`;

    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
    let success = false;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "மன்னிக்கவும், என்னால் புரிந்து கொள்ள முடியவில்லை.";
        setMessages(prev => [...prev, { role: 'assistant', text: reply.trim() }]);
        success = true;
        setLoading(false);
        speakText(reply.trim());
        break;
      } catch (err) {
        console.warn(`Continuous voice chat failed on model ${model}:`, err.message);
      }
    }

    if (!success) {
      const errorMsg = "இணைப்பு பிழை. மீண்டும் முயற்சிக்கவும்.";
      setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }]);
      setLoading(false);
      speakText(errorMsg);
    }
  };

  const handleTopicSelect = (prompt) => {
    speakText(prompt);
    setMessages([{ role: 'assistant', text: prompt }]);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', height: 'calc(100vh - 190px)' }}>
      {/* Left Column: Chat Pane */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', background: 'white', height: '100%', overflow: 'hidden', padding: '0', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--panel-border)', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', background: isListening ? 'var(--error)' : 'var(--success)', borderRadius: '50%', display: 'inline-block', animation: isListening ? 'pulse 1.2s infinite' : 'none' }}></span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>இருவழி தமிழ் உரையாடல் (Voice Chat)</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isListening ? 'Listening for your voice...' : isSpeaking ? 'Tutor Anna is speaking...' : 'Ready to listen'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
            >
              <option value="default-female">👩 Default Female Voice</option>
              <option value="default-male">👨 Default Male Voice (Pitch 0.8x)</option>
              {voices.map((v, i) => (
                <option key={i} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                setMessages([{ role: 'assistant', text: 'வணக்கம்! நாம் தமிழில் பேசலாமா?' }]);
              }}
              className="module-action-btn"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              Reset Chat
            </button>
          </div>
        </div>

        {/* Message logs */}
        <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: '#fcfcfd' }}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              style={{
                maxWidth: '80%', 
                padding: '12px 16px', 
                borderRadius: '4px', 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'var(--accent-secondary)' : '#ffffff', 
                color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                border: msg.role === 'user' ? 'none' : '1px solid #cbd5e1'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                  {msg.role === 'user' ? 'YOU (பேச்சு)' : 'TUTOR ANNA'}
                </span>
                {msg.role === 'assistant' && (
                  <button onClick={() => speakText(msg.text)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: 0 }}>
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px 16px', borderRadius: '4px' }}>
              <span className="dot-pulse" style={{ background: 'var(--accent-primary)' }}></span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Anna is processing response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Listening controls banner */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--panel-border)', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {error && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--error)', fontSize: '0.8rem' }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Auto listen toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={autoListen} 
                onChange={(e) => setAutoListen(e.target.checked)} 
                style={{ width: '14px', height: '14px' }}
              />
              <span>Hands-free Loop (Auto-listen when Anna stops speaking)</span>
            </label>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Press microphone to speak Tamil
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Mic Button */}
            {recognitionSupported ? (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={isListening ? "btn-secondary" : "btn-primary"}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.4)' : 'none',
                  background: isListening ? 'var(--error)' : 'var(--accent-primary)',
                  borderColor: isListening ? 'var(--error)' : 'var(--accent-primary)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
            ) : (
              <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--error)', fontSize: '0.8rem', borderRadius: '4px' }}>
                Chrome or Edge browser required for Speech Recognition features.
              </div>
            )}

            {/* Manual text input box */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleUserResponse(inputVal); }} 
              style={{ display: 'flex', gap: '8px', flexGrow: 1 }}
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Or type your message in Tamil / English..."
                className="form-input"
                style={{ flexGrow: 1, padding: '10px 14px', fontSize: '0.9rem', borderRadius: '4px' }}
                disabled={loading}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: '10px 18px', borderRadius: '4px' }}
                disabled={loading || !inputVal.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Help pane */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Starter topics */}
        <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Select Conversation Starter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px', lineHeight: '1.4' }}>
            Choose any topic below. Tutor Anna will start by speaking the prompt out loud in Tamil:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topics.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicSelect(t.prompt)}
                className="syllabus-module-card"
                style={{ textAlign: 'left', cursor: 'pointer', padding: '12px', border: '1px solid #cbd5e1', transition: 'all 0.15s', background: '#ffffff', borderRadius: '4px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t.label}</span>
                  <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
                </div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {t.prompt}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Guide info */}
        <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>🎤 Hands-free Speak Loop</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            When **Hands-free Loop** is checked:
            <ol style={{ margin: '6px 0 0 0', paddingLeft: '16px' }}>
              <li>Press the microphone button once and say something in Tamil.</li>
              <li>Wait for Tutor Anna to answer you in Tamil.</li>
              <li><strong>As soon as Anna stops speaking, the app automatically starts listening again!</strong></li>
              <li>You can speak back continuously without clicking any buttons, creating a natural flow.</li>
            </ol>
          </p>
        </div>
      </div>
    </div>
  );
}
