import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Volume2, Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle, PenTool, Gamepad2, RotateCcw } from 'lucide-react';

export default function TamilBasics() {
  const [activeSubTab, setActiveSubTab] = useState('vowels');

  // Vowels Data
  const vowels = [
    { char: 'அ', sound: 'a', pronunciation: 'short a (as in cup)', example: 'அம்மா (Amma - Mother)' },
    { char: 'ஆ', sound: 'aa', pronunciation: 'long a (as in father)', example: 'ஆடு (Aadu - Goat)' },
    { char: 'இ', sound: 'i', pronunciation: 'short i (as in pin)', example: 'இலை (Ilai - Leaf)' },
    { char: 'ஈ', sound: 'ee', pronunciation: 'long i (as in seat)', example: 'ஈட்டி (Eetti - Spear)' },
    { char: 'உ', sound: 'u', pronunciation: 'short u (as in put)', example: 'உரல் (Ural - Mortar)' },
    { char: 'ஊ', sound: 'oo', pronunciation: 'long u (as in boot)', example: 'ஊஞ்சல் (Oonjal - Swing)' },
    { char: 'எ', sound: 'e', pronunciation: 'short e (as in pen)', example: 'எலி (Eli - Rat)' },
    { char: 'ஏ', sound: 'ae', pronunciation: 'long e (as in pay)', example: 'ஏணி (Aeni - Ladder)' },
    { char: 'ஐ', sound: 'ai', pronunciation: 'diphthong ai (as in fly)', example: 'ஐந்து (Aindhu - Five)' },
    { char: 'ஒ', sound: 'o', pronunciation: 'short o (as in go)', example: 'ஒட்டகம் (Ottagam - Camel)' },
    { char: 'ஓ', sound: 'oo', pronunciation: 'long o (as in boat)', example: 'ஓடம் (Odam - Boat)' },
    { char: 'ஔ', sound: 'au', pronunciation: 'diphthong au (as in cow)', example: 'ஔவையார் (Avvaiyar - Poet)' },
    { char: 'ஃ', sound: 'ak', pronunciation: 'special Ayutha letter (guttural)', example: 'எஃகு (Ehgu - Steel)' }
  ];

  // Consonants Data
  const consonants = [
    { char: 'க்', sound: 'k / g', pronunciation: 'k (soft) or g (hard)', example: 'கண் (Kan - Eye)' },
    { char: 'ங்', sound: 'ng', pronunciation: 'ng (as in sing)', example: 'சிங்கம் (Singam - Lion)' },
    { char: 'ச்', sound: 'ch / s', pronunciation: 'ch (as in chat) or s', example: 'சட்டை (Sattai - Shirt)' },
    { char: 'ஞ்', sound: 'ny', pronunciation: 'ny (as in canyon)', example: 'ஞாயிறு (Nyayiru - Sunday)' },
    { char: 'ட்', sound: 't / d', pronunciation: 'retroflex t or d', example: 'படம் (Padam - Picture)' },
    { char: 'ண்', sound: 'n', pronunciation: 'retroflex n (curled tongue)', example: 'வண்டு (Vandu - Beetle)' },
    { char: 'த்', sound: 'th', pronunciation: 'dental th (as in think)', example: 'தவளை (Thavalai - Frog)' },
    { char: 'ந்', sound: 'n', pronunciation: 'dental n', example: 'நண்டு (Nandu - Crab)' },
    { char: 'ப்', sound: 'p / b', pronunciation: 'p or b', example: 'பந்து (Pandhu - Ball)' },
    { char: 'ம்', sound: 'm', pronunciation: 'm (as in man)', example: 'மரம் (Maram - Tree)' },
    { char: 'ய்', sound: 'y', pronunciation: 'y (as in yes)', example: 'யானை (Yaanai - Elephant)' },
    { char: 'ர்', sound: 'r', pronunciation: 'soft r', example: 'ரயில் (Rayil - Train)' },
    { char: 'ல்', sound: 'l', pronunciation: 'dental l (tongue on teeth)', example: 'அணில் (Anil - Squirrel)' },
    { char: 'வ்', sound: 'v', pronunciation: 'v / w sound', example: 'வண்டி (Vandi - Cart)' },
    { char: 'ழ்', sound: 'zha', pronunciation: 'retroflex approximant (special curl)', example: 'தமிழ் (Thamizh - Tamil)' },
    { char: 'ள்', sound: 'l', pronunciation: 'retroflex l (tongue curled back)', example: 'வாள் (Vaal - Sword)' },
    { char: 'ற்', sound: 'tr / r', pronunciation: 'hard tr or r', example: 'பறவை (Paravai - Bird)' },
    { char: 'ன்', sound: 'n', pronunciation: 'alveolar n', example: 'மீன் (Meen - Fish)' }
  ];

  // Letter builder state
  const [selectedConsonant, setSelectedConsonant] = useState(0);
  const [selectedVowel, setSelectedVowel] = useState(0);

  // Canvas Tracing States
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(8);
  const [tracingLetter, setTracingLetter] = useState('அ');

  const allLetters = [...vowels.map(v => v.char), ...consonants.map(c => c.char)];

  const drawGuidelinesAndLetter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Reset scale to avoid scaling issues on resize
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw two-line notebook guidelines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)'; // faint accent color lines
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Top guideline (e.g. 100px)
    ctx.beginPath();
    ctx.moveTo(20, 100);
    ctx.lineTo(canvas.width - 20, 100);
    ctx.stroke();

    // Bottom guideline (e.g. 300px)
    ctx.beginPath();
    ctx.moveTo(20, 300);
    ctx.lineTo(canvas.width - 20, 300);
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash

    // 2. Draw faint skeleton character to trace
    ctx.fillStyle = '#f1f5f9'; // extremely light gray
    ctx.font = '220px "Outfit", "Noto Sans Tamil", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tracingLetter, canvas.width / 2, canvas.height / 2);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    // Handle Touch vs Mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Memory Match Game States
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [movesCount, setMovesCount] = useState(0);

  const initGame = () => {
    const basePairs = [
      { char: 'அ', sound: 'a' },
      { char: 'ஆ', sound: 'aa' },
      { char: 'இ', sound: 'i' },
      { char: 'ழ', sound: 'zha' },
      { char: 'க', sound: 'ka' },
      { char: 'ட', sound: 'ta' }
    ];

    let tempCards = [];
    basePairs.forEach((pair, idx) => {
      tempCards.push({ id: `char-${idx}`, type: 'char', value: pair.char, pairId: idx, isFlipped: false, isMatched: false });
      tempCards.push({ id: `sound-${idx}`, type: 'sound', value: pair.sound, pairId: idx, isFlipped: false, isMatched: false });
    });

    // Shuffle cards
    tempCards.sort(() => Math.random() - 0.5);
    setCards(tempCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMovesCount(0);
  };

  const handleCardClick = (cardIndex) => {
    if (flippedCards.length >= 2 || cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

    const updatedCards = [...cards];
    updatedCards[cardIndex].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    // Speak character sound if it's a character card
    if (updatedCards[cardIndex].type === 'char') {
      speakLetter(updatedCards[cardIndex].value);
    }

    if (newFlipped.length === 2) {
      setMovesCount(prev => prev + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          const matchedCards = [...updatedCards];
          matchedCards[newFlipped[0]].isMatched = true;
          matchedCards[newFlipped[1]].isMatched = true;
          setCards(matchedCards);
          setMatchedPairs(prev => [...prev, firstCard.pairId]);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...updatedCards];
          resetCards[newFlipped[0]].isFlipped = false;
          resetCards[newFlipped[1]].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Trigger draw when tracing subtab is loaded or tracing letter changed
  useEffect(() => {
    if (activeSubTab === 'drawing') {
      setTimeout(drawGuidelinesAndLetter, 100);
    }
  }, [activeSubTab, tracingLetter]);

  // Trigger game initialize when game subtab is active
  useEffect(() => {
    if (activeSubTab === 'game') {
      initGame();
    }
  }, [activeSubTab]);

  // Vowel signs combinations helper
  const consonantBases = ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'];
  const vowelSigns = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];
  const vowelSounds = ['a', 'aa', 'i', 'ee', 'u', 'uu', 'e', 'ae', 'ai', 'o', 'oo', 'au'];

  // Pre-load voices on mount to avoid async load delay
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoices = () => { window.speechSynthesis.getVoices(); };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
    }
  }, []);

  // Speech helper
  const speakLetter = (text) => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const hasTaVoice = voices.some(v => v.lang.toLowerCase().includes('ta'));
      if (hasTaVoice) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const taVoice = voices.find(v => v.lang.toLowerCase().includes('ta'));
        if (taVoice) {
          utterance.voice = taVoice;
        }
        utterance.lang = 'ta-IN';
        utterance.rate = 0.75;
        window.speechSynthesis.speak(utterance);
        return;
      }
    }
    // Cloud fallback for systems without Tamil voice packs
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(text)}`;
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.warn("Google TTS blocked by autoplay restrictions:", e));
    } catch (err) {
      console.error("Cloud speech fallback failed:", err);
    }
  };

  // Combine consonant and vowel sign rules (simplified unicode builder for display)
  const getCombinedLetter = (consIdx, vowIdx) => {
    const base = consonantBases[consIdx];
    const sign = vowelSigns[vowIdx];

    // Unicode modifications for special combinations (e.g. u/uu signs for ட, ண, etc.)
    // For standard demonstration, direct combination works well in rendering:
    if (vowIdx === 0) return base; // a sound
    
    // Custom combining adjustments for Tamil letters u/uu signs
    if (vowIdx === 4) { // u sign ு
      if (base === 'க') return 'கு';
      if (base === 'ச') return 'சு';
      if (base === 'ட') return 'டு';
      if (base === 'ண') return 'ணு';
      if (base === 'த') return 'து';
      if (base === 'ந') return 'நு';
      if (base === 'ப') return 'பு';
      if (base === 'ம') return 'மு';
      if (base === 'ய') return 'யு';
      if (base === 'ர') return 'ரு';
      if (base === 'ல') return 'லு';
      if (base === 'வ') return 'வு';
      if (base === 'ழ') return 'ழு';
      if (base === 'ள') return 'ளு';
      if (base === 'ற') return 'று';
      if (base === 'ன') return 'னு';
    }
    if (vowIdx === 5) { // uu sign ூ
      if (base === 'க') return 'கூ';
      if (base === 'ச') return 'சூ';
      if (base === 'ட') return 'டூ';
      if (base === 'ண') return 'ணூ';
      if (base === 'த') return 'தூ';
      if (base === 'ந') return 'நூ';
      if (base === 'ப') return 'பூ';
      if (base === 'ம') return 'மூ';
      if (base === 'ய') return 'யூ';
      if (base === 'ர') return 'ரூ';
      if (base === 'ல') return 'லூ';
      if (base === 'வ') return 'வூ';
      if (base === 'ழ') return 'ழூ';
      if (base === 'ள') return 'ளூ';
      if (base === 'ற') return 'றூ';
      if (base === 'ன') return 'னூ';
    }

    return base + sign;
  };

  // Beginner Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      question: "Which of the following is the very first Tamil vowel (உயிரெழுத்து)?",
      options: ['ஆ', 'அ', 'இ', 'உ'],
      correct: 1,
      hint: "It has the short 'a' sound like in 'Amma'."
    },
    {
      question: "Which letter represents the unique Tamil retroflex sound 'zha' as in 'Thamizh'?",
      options: ['ல', 'ள', 'ழ', 'ர'],
      correct: 2,
      hint: "Curled tongue approximant sound."
    },
    {
      question: "What vowel combines with 'க்' to create the sound 'கா' (kaa)?",
      options: ['அ (a)', 'ஆ (aa)', 'இ (i)', 'ஈ (ee)'],
      correct: 1,
      hint: "It requires the long 'aa' modifier sign (ா)."
    },
    {
      question: "How many letters are there in the absolute total Tamil alphabet set?",
      options: ['26', '12', '247', '30'],
      correct: 2,
      hint: "Includes vowels, consonants, compound letters, and 1 special letter."
    }
  ];

  const handleAnswerClick = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === quizQuestions[quizIndex].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '10px 0' }}>
      
      {/* Intro Header banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(13, 148, 136, 0.03) 100%)', border: '1px solid var(--panel-border)', borderRadius: '4px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <GraduationCap size={24} style={{ color: 'var(--accent-primary)' }} /> Learn Tamil Alphabets from Scratch
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
          Tamil is a highly phonetic language. The alphabet consists of <strong>247 letters</strong> in total: 12 Vowels (உயிர்), 18 Consonants (மெய்), 1 Special character (ஆயுதம்), and 216 Vowel-Consonant Compound combinations.
        </p>
      </div>

      {/* Internal Subtabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px', marginBottom: '20px' }}>
        {[
          { id: 'vowels', label: '12 Vowels (உயிரெழுத்துக்கள்)', icon: BookOpen },
          { id: 'consonants', label: '18 Consonants (மெய்யெழுத்துக்கள்)', icon: Layers },
          { id: 'builder', label: 'Compound Letter Builder', icon: Sparkles },
          { id: 'drawing', label: 'Letter Tracing & Draw (வரைதல்)', icon: PenTool },
          { id: 'game', label: 'Memory Game (விளையாட்டு)', icon: Gamepad2 },
          { id: 'quiz', label: 'Basics Quiz', icon: CheckCircle2 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className="module-action-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                border: activeSubTab === tab.id ? '1px solid var(--accent-primary)' : '1px solid #cbd5e1',
                background: activeSubTab === tab.id ? 'var(--accent-primary-glow)' : '#ffffff',
                color: activeSubTab === tab.id ? 'var(--accent-primary)' : 'var(--text-muted)'
              }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Vowels Workspace */}
      {activeSubTab === 'vowels' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {vowels.map((v, idx) => (
              <div key={idx} className="glass-panel" style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'white', padding: '16px', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.18)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                  {v.char}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Sound: "{v.sound}"</span>
                    <button 
                      onClick={() => speakLetter(v.char, v.sound)} 
                      className="module-action-btn" 
                      style={{ padding: '4px 6px', border: 'none', background: 'var(--accent-primary-glow)' }}
                      title="Listen"
                    >
                      <Volume2 size={12} style={{ color: 'var(--accent-primary)' }} />
                    </button>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 6px 0' }}>{v.pronunciation}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--accent-secondary)' }}>E.g. {v.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consonants Workspace */}
      {activeSubTab === 'consonants' && (
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Note: Pure Tamil consonants have a dot on top (Pulli - ்) which silences the vowel. When spoken on their own, they represent raw consonant sounds.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {consonants.map((c, idx) => (
              <div key={idx} className="glass-panel" style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'white', padding: '16px', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(13, 148, 136, 0.08)', border: '1px solid rgba(13, 148, 136, 0.18)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                  {c.char}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Sound: "{c.sound}"</span>
                    <button 
                      onClick={() => speakLetter(c.char, c.sound.split(' ')[0])} 
                      className="module-action-btn" 
                      style={{ padding: '4px 6px', border: 'none', background: 'rgba(13, 148, 136, 0.08)' }}
                      title="Listen"
                    >
                      <Volume2 size={12} style={{ color: 'var(--accent-secondary)' }} />
                    </button>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 6px 0' }}>{c.pronunciation}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--accent-primary)' }}>Word: {c.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Letter Builder playground */}
      {activeSubTab === 'builder' && (
        <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', background: 'white', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
          
          {/* Controls column */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Select & Build Combinations</h3>
            
            {/* Consonants row */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                1. Select Consonant (மெய்)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {consonants.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedConsonant(idx)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      background: selectedConsonant === idx ? 'var(--accent-secondary)' : '#ffffff',
                      color: selectedConsonant === idx ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {c.char}
                  </button>
                ))}
              </div>
            </div>

            {/* Vowels row */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                2. Select Vowel (உயிர்)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {vowels.slice(0, 12).map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVowel(idx)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      background: selectedVowel === idx ? 'var(--accent-primary)' : '#ffffff',
                      color: selectedVowel === idx ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {v.char}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results display Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--panel-border)', paddingLeft: '24px', background: '#fcfcfd', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '14px' }}>Result Compound Letter (உயிர்மெய்)</span>
            
            {/* Equation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '20px' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>{consonants[selectedConsonant].char}</span>
              <span>+</span>
              <span style={{ color: 'var(--accent-primary)' }}>{vowels[selectedVowel].char}</span>
              <span>=</span>
            </div>

            {/* Combined Result Output */}
            <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.1 }}>
              {getCombinedLetter(selectedConsonant, selectedVowel)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                Pronounced: "{consonants[selectedConsonant].sound.split(' ')[0] + vowelSounds[selectedVowel]}"
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Combined Sign Modifier: {vowelSigns[selectedVowel] ? `"${vowelSigns[selectedVowel]}"` : 'None (built-in a sound)'}
              </span>
            </div>

            <button
              onClick={() => speakLetter(getCombinedLetter(selectedConsonant, selectedVowel), consonants[selectedConsonant].sound.split(' ')[0] + vowelSounds[selectedVowel])}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '4px' }}
            >
              <Volume2 size={16} /> Listen to Result
            </button>
          </div>
        </div>
      )}

      {/* Quiz Workspace */}
      {activeSubTab === 'quiz' && (
        <div className="glass-panel" style={{ background: 'white', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '4px', maxWidth: '600px', margin: '0 auto' }}>
          {!quizFinished ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  Question {quizIndex + 1} of {quizQuestions.length}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Score: {quizScore}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 20px 0', lineHeight: 1.4, fontWeight: 600 }}>
                {quizQuestions[quizIndex].question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {quizQuestions[quizIndex].options.map((opt, idx) => {
                  let btnBg = 'white';
                  let btnBorder = '#cbd5e1';
                  let btnColor = 'var(--text-primary)';

                  if (selectedAnswer !== null) {
                    if (idx === quizQuestions[quizIndex].correct) {
                      btnBg = 'rgba(16, 185, 129, 0.1)';
                      btnBorder = 'var(--success)';
                      btnColor = 'var(--success)';
                    } else if (selectedAnswer === idx) {
                      btnBg = 'rgba(239, 68, 68, 0.1)';
                      btnBorder = 'var(--error)';
                      btnColor = 'var(--error)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerClick(idx)}
                      disabled={selectedAnswer !== null}
                      style={{
                        padding: '12px 16px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        borderRadius: '4px',
                        border: `1px solid ${btnBorder}`,
                        background: btnBg,
                        color: btnColor,
                        cursor: selectedAnswer !== null ? 'default' : 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Hints / Next controls */}
              {selectedAnswer !== null ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', color: selectedAnswer === quizQuestions[quizIndex].correct ? 'var(--success)' : 'var(--error)' }}>
                    {selectedAnswer === quizQuestions[quizIndex].correct ? (
                      <>✔ Correct Answer!</>
                    ) : (
                      <>❌ Incorrect. Hint: {quizQuestions[quizIndex].hint}</>
                    )}
                  </span>
                  <button onClick={nextQuestion} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}>
                    Next Question
                  </button>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  💡 Hint: {quizQuestions[quizIndex].hint}
                </p>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <CheckCircle2 size={54} style={{ color: 'var(--success)', margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Quiz Completed!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                You scored <strong>{quizScore} out of {quizQuestions.length}</strong> correct answers!
              </p>
              <button onClick={resetQuiz} className="btn-primary" style={{ padding: '10px 24px', borderRadius: '4px' }}>
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tracing Drawing Workspace */}
      {activeSubTab === 'drawing' && (
        <div className="glass-panel animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', background: 'white', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
          {/* Controls */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 600 }}>Letter Tracing Sandbox</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px', lineHeight: 1.4 }}>
              Select a Tamil letter from the dropdown. Follow the guide lines and trace inside the faint gray character layout with your cursor or finger:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Select Character
                </label>
                <select 
                  value={tracingLetter} 
                  onChange={(e) => setTracingLetter(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', fontSize: '0.95rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  {allLetters.map((l, i) => (
                    <option key={i} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Brush Preferences */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Brush Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['#6366f1', '#0d9488', '#ef4444', '#000000'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: brushColor === color ? '2px solid var(--text-primary)' : '1px solid #cbd5e1',
                          cursor: 'pointer',
                          transform: brushColor === color ? 'scale(1.1)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Brush Size ({brushSize}px)
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Utility actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={drawGuidelinesAndLetter}
                  className="btn-secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <RotateCcw size={16} /> Reset Canvas
                </button>
                <button
                  onClick={() => speakLetter(tracingLetter)}
                  className="btn-primary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <Volume2 size={16} /> Hear Pronunciation
                </button>
              </div>
            </div>
          </div>

          {/* Canvas display board */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '400px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
                borderRadius: '4px',
                cursor: 'crosshair'
              }}
            />
          </div>
        </div>
      )}

      {/* Memory Match Game Workspace */}
      {activeSubTab === 'game' && (
        <div className="glass-panel animate-fade-in" style={{ background: 'white', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '4px', maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tamil Audio Memory Match</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Match the Tamil character cards with their corresponding sound transliterations!</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>TRIES: {movesCount}</span>
              <button onClick={initGame} className="module-action-btn" style={{ padding: '4px 10px', fontSize: '0.75rem', marginTop: '4px', display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                <RotateCcw size={12} /> Restart Game
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {cards.map((card, index) => {
              const showFront = card.isFlipped || card.isMatched;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  style={{
                    height: '100px',
                    borderRadius: '8px',
                    border: card.isMatched 
                      ? '2px solid var(--success)' 
                      : showFront 
                      ? '1px solid var(--accent-primary)' 
                      : '1px solid #cbd5e1',
                    background: card.isMatched 
                      ? 'rgba(16, 185, 129, 0.05)' 
                      : showFront 
                      ? 'var(--accent-primary-glow)' 
                      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    cursor: card.isMatched || showFront ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    transform: showFront ? 'scale(0.98)' : 'none',
                    boxShadow: showFront ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {showFront ? (
                    <div>
                      <span style={{ 
                        fontSize: card.type === 'char' ? '2.2rem' : '1.4rem', 
                        fontWeight: 'bold', 
                        color: card.isMatched 
                          ? 'var(--success)' 
                          : card.type === 'char' 
                          ? 'var(--accent-primary)' 
                          : 'var(--accent-secondary)' 
                      }}>
                        {card.value}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {card.type === 'char' ? 'LETTER' : 'SOUND'}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8' }}>
                      <GraduationCap size={28} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 'bold', marginTop: '4px' }}>T A</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Win Dialog */}
          {matchedPairs.length === 6 && (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--success)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🎉</span>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>All Cards Matched!</h4>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                You completed the matching memory game in exactly <strong>{movesCount} tries</strong>! Awesome memory work.
              </p>
              <button onClick={initGame} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', borderRadius: '4px' }}>
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
