import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Volume2, Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle, PenTool, Gamepad2, RotateCcw } from 'lucide-react';

let activeAudio = null;

export default function TamilBasics({ user, onLogActivity }) {
  const currentLevel = user?.level || 'beginner';
  
  const [activeSubTab, setActiveSubTab] = useState(
    currentLevel === 'advanced' ? 'sentences' : currentLevel === 'intermediate' ? 'words' : 'vowels'
  );

  // Intermediate Word States
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [wordBuildProgress, setWordBuildProgress] = useState([]); // letters clicked so far
  const [wordQuizFeedback, setWordQuizFeedback] = useState(null);
  
  // Advanced Sentence States
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(0);
  const [sentenceBuildProgress, setSentenceBuildProgress] = useState([]); // words clicked so far
  const [sentenceQuizFeedback, setSentenceQuizFeedback] = useState(null);

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

  const intermediateWords = [
    {
      word: 'அம்மா',
      translit: 'Amma',
      meaning: 'Mother',
      visual: '👩‍👦',
      breakdown: ['அ', 'ம்', 'மா'],
      lettersPool: ['அ', 'மா', 'ம்', 'இ', 'க்']
    },
    {
      word: 'தந்தை',
      translit: 'Thandhai',
      meaning: 'Father',
      visual: '👨‍👦',
      breakdown: ['த', 'ந்', 'தை'],
      lettersPool: ['ந்', 'த', 'தை', 'ப்', 'ம']
    },
    {
      word: 'மரம்',
      translit: 'Maram',
      meaning: 'Tree',
      visual: '🌳',
      breakdown: ['ம', 'ர', 'ம்'],
      lettersPool: ['ர', 'ம', 'ம்', 'க்', 'ப்']
    },
    {
      word: 'ஆடு',
      translit: 'Aadu',
      meaning: 'Goat',
      visual: '🐐',
      breakdown: ['ஆ', 'டு'],
      lettersPool: ['டு', 'ஆ', 'அ', 'ம்']
    },
    {
      word: 'நண்டு',
      translit: 'Nandu',
      meaning: 'Crab',
      visual: '🦀',
      breakdown: ['ந', 'ண்', 'டு'],
      lettersPool: ['ண்', 'டு', 'ந', 'ம', 'க்']
    },
    {
      word: 'சிங்கம்',
      translit: 'Singam',
      meaning: 'Lion',
      visual: '🦁',
      breakdown: ['சி', 'ங்', 'க', 'ம்'],
      lettersPool: ['சி', 'க', 'ம்', 'ங்', 'ப்', 'ம']
    },
    {
      word: 'பழம்',
      translit: 'Pazham',
      meaning: 'Fruit / Banana',
      visual: '🍎',
      breakdown: ['ப', 'ழ', 'ம்'],
      lettersPool: ['ப', 'ம்', 'ழ', 'ர', 'க்']
    },
    {
      word: 'தவளை',
      translit: 'Thavalai',
      meaning: 'Frog',
      visual: '🐸',
      breakdown: ['த', 'வ', 'ளை'],
      lettersPool: ['வ', 'த', 'ளை', 'ம்', 'ப்']
    }
  ];

  const advancedSentences = [
    {
      sentence: 'நான் தமிழ் படிக்கிறேன்',
      translit: 'Naan Thamizh padikkiren',
      meaning: 'I am studying Tamil',
      breakdown: [
        { word: 'நான்', meaning: 'I' },
        { word: 'தமிழ்', meaning: 'Tamil' },
        { word: 'படிக்கிறேன்', meaning: 'study' }
      ],
      wordsPool: ['தமிழ்', 'படிக்கிறேன்', 'நான்', 'அம்மா']
    },
    {
      sentence: 'இது ஒரு புத்தகம்',
      translit: 'Idhu oru puthagam',
      meaning: 'This is a book',
      breakdown: [
        { word: 'இது', meaning: 'This' },
        { word: 'ஒரு', meaning: 'a' },
        { word: 'புத்தகம்', meaning: 'book' }
      ],
      wordsPool: ['ஒரு', 'இது', 'மரம்', 'புத்தகம்']
    },
    {
      sentence: 'அம்மா சாப்பாடு தருகிறார்',
      translit: 'Amma saappaadu tharugiraar',
      meaning: 'Mother is giving food',
      breakdown: [
        { word: 'அம்மா', meaning: 'Mother' },
        { word: 'சாப்பாடு', meaning: 'food' },
        { word: 'தருகிறார்', meaning: 'gives' }
      ],
      wordsPool: ['தருகிறார்', 'அம்மா', 'தந்தை', 'சாப்பாடு']
    },
    {
      sentence: 'எனக்கு தாகமாக இருக்கிறது',
      translit: 'Enakku thaagamaaga irukkiradhu',
      meaning: 'I am thirsty',
      breakdown: [
        { word: 'எனக்கு', meaning: 'To me' },
        { word: 'தாகமாக', meaning: 'thirsty' },
        { word: 'இருக்கிறது', meaning: 'is' }
      ],
      wordsPool: ['தாகமாக', 'இருக்கிறது', 'எனக்கு', 'பழம்']
    },
    {
      sentence: 'வானிலை நன்றாக உள்ளது',
      translit: 'Vaanilai nandraga ulladhu',
      meaning: 'The weather is good',
      breakdown: [
        { word: 'வானிலை', meaning: 'Weather' },
        { word: 'நன்றாக', meaning: 'good' },
        { word: 'உள்ளது', meaning: 'is' }
      ],
      wordsPool: ['நன்றாக', 'உள்ளது', 'வானிலை', 'சிங்கம்']
    }
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
  const [strokes, setStrokes] = useState([]);
  const currentStrokeRef = useRef([]);
  const [accuracyScore, setAccuracyScore] = useState(null);
  const [accuracyFeedback, setAccuracyFeedback] = useState('');

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
    const len = tracingLetter.length;
    const fontSize = len <= 1 ? '220px' : len <= 4 ? '110px' : len <= 8 ? '65px' : '36px';
    ctx.font = `${fontSize} "Outfit", "Noto Sans Tamil", sans-serif`;
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
    currentStrokeRef.current = [coords];
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
    currentStrokeRef.current.push(coords);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setStrokes(prev => [...prev, currentStrokeRef.current]);
      setIsDrawing(false);
    }
  };

  const redrawCanvas = (nextStrokes) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw notebook guidelines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, 100);
    ctx.lineTo(canvas.width - 20, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 300);
    ctx.lineTo(canvas.width - 20, 300);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Faint guide character
    ctx.fillStyle = '#f1f5f9';
    const len = tracingLetter.length;
    const fontSize = len <= 1 ? '220px' : len <= 4 ? '110px' : len <= 8 ? '65px' : '36px';
    ctx.font = `${fontSize} "Outfit", "Noto Sans Tamil", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tracingLetter, canvas.width / 2, canvas.height / 2);

    // 3. User strokes
    nextStrokes.forEach(stroke => {
      if (stroke.length < 1) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  };

  const handleResetCanvas = () => {
    setStrokes([]);
    setAccuracyScore(null);
    setAccuracyFeedback('');
    drawGuidelinesAndLetter();
  };

  const handleUndo = () => {
    setStrokes(prev => {
      const next = prev.slice(0, -1);
      redrawCanvas(next);
      return next;
    });
    setAccuracyScore(null);
    setAccuracyFeedback('');
  };

  const checkAccuracy = () => {
    if (strokes.length === 0) {
      setAccuracyScore(null);
      setAccuracyFeedback('Please draw or write something on the canvas first!');
      return;
    }

    const checkW = 100;
    const checkH = 100;

    // 1. Offscreen target
    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = checkW;
    targetCanvas.height = checkH;
    const tCtx = targetCanvas.getContext('2d');
    tCtx.fillStyle = 'black';
    const len = tracingLetter.length;
    const offscreenSize = len <= 1 ? '60px' : len <= 4 ? '30px' : len <= 8 ? '18px' : '10px';
    tCtx.font = `${offscreenSize} "Outfit", "Noto Sans Tamil", sans-serif`;
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillText(tracingLetter, checkW / 2, checkH / 2);
    const targetData = tCtx.getImageData(0, 0, checkW, checkH).data;

    // 2. Offscreen user drawing
    const userCanvas = document.createElement('canvas');
    userCanvas.width = checkW;
    userCanvas.height = checkH;
    const uCtx = userCanvas.getContext('2d');
    uCtx.strokeStyle = 'black';
    uCtx.lineWidth = Math.max(3, brushSize * (checkW / 400));
    uCtx.lineCap = 'round';
    uCtx.lineJoin = 'round';

    strokes.forEach(stroke => {
      if (stroke.length < 1) return;
      uCtx.beginPath();
      const scaleX = checkW / 400;
      const scaleY = checkH / 400;
      uCtx.moveTo(stroke[0].x * scaleX, stroke[0].y * scaleY);
      for (let i = 1; i < stroke.length; i++) {
        uCtx.lineTo(stroke[i].x * scaleX, stroke[i].y * scaleY);
      }
      uCtx.stroke();
    });
    const userData = uCtx.getImageData(0, 0, checkW, checkH).data;

    // 3. Pixel-wise overlapping calculation
    let targetPixels = 0;
    let userPixels = 0;
    let overlapPixels = 0;

    for (let i = 3; i < targetData.length; i += 4) {
      const isT = targetData[i] > 20;
      const isU = userData[i] > 20;

      if (isT) targetPixels++;
      if (isU) userPixels++;
      if (isT && isU) overlapPixels++;
    }

    if (targetPixels === 0) {
      setAccuracyScore(0);
      setAccuracyFeedback('Could not evaluate character layout.');
      return;
    }

    const coverage = overlapPixels / targetPixels;
    const precision = userPixels > 0 ? (overlapPixels / userPixels) : 0;

    // Balanced accuracy index (F1 score scaled)
    let score = 0;
    if (coverage + precision > 0) {
      score = Math.round((2 * coverage * precision / (coverage + precision)) * 100);
    }

    // Slightly scale up for tolerance towards drawing speed & line width difference
    score = Math.min(100, Math.round(score * 1.15));

    setAccuracyScore(score);

    if (score >= 85) {
      setAccuracyFeedback('✨ Outstanding! Excellent Tamil handwriting accuracy!');
    } else if (score >= 65) {
      setAccuracyFeedback('👍 Good job! Very close, keep practicing.');
    } else if (score >= 40) {
      setAccuracyFeedback('😊 Nice try. Follow the faint guidelines more closely.');
    } else {
      setAccuracyFeedback('✍️ Practice makes perfect. Try to trace the character lines.');
    }
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
      setStrokes([]);
      setAccuracyScore(null);
      setAccuracyFeedback('');
      setTimeout(drawGuidelinesAndLetter, 100);
    }
  }, [activeSubTab, tracingLetter]);

  // Redraw strokes when brush parameters change
  useEffect(() => {
    if (activeSubTab === 'drawing' && strokes.length > 0) {
      redrawCanvas(strokes);
    }
  }, [brushColor, brushSize]);

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
    // Stop any currently playing audio element
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (e) {}
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 1. Try Google Cloud TTS first if online (guarantees high quality pronunciation on all systems)
    if (navigator.onLine) {
      try {
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(text)}`;
        const audio = new Audio(audioUrl);
        activeAudio = audio;
        audio.play().catch(e => {
          console.warn("Google TTS play failed, trying local synthesis:", e);
          speakLocal(text);
        });
        return;
      } catch (err) {
        console.warn("Google TTS error, trying local synthesis:", err);
      }
    }
    
    // 2. Local fallback if offline
    speakLocal(text);
  };

  const speakLocal = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const taVoice = voices.find(v => v.lang.toLowerCase().includes('ta'));
      if (taVoice) {
        utterance.voice = taVoice;
      }
      utterance.lang = 'ta-IN';
      utterance.rate = 0.75;
      window.speechSynthesis.speak(utterance);
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
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(currentLevel === 'advanced' ? [
          { id: 'sentences', label: 'Simple Sentences (வாக்கியங்கள்)', icon: BookOpen },
          { id: 'drawing', label: 'Sentence Tracing & Canvas', icon: PenTool },
          { id: 'quiz', label: 'Sentence Quiz', icon: CheckCircle2 }
        ] : currentLevel === 'intermediate' ? [
          { id: 'words', label: 'Word Cards & Visuals', icon: BookOpen },
          { id: 'word_quiz', label: 'Word Builder Game', icon: Sparkles },
          { id: 'drawing', label: 'Word Tracing & Sandbox', icon: PenTool },
          { id: 'game', label: 'Memory Game (விளையாட்டு)', icon: Gamepad2 }
        ] : [
          { id: 'vowels', label: '12 Vowels (உயிரெழுத்துக்கள்)', icon: BookOpen },
          { id: 'consonants', label: '18 Consonants (மெய்யெழுத்துக்கள்)', icon: Layers },
          { id: 'builder', label: 'Compound Letter Builder', icon: Sparkles },
          { id: 'drawing', label: 'Letter Tracing & Draw (வரைதல்)', icon: PenTool },
          { id: 'game', label: 'Memory Game (விளையாட்டு)', icon: Gamepad2 },
          { id: 'quiz', label: 'Basics Quiz', icon: CheckCircle2 }
        ]).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                // Set default tracing text on tab change if drawing is selected
                if (tab.id === 'drawing') {
                  setTracingLetter(currentLevel === 'advanced' ? 'இது ஒரு புத்தகம்' : currentLevel === 'intermediate' ? 'அம்மா' : 'அ');
                }
              }}
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
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {currentLevel === 'advanced' ? 'Sentence Tracing Sandbox' : currentLevel === 'intermediate' ? 'Word Tracing Sandbox' : 'Letter Tracing Sandbox'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px', lineHeight: 1.4 }}>
              {currentLevel === 'advanced' ? 'Select a Tamil sentence from the dropdown. Trace inside the faint guide layout to practice syntax:' : currentLevel === 'intermediate' ? 'Select a Tamil word from the dropdown. Trace inside the faint guide layout to practice handwriting:' : 'Select a Tamil letter from the dropdown. Trace inside the faint guide layout to practice stroke order:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {currentLevel === 'advanced' ? 'Select Sentence' : currentLevel === 'intermediate' ? 'Select Word' : 'Select Character'}
                </label>
                <select 
                  value={tracingLetter} 
                  onChange={(e) => setTracingLetter(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', fontSize: '0.95rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  {(currentLevel === 'advanced' ? advancedSentences.map(s => s.sentence) : currentLevel === 'intermediate' ? intermediateWords.map(w => w.word) : allLetters).map((l, i) => (
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={handleResetCanvas}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button
                  onClick={handleUndo}
                  disabled={strokes.length === 0}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px', opacity: strokes.length === 0 ? 0.5 : 1, cursor: strokes.length === 0 ? 'not-allowed' : 'pointer' }}
                >
                  Undo Stroke
                </button>
                <button
                  onClick={() => speakLetter(tracingLetter)}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <Volume2 size={16} /> Pronounce
                </button>
                <button
                  onClick={checkAccuracy}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <Sparkles size={16} /> Check Accuracy
                </button>
              </div>

              {/* Accuracy Feedback */}
              {accuracyScore !== null ? (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: accuracyScore >= 70 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  borderLeft: `4px solid ${accuracyScore >= 70 ? '#10b981' : '#ef4444'}`,
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Handwriting Score</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: accuracyScore >= 70 ? '#10b981' : '#ef4444' }}>
                      {accuracyScore}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{
                      width: `${accuracyScore}%`,
                      height: '100%',
                      background: accuracyScore >= 70 ? '#10b981' : '#ef4444',
                      transition: 'width 0.4s ease-out'
                    }} />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {accuracyFeedback}
                  </p>
                </div>
              ) : accuracyFeedback ? (
                <div style={{
                  marginTop: '16px',
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  borderLeft: '4px solid #ef4444',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)'
                }}>
                  {accuracyFeedback}
                </div>
              ) : null}
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

      {/* Intermediate Words Workspace */}
      {activeSubTab === 'words' && (
        <div className="glass-panel animate-fade-in" style={{ background: 'white', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tamil Word Cards (வார்த்தைகள்)</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Explore intermediate words. Click a card to read, hear pronunciation, and visualize the vocabulary details:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {intermediateWords.map((w, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'white',
                  border: selectedWordIndex === idx ? '2px solid var(--accent-primary)' : '1px solid var(--panel-border)',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  transform: selectedWordIndex === idx ? 'translateY(-2px)' : 'none'
                }}
                onClick={() => {
                  setSelectedWordIndex(idx);
                  setWordBuildProgress([]);
                  setWordQuizFeedback(null);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '3rem' }}>{w.visual}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakLetter(w.word);
                    }}
                    className="logo-glow"
                    style={{
                      border: 'none',
                      background: 'var(--accent-primary-glow)',
                      color: 'var(--accent-primary)',
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block' }}>{w.word}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>{w.translit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Meaning:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{w.meaning}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Spelling:</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '2px' }}>
                    {w.breakdown.join(' + ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Word Builder Quiz Workspace */}
      {activeSubTab === 'word_quiz' && (
        <div className="glass-panel animate-fade-in" style={{ background: 'white', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '4px', maxWidth: '600px', margin: '0 auto' }}>
          {(() => {
            const currentWordObj = intermediateWords[selectedWordIndex];
            const isCompleted = wordBuildProgress.length === currentWordObj.breakdown.length;
            const formedWord = wordBuildProgress.join('');
            const isCorrect = formedWord === currentWordObj.word;

            const handleLetterClick = (letter) => {
              if (wordBuildProgress.length < currentWordObj.breakdown.length) {
                const nextProgress = [...wordBuildProgress, letter];
                setWordBuildProgress(nextProgress);

                if (nextProgress.length === currentWordObj.breakdown.length) {
                  const checkVal = nextProgress.join('');
                  if (checkVal === currentWordObj.word) {
                    setWordQuizFeedback('correct');
                    speakLetter(currentWordObj.word);
                  } else {
                    setWordQuizFeedback('wrong');
                  }
                }
              }
            };

            const resetWordQuiz = () => {
              setWordBuildProgress([]);
              setWordQuizFeedback(null);
            };

            const nextWordQuiz = () => {
              setSelectedWordIndex((selectedWordIndex + 1) % intermediateWords.length);
              setWordBuildProgress([]);
              setWordQuizFeedback(null);
            };

            return (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '8px' }}>{currentWordObj.visual}</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 4px 0', fontWeight: 700 }}>
                    Build Word: <span style={{ color: 'var(--accent-primary)' }}>{currentWordObj.meaning.toUpperCase()} ({currentWordObj.translit})</span>
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
                    Click the scrambled letters below in correct order to spell the Tamil word!
                  </p>
                </div>

                {/* Slots View */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
                  {currentWordObj.breakdown.map((_, idx) => {
                    const filled = wordBuildProgress[idx];
                    return (
                      <div
                        key={idx}
                        style={{
                          width: '56px',
                          height: '56px',
                          border: filled ? '2px solid var(--accent-primary)' : '2px dashed #cbd5e1',
                          borderRadius: '8px',
                          background: filled ? 'var(--accent-primary-glow)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: 'var(--accent-primary)',
                          transition: 'all 0.15s'
                        }}
                      >
                        {filled || ''}
                      </div>
                    );
                  })}
                </div>

                {/* Feedback Dialog */}
                {wordQuizFeedback && (
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      marginBottom: '20px',
                      background: wordQuizFeedback === 'correct' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${wordQuizFeedback === 'correct' ? 'var(--success)' : 'var(--error)'}`,
                      color: wordQuizFeedback === 'correct' ? 'var(--success)' : 'var(--error)',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    {wordQuizFeedback === 'correct' ? (
                      <div>
                        <span>✨ Excellent! Correctly spelled: {currentWordObj.word} ({currentWordObj.translit})</span>
                      </div>
                    ) : (
                      <div>
                        <span>❌ Incorrect spelling. Give it another try!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Pool of letter choices */}
                {!wordQuizFeedback && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {currentWordObj.lettersPool.map((letter, lIdx) => {
                      const usedCount = wordBuildProgress.filter(x => x === letter).length;
                      const maxCount = currentWordObj.lettersPool.filter(x => x === letter).length;
                      const disabled = usedCount >= maxCount;

                      return (
                        <button
                          key={lIdx}
                          onClick={() => handleLetterClick(letter)}
                          disabled={disabled}
                          style={{
                            padding: '10px 20px',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            background: disabled ? '#f1f5f9' : 'white',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            color: disabled ? '#94a3b8' : 'var(--text-primary)',
                            boxShadow: disabled ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.1s'
                          }}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Navigation actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={resetWordQuiz} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    Reset Builder
                  </button>
                  <button onClick={nextWordQuiz} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Next Word
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Advanced Sentences & Scrambler Workspace */}
      {activeSubTab === 'sentences' && (
        <div className="glass-panel animate-fade-in" style={{ background: 'white', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Advanced Sentence Clinic (வாக்கியங்கள்)</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Practice structuring simple Tamil sentences. Study word structures and play the Sentence Scrambler game to build fluency:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Left side: Sentences selector & Breakdown */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {advancedSentences.map((s, idx) => (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'white',
                      border: selectedSentenceIndex === idx ? '2px solid var(--accent-primary)' : '1px solid var(--panel-border)',
                      borderRadius: '6px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                      transition: 'all 0.15s'
                    }}
                    onClick={() => {
                      setSelectedSentenceIndex(idx);
                      setSentenceBuildProgress([]);
                      setSentenceQuizFeedback(null);
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{s.sentence}</span>
                      <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.translit}</span>
                      <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: '2px' }}>{s.meaning}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakLetter(s.sentence);
                      }}
                      className="logo-glow"
                      style={{
                        border: 'none',
                        background: 'var(--accent-primary-glow)',
                        color: 'var(--accent-primary)',
                        padding: '8px',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Selected breakdown structure details */}
              <div style={{ background: '#f8fafc', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Structure Analysis</h4>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {advancedSentences[selectedSentenceIndex].breakdown.map((item, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center', minWidth: '90px' }}>
                      <span style={{ display: 'block', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.word}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Interactive Scrambler */}
            <div className="glass-panel" style={{ background: '#f8fafc', padding: '24px', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
              {(() => {
                const targetObj = advancedSentences[selectedSentenceIndex];
                const cleanTargetParts = targetObj.sentence.split(' ');
                const isCorrect = sentenceBuildProgress.join(' ') === targetObj.sentence;
                const isFinished = sentenceBuildProgress.length === cleanTargetParts.length;

                const handleWordClick = (word) => {
                  if (sentenceBuildProgress.length < cleanTargetParts.length) {
                    const nextProgress = [...sentenceBuildProgress, word];
                    setSentenceBuildProgress(nextProgress);

                    if (nextProgress.length === cleanTargetParts.length) {
                      const formed = nextProgress.join(' ');
                      if (formed === targetObj.sentence) {
                        setSentenceQuizFeedback('correct');
                        speakLetter(targetObj.sentence);
                      } else {
                        setSentenceQuizFeedback('wrong');
                      }
                    }
                  }
                };

                const resetScrambler = () => {
                  setSentenceBuildProgress([]);
                  setSentenceQuizFeedback(null);
                };

                return (
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, textAlign: 'center' }}>Sentence Scrambler</h4>
                    <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Arrange the words in correct grammatical sequence to mean: <strong>"{targetObj.meaning}"</strong>
                    </p>

                    {/* Build Box */}
                    <div style={{ minHeight: '60px', padding: '10px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
                      {sentenceBuildProgress.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Select words below...</span>}
                      {sentenceBuildProgress.map((word, idx) => (
                        <div key={idx} style={{ background: 'var(--accent-primary-glow)', padding: '6px 12px', border: '1px solid var(--accent-primary)', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                          {word}
                        </div>
                      ))}
                    </div>

                    {sentenceQuizFeedback && (
                      <div
                        style={{
                          padding: '12px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          marginBottom: '20px',
                          background: sentenceQuizFeedback === 'correct' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          border: `1px solid ${sentenceQuizFeedback === 'correct' ? 'var(--success)' : 'var(--error)'}`,
                          color: sentenceQuizFeedback === 'correct' ? 'var(--success)' : 'var(--error)',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        {sentenceQuizFeedback === 'correct' ? '✨ Perfect! Sentence formed correctly!' : '❌ Incorrect syntax sequence. Reset and try again.'}
                      </div>
                    )}

                    {!sentenceQuizFeedback && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                        {targetObj.wordsPool.map((word, wIdx) => {
                          const clickCount = sentenceBuildProgress.filter(x => x === word).length;
                          const poolCount = targetObj.wordsPool.filter(x => x === word).length;
                          const clicked = clickCount >= poolCount;

                          return (
                            <button
                              key={wIdx}
                              onClick={() => handleWordClick(word)}
                              disabled={clicked}
                              style={{
                                padding: '8px 16px',
                                background: clicked ? '#cbd5e1' : 'white',
                                color: clicked ? '#94a3b8' : 'var(--text-primary)',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                fontSize: '0.88rem',
                                fontWeight: 'bold',
                                cursor: clicked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.1s'
                              }}
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button onClick={resetScrambler} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}>
                      Reset Scrambler
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
