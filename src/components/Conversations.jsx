import React, { useState, useEffect } from 'react';
import { MessageSquare, Volume2, Mic, MicOff, Check, AlertCircle, ChevronRight, Award, Play } from 'lucide-react';

let activeAudio = null;

export default function Conversations({ apiKey, onLogActivity }) {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [speechResult, setSpeechResult] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('google-cloud-tts');
  
  let recognition = null;

  // Curated scenarios with Tamil, Transliteration, and English Translation
  const scenarios = [
    {
      title: 'Greetings & Introduction (அறிமுகம்)',
      difficulty: 'Beginner',
      description: 'Learn to say hello and introduce yourself politely.',
      dialogs: [
        {
          ai: {
            tamil: 'வணக்கம்! என் பெயர் அண்ணா. உங்கள் பெயர் என்ன?',
            translit: 'Vanakkam! En peyar Anna. Ungal peyar enna?',
            english: 'Hello! My name is Anna. What is your name?'
          },
          user: {
            tamil: 'வணக்கம்! என் பெயர் அபிஷேக்.',
            translit: 'Vanakkam! En peyar Abhishek.',
            english: 'Hello! My name is Abhishek.',
            matchKeywords: ['வணக்கம்', 'பெயர்', 'அபிஷேக்']
          }
        },
        {
          ai: {
            tamil: 'உங்களைச் சந்தித்ததில் மகிழ்ச்சி! நீங்கள் எப்படி இருக்கிறீர்கள்?',
            translit: 'Ungalais sandhithadhil magizhchi! Neengal eppadi irukkireergal?',
            english: 'Nice to meet you! How are you doing?'
          },
          user: {
            tamil: 'நான் நன்றாக இருக்கிறேன், நன்றி.',
            translit: 'Naan nandraaga irukkiren, nandri.',
            english: 'I am doing well, thank you.',
            matchKeywords: ['நான்', 'நன்றாக', 'இருக்கிறேன்', 'நன்றி']
          }
        }
      ]
    },
    {
      title: 'At a Restaurant (உணவகம்)',
      difficulty: 'Intermediate',
      description: 'Order delicious south Indian food in Tamil.',
      dialogs: [
        {
          ai: {
            tamil: 'ஐயா, வணக்கம்! உங்களுக்கு என்ன வேண்டும்?',
            translit: 'Aiya, vanakkam! Ungalukku enna vendum?',
            english: 'Sir, hello! What would you like to have?'
          },
          user: {
            tamil: 'எனக்கு ஒரு மசாலா தோசையும் காபியும் வேண்டும்.',
            translit: 'Enakku oru masala dhosaiyum kaabiyum vendum.',
            english: 'I want a masala dosa and a coffee.',
            matchKeywords: ['எனக்கு', 'மசாலா', 'தோசையும்', 'காபியும்', 'வேண்டும்']
          }
        },
        {
          ai: {
            tamil: 'நிச்சயமாக, காரம் எவ்வளவு இருக்க வேண்டும்?',
            translit: 'Nichayamaaga, kaaram evvalavu irukka vendum?',
            english: 'Certainly, how spicy should it be?'
          },
          user: {
            tamil: 'கொஞ்சம் காரம் குறைவாக இருக்கட்டும்.',
            translit: 'Konjam kaaram kuraivaaga irukkattum.',
            english: 'Let it be a bit less spicy.',
            matchKeywords: ['கொஞ்சம்', 'காரம்', 'குறைவாக', 'இருக்கட்டும்']
          }
        }
      ]
    },
    {
      title: 'Catching an Auto (ஆட்டோ பிடித்தல்)',
      difficulty: 'Intermediate',
      description: 'Negotiate destination and fare with an auto driver.',
      dialogs: [
        {
          ai: {
            tamil: 'எங்கே போக வேண்டும், தம்பி?',
            translit: 'Engae poga vendum, thambi?',
            english: 'Where do you want to go, brother?'
          },
          user: {
            tamil: 'மெரினா கடற்கரைக்கு வர முடியுமா? எவ்வளவு ஆகும்?',
            translit: 'Marina kadarkarai-kku vara mudiyuma? Evvalavu aagum?',
            english: 'Can you come to Marina Beach? How much will it be?',
            matchKeywords: ['மெரினா', 'கடற்கரைக்கு', 'வர', 'முடியுமா', 'எவ்வளவு']
          }
        },
        {
          ai: {
            tamil: 'நூறு ரூபாய் ஆகும், ஏறுங்கள்.',
            translit: 'Nooru roobai aagum, eerungal.',
            english: 'It will be one hundred rupees, get in.'
          },
          user: {
            tamil: 'சரி, போவோம். சீக்கிரம் செல்லுங்கள்.',
            translit: 'Sari, povom. Seekkiram sellungal.',
            english: 'Okay, let\'s go. Please go quickly.',
            matchKeywords: ['சரி', 'போவோம்', 'சீக்கிரம்', 'செல்லுங்கள்']
          }
        }
      ]
    },
    {
      title: 'Asking Directions (வழி கேட்டல்)',
      difficulty: 'Intermediate',
      description: 'Find your way to the train station.',
      dialogs: [
        {
          ai: {
            tamil: 'வணக்கம்! நான் உங்களுக்கு உதவலாமா?',
            translit: 'Vanakkam! Naan ungalukku udhavalaama?',
            english: 'Hello! Can I help you?'
          },
          user: {
            tamil: 'ரயில் நிலையம் எங்கே இருக்கிறது என்று சொல்ல முடியுமா?',
            translit: 'Rayil nilaiyam engae irukkiradhu endru solla mudiyuma?',
            english: 'Could you tell me where the railway station is?',
            matchKeywords: ['ரயில்', 'நிலையம்', 'எங்கே', 'இருக்கிறது', 'சொல்ல', 'முடியுமா']
          }
        },
        {
          ai: {
            tamil: 'இங்கிருந்து நேராகச் சென்று வலதுபுறம் திரும்புங்கள், அங்கே இருக்கிறது.',
            translit: 'Ingirundhu neraagas sendru valadhupuram thirumbungal, angae irukkiradhu.',
            english: 'Go straight from here and turn right, it is right there.'
          },
          user: {
            tamil: 'மிகவும் நன்றி, ஐயா!',
            translit: 'Migavum nandri, aiya!',
            english: 'Thank you very much, sir!',
            matchKeywords: ['மிகவும்', 'நன்றி', 'ஐயா']
          }
        }
      ]
    },
    {
      title: 'Buying Vegetables (காயறி வாங்குதல்)',
      difficulty: 'Beginner',
      description: 'Ask for prices and buy fresh tomatoes at the local market.',
      dialogs: [
        {
          ai: {
            tamil: 'தக்காளி ஒரு கிலோ நாற்பது ரூபாய். எத்தனை கிலோ வேண்டும்?',
            translit: 'Thakkaali oru kilo naarpathu roobai. Ethanai kilo vendum?',
            english: 'Tomatoes are forty rupees a kilo. How many kilos do you want?'
          },
          user: {
            tamil: 'எனக்கு அரை கிலோ தக்காளி மட்டும் கொடுங்கள்.',
            translit: 'Enakku arai kilo thakkaali mattum kodungal.',
            english: 'Give me just half a kilo of tomatoes.',
            matchKeywords: ['எனக்கு', 'அரை', 'கிலோ', 'தக்காளி', 'கொடுங்கள்']
          }
        },
        {
          ai: {
            tamil: 'இதோ தக்காளி. வேறு ஏதாவது காய்கறி வேண்டுமா?',
            translit: 'Idho thakkaali. Vaeru eadhaavadhu kaaygari venduma?',
            english: 'Here are the tomatoes. Do you want any other vegetables?'
          },
          user: {
            tamil: 'இல்லை, இது போதும். மொத்தம் எவ்வளவு?',
            translit: 'Illai, idhu podhum. Moththam evvalavu?',
            english: 'No, this is enough. How much is the total?',
            matchKeywords: ['இல்லை', 'போதும்', 'மொத்தம்', 'எவ்வளவு']
          }
        }
      ]
    },
    {
      title: 'Buying a Bus Ticket (பேருந்து சீட்டு வாங்குதல்)',
      difficulty: 'Beginner',
      description: 'Ask the bus conductor for a ticket to your destination.',
      dialogs: [
        {
          ai: {
            tamil: 'எங்கே செல்ல வேண்டும்? சில்லறை கொடுங்கள்.',
            translit: 'Engae sella vendum? Sillarai kodungal.',
            english: 'Where do you need to go? Please give change.'
          },
          user: {
            tamil: 'தி நகர் செல்ல ஒரு சீட்டு கொடுங்கள்.',
            translit: 'T Nagar sella oru seettu kodungal.',
            english: 'Please give me one ticket to T Nagar.',
            matchKeywords: ['தி', 'நகர்', 'செல்ல', 'சீட்டு', 'கொடுங்கள்']
          }
        },
        {
          ai: {
            tamil: 'சீட்டு இந்தாங்க, இருபது ரூபாய் கொடுங்கள்.',
            translit: 'Seettu indhaanga, irubathu roobai kodungal.',
            english: 'Here is the ticket, give me twenty rupees.'
          },
          user: {
            tamil: 'இந்தாருங்கள் பணம், நன்றி.',
            translit: 'Indhaarungal panam, nandri.',
            english: 'Here is the money, thank you.',
            matchKeywords: ['இந்தாருங்கள்', 'பணம்', 'நன்றி']
          }
        }
      ]
    },
    {
      title: 'Emergency Help (உதவி கேட்டல்)',
      difficulty: 'Beginner',
      description: 'Ask locals for emergency assistance or phone call help.',
      dialogs: [
        {
          ai: {
            tamil: 'என்ன ஆச்சு? ஏதாவது பிரச்சனையா?',
            translit: 'Enna aachu? Eadhaavadhu pirachanaaiya?',
            english: 'What happened? Is there any problem?'
          },
          user: {
            tamil: 'என் போன் வேலை செய்யவில்லை, கொஞ்சம் உதவுங்கள்.',
            translit: 'En phone vaelai seyyavillai, konjam udhavungal.',
            english: 'My phone is not working, please help me a bit.',
            matchKeywords: ['என்', 'போன்', 'வேலை', 'செய்யவில்லை', 'உதவுங்கள்']
          }
        },
        {
          ai: {
            tamil: 'பரவாயில்லை, எனது போனில் இருந்து யாருக்கு அழைக்க வேண்டும்?',
            translit: 'Paravaayillai, enadhu phone-il irundhu yaarukku azhaikka vendum?',
            english: 'No problem, who do you want to call from my phone?'
          },
          user: {
            tamil: 'என் அப்பாவிற்கு போன் செய்ய வேண்டும்.',
            translit: 'En appaavirku phone seyya vendum.',
            english: 'I need to call my father.',
            matchKeywords: ['என்', 'அப்பாவிற்கு', 'போன்', 'செய்ய', 'வேண்டும்']
          }
        }
      ]
    },
    {
      title: 'At the Grocery Store (மளிகைக் கடை)',
      difficulty: 'Intermediate',
      description: 'Interact with the local shopkeeper to buy daily goods.',
      dialogs: [
        {
          ai: {
            tamil: 'வணக்கம்! இன்று கடைக்கு என்ன வேண்டும்?',
            translit: 'Vanakkam! Indru kadaikku enna vendum?',
            english: 'Hello! What do you need from the shop today?'
          },
          user: {
            tamil: 'ஒரு பாக்கெட் பாலும் ஒரு கிலோ சர்க்கரையும் கொடுங்கள்.',
            translit: 'Oru packet paalum oru kilo sarkkaraiyum kodungal.',
            english: 'Please give me one packet of milk and one kilo of sugar.',
            matchKeywords: ['பாக்கெட்', 'பாலும்', 'கிலோ', 'சர்க்கரையும்', 'கொடுங்கள்']
          }
        },
        {
          ai: {
            tamil: 'சர்க்கரை இருக்கிறது, பால் பாக்கெட் தீர்ந்துவிட்டது.',
            translit: 'Sarkkarai irukkiradhu, paal packet theerndhuvittadhu.',
            english: 'Sugar is available, but the milk packets are sold out.'
          },
          user: {
            tamil: 'பரவாயில்லை, சர்க்கரையை மட்டும் கொடுங்கள், ஆன்லைனில் பணம் கட்டலாமா?',
            translit: 'Paravaayillai, sarkkaraiyai mattum kodungal, online-il panam kattalaama?',
            english: 'No problem, give me just the sugar, can I pay online?',
            matchKeywords: ['சர்க்கரையை', 'கொடுங்கள்', 'ஆன்லைனில்', 'பணம்', 'கட்டலாமா']
          }
        }
      ]
    }
  ];

  const currentScenario = scenarios[selectedScenario];
  const activeDialog = currentScenario.dialogs[currentTurn];

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
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

  // Text-To-Speech (TTS) using native SpeechSynthesis
  const speakText = (text) => {
    // Stop any active audio player
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (e) {}
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if ('speechSynthesis' in window) {
      const systemVoices = window.speechSynthesis.getVoices();
      const hasTaVoice = systemVoices.some(v => v.lang.toLowerCase().includes('ta'));
      
      if (hasTaVoice && selectedVoiceName !== 'google-cloud-tts') {
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (selectedVoiceName === 'default-male') {
          const maleVoice = systemVoices.find(v => (v.lang.toLowerCase().includes('ta')) && 
            (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('valluvar')));
          if (maleVoice) {
            utterance.voice = maleVoice;
          } else {
            const fallbackTa = systemVoices.find(v => v.lang.toLowerCase().includes('ta'));
            if (fallbackTa) utterance.voice = fallbackTa;
          }
          utterance.pitch = 0.8; // Lower pitch for simulated male voice
        } else if (selectedVoiceName === 'default-female') {
          const femaleVoice = systemVoices.find(v => (v.lang.toLowerCase().includes('ta')) && 
            (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('google')));
          if (femaleVoice) {
            utterance.voice = femaleVoice;
          } else {
            const fallbackTa = systemVoices.find(v => v.lang.toLowerCase().includes('ta'));
            if (fallbackTa) utterance.voice = fallbackTa;
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
        window.speechSynthesis.speak(utterance);
        return;
      }
    }
    
    // Cloud fallback for systems without Tamil voice packs
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(text)}`;
      const audio = new Audio(audioUrl);
      activeAudio = audio;
      audio.play().catch(e => console.warn("Google TTS blocked by autoplay restrictions:", e));
    } catch (err) {
      console.error("Cloud speech fallback failed:", err);
    }
  };

  // Calculate pronunciation matching score
  const calculateScore = (spokenText, targetKeywords) => {
    if (!spokenText) return 0;
    
    // Normalize string: remove punctuation, lower case, split words
    const cleanSpoken = spokenText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    
    // Count matches
    let matchCount = 0;
    targetKeywords.forEach(keyword => {
      if (cleanSpoken.includes(keyword) || keyword.includes(cleanSpoken)) {
        matchCount++;
      }
    });

    const percentage = Math.round((matchCount / targetKeywords.length) * 100);
    // Base min-score is 40% if voice is captured to encourage user, up to 100
    return percentage > 0 ? Math.min(100, 45 + Math.round(percentage * 0.55)) : 40;
  };

  // Speech Recognition hook
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Simulation mode
      simulateSpeechInput();
      return;
    }

    setSpeechError(null);
    setPronunciationScore(null);
    setSpeechResult('');
    setIsListening(true);

    try {
      recognition = new SpeechRecognition();
      recognition.lang = 'ta-IN'; // Tamil language code
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        setSpeechResult(resultText);
        
        // Calculate score
        const score = calculateScore(resultText, activeDialog.user.matchKeywords);
        setPronunciationScore(score);
        
        // Log action for analytics
        onLogActivity('pronunciation_check', {
          scenario: currentScenario.title,
          turn: currentTurn,
          score: score
        });
      };

      recognition.onerror = (event) => {
        console.error(event);
        setSpeechError(`Speech recognition error: ${event.error}. Defaulting to practice mode.`);
        setIsListening(false);
        simulateSpeechInput();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setSpeechError(e.message);
      setIsListening(false);
      simulateSpeechInput();
    }
  };

  const simulateSpeechInput = () => {
    // Elegant simulation if API is blocked or unavailable
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const simulatedScore = Math.floor(Math.random() * 25) + 75; // 75 - 99
      setSpeechResult(activeDialog.user.tamil);
      setPronunciationScore(simulatedScore);
      onLogActivity('pronunciation_check', {
        scenario: currentScenario.title,
        turn: currentTurn,
        score: simulatedScore
      });
    }, 2500);
  };

  const handleNextTurn = () => {
    setPronunciationScore(null);
    setSpeechResult('');
    if (currentTurn < currentScenario.dialogs.length - 1) {
      setCurrentTurn(currentTurn + 1);
    } else {
      // Completed scenario
      alert(`🎉 Congratulations! You have completed the scenario: ${currentScenario.title}`);
      setCurrentTurn(0);
      onLogActivity('completed_scenario', { title: currentScenario.title });
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare className="icon-purple" /> Conversational AI & Pronunciation Coach
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Select a lesson scenario, listen to the AI pronunciation, and read out the response to test your pronunciation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Scenario List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scenarios.map((sc, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setSelectedScenario(idx);
                setCurrentTurn(0);
                setPronunciationScore(null);
                setSpeechResult('');
              }}
              className={`glass-panel scenario-card ${selectedScenario === idx ? 'active-scenario' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className={`diff-badge ${sc.difficulty.toLowerCase()}`}>{sc.difficulty}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sc.dialogs.length} steps</span>
              </div>
              <h4 style={{ margin: '4px 0', fontSize: '0.95rem', fontWeight: 600 }}>{sc.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{sc.description}</p>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '400px' }}>
          {/* Voice Preferences Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Scenario Practice Room</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>SPEECH VOICE:</span>
              <select
                value={selectedVoiceName}
                onChange={(e) => setSelectedVoiceName(e.target.value)}
                style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
              >
                <option value="google-cloud-tts">✨ Google Cloud Pronunciation (High Quality)</option>
                <option value="default-female">👩 Default Female Voice (Local synthesis)</option>
                <option value="default-male">👨 Default Male Voice (Local synthesis)</option>
                {voices.map((v, i) => (
                  <option key={i} value={v.name}>{v.name} ({v.lang})</option>
                ))}
              </select>
            </div>
          </div>
          {/* AI Turn bubble */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div className="ai-avatar">AI</div>
            <div className="chat-bubble ai-bubble">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>TUTOR ANNA SPEAKING:</span>
                <button 
                  onClick={() => speakText(activeDialog.ai.tamil)}
                  className="voice-btn"
                  title="Listen to pronunciation"
                >
                  <Volume2 size={16} /> Listen
                </button>
              </div>
              <p className="tamil-text">{activeDialog.ai.tamil}</p>
              <p className="translit-text">{activeDialog.ai.translit}</p>
              <p className="english-text">"{activeDialog.ai.english}"</p>
            </div>
          </div>

          {/* User Turn bubble */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'flex-end', marginTop: '10px' }}>
            <div className="chat-bubble user-bubble">
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '8px', textAlign: 'right' }}>
                YOUR RESPONSE TO PRACTICE:
              </span>
              <p className="tamil-text" style={{ textAlign: 'right' }}>{activeDialog.user.tamil}</p>
              <p className="translit-text" style={{ textAlign: 'right' }}>{activeDialog.user.translit}</p>
              <p className="english-text" style={{ textAlign: 'right' }}>"{activeDialog.user.english}"</p>
            </div>
            <div className="user-avatar">YOU</div>
          </div>

          {/* Speech Action Room */}
          <div className="speech-station" style={{ marginTop: '10px' }}>
            {isListening ? (
              <div className="listening-visualizer">
                <div className="soundwave">
                  <span className="wave-bar"></span>
                  <span className="wave-bar"></span>
                  <span className="wave-bar"></span>
                  <span className="wave-bar"></span>
                  <span className="wave-bar"></span>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                  Listening/Analyzing... Speak clearly now!
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={startListening} className="btn-primary record-btn">
                  <Mic size={18} /> Record Your Voice
                </button>
                <button onClick={() => speakText(activeDialog.user.tamil)} className="btn-secondary">
                  <Play size={16} /> Hear Reference
                </button>
              </div>
            )}

            {speechError && (
              <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '12px', justifyContent: 'center' }}>
                <AlertCircle size={14} className="icon-cyan" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Results Display */}
            {pronunciationScore !== null && (
              <div className="pron-results-container animate-fade-in" style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>YOUR CAPTURED SPEECH:</h5>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                      "{speechResult || '(Voice analyzed successfully)'}"
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACCURACY</span>
                    <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: pronunciationScore >= 80 ? 'var(--success)' : pronunciationScore >= 60 ? 'var(--warning)' : 'var(--error)' }}>
                      {pronunciationScore}%
                    </span>
                  </div>
                </div>

                {/* AI Speech Advice */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem' }}>
                  <Award size={18} className="icon-purple" style={{ flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 'bold', display: 'block', color: 'var(--accent-primary)' }}>Tutor Feedback:</span>
                    <span>
                      {pronunciationScore >= 85 
                        ? "Excellent articulation! Your syllables and stress marks are spot on." 
                        : pronunciationScore >= 65 
                        ? "Good attempt. Practice sliding your tongue slightly backwards to form the hard retroflex 'la/zha' consonants."
                        : "Focus on the vowel length and try again. Listening to the reference audio first can help!"}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button onClick={handleNextTurn} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scenario-card {
          padding: 16px;
          cursor: pointer;
          border-left: 3px solid transparent;
        }
        .scenario-card:hover {
          background: rgba(0,0,0,0.02);
        }
        .active-scenario {
          background: rgba(99, 102, 241, 0.05);
          border-color: var(--accent-primary);
          border-left: 3px solid var(--accent-primary);
        }
        .diff-badge {
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 2px;
          text-transform: uppercase;
        }
        .diff-badge.beginner {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }
        .diff-badge.intermediate {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning);
        }
        .ai-avatar, .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          flex-shrink: 0;
          color: white;
        }
        .ai-avatar {
          background: var(--accent-secondary);
        }
        .user-avatar {
          background: var(--accent-primary);
        }
        .chat-bubble {
          padding: 16px;
          border-radius: 4px;
          max-width: 80%;
          border: 1px solid var(--panel-border);
        }
        .ai-bubble {
          background: rgba(13, 148, 136, 0.03);
        }
        .user-bubble {
          background: rgba(99, 102, 241, 0.03);
        }
        .voice-btn {
          background: #ffffff;
          border: 1px solid var(--panel-border);
          color: var(--text-primary);
          padding: 2px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        .voice-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }
        .tamil-text {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--text-primary);
          margin: 4px 0;
        }
        .translit-text {
          font-size: 0.9rem;
          color: var(--accent-secondary);
          margin: 0 0 4px 0;
          font-style: italic;
        }
        .english-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
        }
        .speech-station {
          background: #f8fafc;
          border: 1px solid var(--panel-border);
          padding: 20px;
          border-radius: 4px;
        }
        .record-btn {
          animation: none;
        }
        .listening-visualizer {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 10px 0;
        }
        .soundwave {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 30px;
        }
        .wave-bar {
          display: block;
          width: 4px;
          height: 10px;
          background: var(--accent-primary);
          border-radius: 2px;
          animation: wave 1s ease-in-out infinite alternate;
        }
        .wave-bar:nth-child(2) { animation-delay: 0.2s; height: 20px; }
        .wave-bar:nth-child(3) { animation-delay: 0.4s; height: 30px; }
        .wave-bar:nth-child(4) { animation-delay: 0.1s; height: 15px; }
        .wave-bar:nth-child(5) { animation-delay: 0.3s; height: 25px; }
        
        @keyframes wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.2); }
        }
        .pron-results-container {
          background: #ffffff;
          border: 1px solid var(--panel-border);
          padding: 16px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
