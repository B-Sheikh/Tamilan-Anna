import React, { useState } from 'react';
import { GraduationCap, Volume2, Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

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

  // Vowel signs combinations helper
  const consonantBases = ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'];
  const vowelSigns = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];
  const vowelSounds = ['a', 'aa', 'i', 'ee', 'u', 'uu', 'e', 'ae', 'ai', 'o', 'oo', 'au'];

  // Speech helper
  const speakLetter = (text, isTamilText = true) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (isTamilText) {
        const voices = window.speechSynthesis.getVoices();
        const taVoice = voices.find(v => v.lang.includes('ta') || v.lang.includes('TA'));
        if (taVoice) utterance.voice = taVoice;
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 0.8;
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
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px', marginBottom: '20px' }}>
        {[
          { id: 'vowels', label: '12 Vowels (உயிரெழுத்துக்கள்)', icon: BookOpen },
          { id: 'consonants', label: '18 Consonants (மெய்யெழுத்துக்கள்)', icon: Layers },
          { id: 'builder', label: 'Compound Letter Builder', icon: Sparkles },
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
                      onClick={() => speakLetter(v.char)} 
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
                      onClick={() => speakLetter(c.char)} 
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
              onClick={() => speakLetter(getCombinedLetter(selectedConsonant, selectedVowel))}
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

    </div>
  );
}
