import React, { useState, useEffect } from 'react';
import Conversations from './components/Conversations';
import SpellingGrammar from './components/SpellingGrammar';
import VideoSection from './components/VideoSection';
import TamilKeyboard from './components/TamilKeyboard';
import TamilBasics from './components/TamilBasics';
import {
  BookOpen,
  MessageSquare,
  Video,
  SpellCheck,
  BarChart3,
  Lock,
  Award,
  Flame,
  Target,
  Send,
  LogOut,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  Compass,
  CheckCircle,
  Volume2,
  Keyboard
} from 'lucide-react';


export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // Toggle between Landing Page & Login Page
  const [activeTab, setActiveTab] = useState('dashboard');

  // Interactive preview state for landing page
  const [previewText, setPreviewText] = useState('வணக்');

  // Helper to validate if the key starts with the standard Gemini prefix 'AIzaSy'
  const isValidGeminiKey = (key) => typeof key === 'string' && key.trim().startsWith('AIzaSy');

  // TO USE GEMINI LIVE FEATURE: Put your Gemini API Key directly inside the quotes below,
  // or define VITE_GEMINI_API_KEY in a .env file.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAolOx00GdQ-lqQKTigvWtoxaZ6E6h4Jlc';

  // Custom user level profile state
  const [loginForm, setLoginForm] = useState({
    name: '',
    level: 'beginner',
    pin: ''
  });

  // User Stats & Activity Tracker
  const [stats, setStats] = useState({
    streak: 0,
    accuracy: 0,
    drills: 0,
    conversations: 0
  });

  const [activities, setActivities] = useState([]);

  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'translation',
    message: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // AI Tutor Bot State Definitions
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorMessages, setTutorMessages] = useState([
    { role: 'assistant', text: 'வணக்கம்! I am Tutor Anna (தமிழன் அண்ணா), your virtual Tamil companion. Ask me any doubts about spelling, grammar, or conversations!' }
  ]);
  const [tutorLoading, setTutorLoading] = useState(false);
  const [showTutorKeyboard, setShowTutorKeyboard] = useState(false);
  const tutorChatEndRef = React.useRef(null);
  const tutorInputRef = React.useRef(null);

  useEffect(() => {
    if (tutorChatEndRef.current) {
      tutorChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tutorMessages, tutorLoading]);


  const predefinedPrompts = [
    { label: "Quiz me on Vowels", query: "Give me a quick 3-question quiz on Tamil vowel letters. Ask one question at a time and wait for my response." },
    { label: "Explain 'zha' (ழ)", query: "Explain the difference between 'la' (ல), 'lla' (ள), and the special retroflex 'zha' (ழ) sound in Tamil, with examples." },
    { label: "Translate challenge", query: "Give me a sentence in English to translate into Tamil, and evaluate my response." },
    { label: "Common greetings", query: "What are 5 essential greetings in Tamil with their meanings?" }
  ];

  const handleTutorSubmit = async (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = { role: 'user', text: queryText };
    setTutorMessages(prev => [...prev, userMsg]);
    setTutorQuery('');
    setTutorLoading(true);

    if (!isValidGeminiKey(apiKey)) {
      setTimeout(() => {
        let replyText = "I am currently in practice mode. To get dynamic answers from Tutor Anna, please add a valid Gemini API Key directly to the code in App.jsx (or in a .env file)!";
        if (queryText.includes("zha") || queryText.includes("ழ")) {
          replyText = "In Tamil, there are three 'L' sounds:\n\n1) ல (dental L, tongue touching front teeth, like 'light')\n2) ள (retroflex L, tongue folded back, like 'wall')\n3) ழ (unique retroflex approximant, tongue tip curled back near roof without touching it, like 'Zha' in 'Tamil' - தமிழ்).";
        } else if (queryText.toLowerCase().includes("quiz")) {
          replyText = "Sure! Here is Question 1: What is the very first vowel letter (உயிரெழுத்து) in Tamil?";
        } else if (queryText.toLowerCase().includes("translate")) {
          replyText = "Translate this phrase: 'Where is the railway station?' into Tamil. (Use the on-screen keyboard to respond!)";
        } else if (queryText.toLowerCase().includes("greeting") || queryText.toLowerCase().includes("essential")) {
          replyText = "Here are 5 essential greetings:\n\n1. வணக்கம் (Vanakkam) - Hello / Greetings\n2. நன்றி (Nandri) - Thank you\n3. நல்வரவு (Nalvaravu) - Welcome\n4. காலை வணக்கம் (Kaalai Vanakkam) - Good morning\n5. போய் வருகிறேன் (Poi varugiren) - Goodbye (literally: I will go and return)";
        }
        setTutorMessages(prev => [...prev, { role: 'assistant', text: replyText }]);
        setTutorLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are Tutor Anna, a highly helpful, student-friendly AI Tamil tutor. The user asks: "${queryText}". Answer in simple, concise English with Tamil examples where appropriate. Keep it clear, neat, and structured for school kids.` }] }]
          })
        }
      );

      if (!response.ok) throw new Error("Gemini API error");

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Try again!";
      setTutorMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch (e) {
      setTutorMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to AI tutor. Make sure your Gemini API Key in App.jsx is valid." }]);
    } finally {
      setTutorLoading(false);
    }
  };

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('tamilan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.name.trim()) return;

    const newUser = {
      name: loginForm.name,
      level: loginForm.level
    };

    localStorage.setItem('tamilan_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('tamilan_user');
    setUser(null);
    setShowLogin(false);
    setActiveTab('dashboard');
  };

  // Activity logger callback for subcomponents
  const handleLogActivity = (type, data) => {
    let newDetail = '';
    let newStats = { ...stats };

    if (type === 'grammar_check') {
      newDetail = `Run Grammar Check on text (${data.words} words) - Score: ${data.score}%`;
      newStats.drills += 1;
      newStats.accuracy = stats.accuracy === 0 ? data.score : Math.round((stats.accuracy * 4 + data.score) / 5);
    } else if (type === 'pronunciation_check') {
      newDetail = `Speech practice on "${data.scenario}" - Match rate: ${data.score}%`;
      newStats.accuracy = stats.accuracy === 0 ? data.score : Math.round((stats.accuracy * 4 + data.score) / 5);
    } else if (type === 'completed_scenario') {
      newDetail = `Completed Conversation Module: "${data.title}"`;
      newStats.conversations += 1;
      newStats.streak = stats.streak === 0 ? 1 : stats.streak + 1;
    }

    const newAct = {
      id: Date.now(),
      type,
      timestamp: 'Just now',
      detail: newDetail
    };

    setActivities(prev => [newAct, ...prev]);
    setStats(newStats);
  };

  // Submit platform feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;

    const newFeedback = {
      id: Date.now(),
      category: feedbackForm.category,
      message: feedbackForm.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setFeedbackList(prev => [newFeedback, ...prev]);
    setFeedbackForm({ category: 'translation', message: '' });
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  // Render Customized Experience suggestions based on level
  const getLevelGuide = () => {
    switch (user?.level) {
      case 'intermediate':
        return {
          title: "Intermediate Mastery (இடைநிலை படிப்பு)",
          goals: ["Practice Restaurant ordering dialogues", "Check complex compound sentences in Spelling Clinic", "Examine Tamil Virtual Academy's grammar rules videos."],
          recommendation: "Focus on consonant doubled combinations (வலிமிகல் rules)."
        };
      case 'advanced':
        return {
          title: "Advanced Literacy (உயர்தர இலக்கியம்)",
          goals: ["Discuss advanced directions and directions dialogue", "Check classical composition styles and formal writing structures", "Submit translations feedback to tutor feed."],
          recommendation: "Explore literature and high-level prose writing formatting."
        };
      default:
        return {
          title: "Beginner Essentials (தொடக்க நிலை)",
          goals: ["Learn basic Tamil alphabet vowels", "Complete Greetings module in Pronunciation Coach", "Use the virtual keyboard to spell simple words like 'அம்மா'."],
          recommendation: "Practice pronunciation rules for 'Zha' (ழ) and hard consonant sounds."
        };
    }
  };

  // 1. LANDING PAGE (Clean, educational, split-layout with visual depth)
  if (!user && !showLogin) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>

        {/* Soft Colorful Backdrop Glazes */}
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.07)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '350px', height: '350px', background: 'rgba(13, 148, 136, 0.08)', filter: 'blur(90px)', borderRadius: '50%', zIndex: -1 }}></div>

        {/* Navigation Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
              <BookOpen size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
              Tamilan Anna
            </h2>
          </div>
          <button onClick={() => setShowLogin(true)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Enter Classroom
          </button>
        </header>

        {/* Hero Section Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '50px', alignItems: 'center', minHeight: '500px', position: 'relative', zIndex: 10 }}>
          {/* Left Column: Hand-crafted Copywriting */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', display: 'block', marginBottom: '16px' }}>
              A friendly companion for Tamil students
            </span>
            <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', margin: '0 0 20px 0', fontWeight: 700, lineHeight: '1.15', letterSpacing: '-0.5px' }}>
              Learn Tamil.<br />Speak, write & practice.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px', maxWidth: '480px' }}>
              A quiet and clean digital space built to practice Tamil conversations with pronunciation feedback, correct spelling mistakes, and access structured TVA lessons.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowLogin(true)} className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                Create Study Card <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Tactile Interactive Preview Card & Hero Image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Hand-crafted Flat illustration */}
            <div style={{ textAlign: 'center' }}>
              <img
                src="/hero.png"
                alt="Student learning illustration"
                style={{ width: '100%', maxWidth: '340px', height: 'auto', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Tactile Interactive Preview Card */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.12)', boxShadow: '0 8px 30px rgba(99, 102, 241, 0.03)' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>LIVE KEYBOARD PRACTICE DEMO</span>
                <span className="dot-pulse"></span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '4px', marginBottom: '14px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                <input
                  type="text"
                  value={previewText}
                  readOnly
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center', width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
                />
              </div>

              {/* Clickable Keyboard Keys preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  {['க', 'ம', 'த', 'ந'].map(char => (
                    <button
                      key={char}
                      onClick={() => setPreviewText(prev => prev + char)}
                      className="demo-key"
                    >
                      {char}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  {['ா', 'ி', 'ு', '்'].map(mod => (
                    <button
                      key={mod}
                      onClick={() => setPreviewText(prev => prev + mod)}
                      className="demo-key modifier"
                    >
                      {mod}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '4px' }}>
                  <button
                    onClick={() => setPreviewText('')}
                    className="demo-key clear-btn"
                    style={{ flexGrow: 1, fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setPreviewText('வணக்கம்')}
                    className="demo-key submit-demo-btn"
                    style={{ flexGrow: 2, fontSize: '0.75rem', padding: '6px 12px', color: 'white', background: 'var(--accent-primary)', border: 'none' }}
                  >
                    Spell check!
                  </button>
                </div>
              </div>

              {previewText === 'வணக்கம்' && (
                <div className="animate-fade-in" style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.08)', padding: '10px 12px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.15)', fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✓ Spell-check: "வணக்கம்" is 100% correct!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Small Trust Badges / TVA link */}
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '80px', borderTop: '1px solid #f1f5f9', paddingTop: '32px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>100% Free</span> Learning Tools
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Voice feedback</span> with Web Speech API
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Official TVA</span> Video Library
          </div>
        </div>

        <style>{`
          .demo-key {
            padding: 6px 10px;
            border: 1px solid #cbd5e1;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.1s ease;
          }
          .demo-key:hover {
            border-color: var(--accent-primary);
            background: #f1f5f9;
          }
          .demo-key.modifier {
            background: #f8fafc;
            border-color: rgba(99,102,241,0.15);
          }
          .demo-key.modifier:hover {
            border-color: var(--accent-secondary);
            background: #f1f5f9;
          }
          .demo-key.clear-btn {
            border-color: rgba(239, 68, 68, 0.2);
            color: var(--error);
          }
          .demo-key.clear-btn:hover {
            background: rgba(239, 68, 68, 0.04);
          }
          .dot-pulse {
            width: 8px;
            height: 8px;
            background: var(--success);
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            animation: pulseDot 1.5s infinite;
          }
          @keyframes pulseDot {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
        `}</style>
      </div>
    );
  }

  // 2. LOGIN PAGE
  if (!user && showLogin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <form onSubmit={handleLogin} className="glass-panel login-card animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '450px', background: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="logo-glow" style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <GraduationCap size={44} />
            </div>
            <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: 'var(--text-primary)', fontWeight: 700 }}>Welcome Learner</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create your customized student learning card</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>YOUR NAME</label>
              <input
                type="text"
                value={loginForm.name}
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                required
                className="form-input"
                placeholder="Enter your student name..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>YOUR TAMIL LEVEL</label>
              <select
                value={loginForm.level}
                onChange={(e) => setLoginForm({ ...loginForm, level: e.target.value })}
                className="form-input"
                style={{ background: 'white' }}
              >
                <option value="beginner">Beginner (தொடக்க நிலை)</option>
                <option value="intermediate">Intermediate (இடைநிலை)</option>
                <option value="advanced">Advanced (உயர்நிலை)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>STUDENT PIN (Optional)</label>
              <input
                type="password"
                value={loginForm.pin}
                onChange={(e) => setLoginForm({ ...loginForm, pin: e.target.value })}
                className="form-input"
                placeholder="Pick any pin code..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowLogin(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Back
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Enter Sanctuary
              </button>
            </div>
          </div>
        </form>

        <style>{`
          .login-card {
            border-color: rgba(99, 102, 241, 0.2);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
          }
          .logo-glow {
            animation: pulseGlow 3s infinite;
          }
        `}</style>
      </div>
    );
  }

  const guide = getLevelGuide();

  // 3. CLASSROOM DASHBOARD VIEW
  return (
    <div className="layout-container">
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ background: '#ffffff', borderRight: '1px solid var(--panel-border)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Logo Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: 'var(--accent-primary)', background: 'var(--accent-primary-glow)', padding: '8px', borderRadius: '10px' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Tamilan Anna</h2>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>AI Classroom</span>
            </div>
          </div>

          {/* User Profile Mini */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99, 102, 241, 0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.08)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</h4>
              <span className={`badge-level ${user.level}`} style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{user.level}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'basics', label: 'Letters & Basics', icon: GraduationCap },
              { id: 'tutor', label: 'Chat with Tutor Anna', icon: MessageSquare },
              { id: 'conversation', label: 'Conversations & Voice', icon: Volume2 },
              { id: 'grammar', label: 'Spelling & Grammar', icon: SpellCheck },
              { id: 'videos', label: 'TVA Video Academy', icon: Video }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`nav-btn ${activeTab === item.id ? 'nav-active' : ''}`}
                >
                  <Icon size={18} /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls inside sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleLogout}
            className="nav-btn-logout"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogOut size={18} /> Logout Portal
          </button>
        </div>
      </aside>

      {/* CONTENT WORKSPACE */}
      <main style={{ padding: '32px', overflowY: 'auto', maxHeight: '100vh' }}>

        {/* TOP STATUS BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' workspace'}
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tamilan Anna Classroom v1.0 • Connected to {isValidGeminiKey(apiKey) ? 'Gemini Live' : 'Simulated AI local engine'}
            </span>
          </div>
          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="mini-stat-card">
              <Flame size={16} className="icon-orange" />
              <span>{stats.streak} Day Streak</span>
            </div>
            <div className="mini-stat-card">
              <Award size={16} className="icon-gold" />
              <span>{stats.accuracy}% Avg Score</span>
            </div>
          </div>
        </div>

        {/* MAIN TAB SWITCHER */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Custom learning guide banner based on user level */}
            <div className="glass-panel guide-banner" style={{ padding: '24px', borderLeft: '4px solid var(--accent-primary)', background: 'white' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'var(--accent-primary-glow)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                  <Target size={28} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 600 }}>{guide.title}</h3>
                  <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Based on your profile, we customized the syllabus path below:
                  </p>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {guide.goals.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                    🎯 TIP: {guide.recommendation}
                  </span>
                </div>
              </div>
            </div>

            {/* CURRICULUM SYLLABUS PATHWAYS GRID */}
            <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Compass className="icon-cyan" size={20} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Interactive Syllabus Pathways</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Module 1 */}
                <div className="syllabus-module-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="module-label">MODULE 1</span>
                    {stats.drills > 0 ? (
                      <span className="module-status-completed"><CheckCircle size={14} /> Completed</span>
                    ) : (
                      <span className="module-status-pending">Not Started</span>
                    )}
                  </div>
                  <h4 className="module-title">Alphabets & Modifiers</h4>
                  <p className="module-desc">Type letters mother (அம்மா) using combined vowel modifier keys.</p>
                  <button onClick={() => setActiveTab('grammar')} className="module-action-btn">
                    Open Keyboard <PlayCircle size={14} />
                  </button>
                </div>

                {/* Module 2 */}
                <div className="syllabus-module-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="module-label">MODULE 2</span>
                    {stats.conversations > 0 ? (
                      <span className="module-status-completed"><CheckCircle size={14} /> Completed</span>
                    ) : (
                      <span className="module-status-pending">Not Started</span>
                    )}
                  </div>
                  <h4 className="module-title">First Conversation</h4>
                  <p className="module-desc">Introduce yourself and speak standard Tamil greetings aloud.</p>
                  <button onClick={() => setActiveTab('conversation')} className="module-action-btn">
                    Start Dialogue <PlayCircle size={14} />
                  </button>
                </div>

                {/* Module 3 */}
                <div className="syllabus-module-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="module-label">MODULE 3</span>
                    {stats.accuracy >= 80 ? (
                      <span className="module-status-completed"><CheckCircle size={14} /> Completed</span>
                    ) : (
                      <span className="module-status-pending">Not Started</span>
                    )}
                  </div>
                  <h4 className="module-title">Restaurant Order</h4>
                  <p className="module-desc">Order a masala dosa & ask for less spicy configurations.</p>
                  <button onClick={() => setActiveTab('conversation')} className="module-action-btn">
                    Start Dialogue <PlayCircle size={14} />
                  </button>
                </div>

                {/* Module 4 */}
                <div className="syllabus-module-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="module-label">MODULE 4</span>
                    {stats.drills > 2 ? (
                      <span className="module-status-completed"><CheckCircle size={14} /> Completed</span>
                    ) : (
                      <span className="module-status-pending">Not Started</span>
                    )}
                  </div>
                  <h4 className="module-title">Grammar Rules clinic</h4>
                  <p className="module-desc">Check common doubled rules (வலிமிகல் rules) for letters.</p>
                  <button onClick={() => setActiveTab('grammar')} className="module-action-btn">
                    Check Syntax <PlayCircle size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel stat-box" style={{ background: 'white' }}>
                <span className="stat-label">Daily Streak</span>
                <span className="stat-val text-orange">{stats.streak} Days</span>
              </div>
              <div className="glass-panel stat-box" style={{ background: 'white' }}>
                <span className="stat-label">Pronunciation Score</span>
                <span className="stat-val text-purple">{stats.accuracy}%</span>
              </div>
              <div className="glass-panel stat-box" style={{ background: 'white' }}>
                <span className="stat-label">Grammar Drills Done</span>
                <span className="stat-val text-blue">{stats.drills} completed</span>
              </div>
              <div className="glass-panel stat-box" style={{ background: 'white' }}>
                <span className="stat-label">Dialogues Finished</span>
                <span className="stat-val text-green">{stats.conversations} modules</span>
              </div>
            </div>

            {/* Bottom Row - Split: Activity Log / Feedback */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              {/* Activity feeds */}
              <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Performance Activity Logs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activities.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No activity logged yet. Start practicing conversations or check spelling to build your performance cards!
                    </div>
                  ) : (
                    activities.map(act => (
                      <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-primary)', display: 'block' }}>{act.detail}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Type: {act.type.replace('_', ' ')}</span>
                        </div>
                        <span style={{ color: 'var(--accent-secondary)', fontSize: '0.75rem' }}>{act.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Real-time Content Feedback */}
              <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Submit Content Feedback</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                  Report translations errors, bad pronunciation audio, or keyboard mapping bugs.
                </p>

                {feedbackSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--success)' }}>
                    <CheckCircle2 size={36} style={{ margin: '0 auto 8px auto' }} />
                    <span style={{ display: 'block', fontWeight: 600 }}>Feedback Recorded!</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thank you for helping us refine the curriculum!</span>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FEEDBACK CATEGORY</label>
                      <select
                        value={feedbackForm.category}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                        className="form-input"
                        style={{ padding: '8px 12px', fontSize: '0.85rem', background: 'white' }}
                      >
                        <option value="translation">Translation error</option>
                        <option value="pronunciation">Pronunciation feedback</option>
                        <option value="keyboard">Keyboard interface bug</option>
                        <option value="other">General suggestion</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DETAILED MSG</label>
                      <textarea
                        value={feedbackForm.message}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                        required
                        className="form-input"
                        rows={3}
                        placeholder="Write down the issue or suggestion..."
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', justifyContent: 'center' }}>
                      Send Feedback <Send size={14} />
                    </button>
                  </form>
                )}

                {/* Feedback lists */}
                {feedbackList.length > 0 && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--panel-border)', paddingTop: '12px' }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>PREVIOUS REVIEWS:</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {feedbackList.map(item => (
                        <div key={item.id} style={{ padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>[{item.category.toUpperCase()}]</span>
                            <span style={{ color: 'var(--text-muted)' }}>{item.timestamp}</span>
                          </div>
                          <span style={{ color: 'var(--text-primary)' }}>{item.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'basics' && (
          <TamilBasics />
        )}

        {activeTab === 'tutor' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', height: 'calc(100vh - 190px)' }}>
            {/* Left Column: Chat Container */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', background: 'white', height: '100%', overflow: 'hidden', padding: '0', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--panel-border)', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tutor Anna (தமிழன் அண்ணா)</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your Tamil Language Companion</span>
                  </div>
                </div>
                <button
                  onClick={() => setTutorMessages([{ role: 'assistant', text: 'வணக்கம்! I am Tutor Anna (தமிழன் அண்ணா), your virtual Tamil companion. Ask me any doubts about spelling, grammar, or conversations!' }])}
                  className="module-action-btn"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  Clear History
                </button>
              </div>

              {/* Message Area */}
              <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: '#fcfcfd' }}>
                {tutorMessages.map((msg, index) => (
                  <div key={index} className={`tutor-msg-bubble ${msg.role === 'user' ? 'student-bubble' : 'anna-bubble'}`} style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '4px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'var(--accent-primary-glow)' : '#ffffff', border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid #cbd5e1' }}>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                      {msg.role === 'user' ? 'YOU' : 'TUTOR ANNA'}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: '1.5', color: 'var(--text-primary)' }}>{msg.text}</p>
                  </div>
                ))}
                {tutorLoading && (
                  <div className="tutor-msg-bubble anna-bubble" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #cbd5e1', padding: '12px 16px', borderRadius: '4px' }}>
                    <div className="spinner-mini"></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tutor Anna is thinking...</span>
                  </div>
                )}
                <div ref={tutorChatEndRef} />
              </div>

              {/* Keyboard Option & Input Form */}
              <div style={{ borderTop: '1px solid var(--panel-border)', padding: '16px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowTutorKeyboard(!showTutorKeyboard)}
                    className="module-action-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    <Keyboard size={14} /> {showTutorKeyboard ? 'Hide' : 'Show'} Tamil Keyboard
                  </button>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Type in English or Tamil</span>
                </div>

                {showTutorKeyboard && (
                  <div style={{ marginBottom: '12px', border: '1px solid #cbd5e1', padding: '8px', background: '#ffffff', borderRadius: '4px' }}>
                    <TamilKeyboard onKeyPress={(val) => setTutorQuery(val)} targetInputRef={tutorInputRef} />
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleTutorSubmit(tutorQuery); }} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    ref={tutorInputRef}
                    type="text"
                    value={tutorQuery}
                    onChange={(e) => setTutorQuery(e.target.value)}
                    placeholder="Ask a Tamil doubt, e.g. How to say hello? or write in Tamil..."
                    className="form-input"
                    style={{ flexGrow: 1, padding: '10px 14px', fontSize: '0.9rem', borderRadius: '4px' }}
                    disabled={tutorLoading}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '4px' }}
                    disabled={tutorLoading || !tutorQuery.trim()}
                  >
                    Send <Send size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Predefined Prompts & Help */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
              {/* Quick Prompts Panel */}
              <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Quick Study Prompts</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px', lineHeight: '1.4' }}>
                  Click on any of the study prompts below to instantly start an interactive lesson or quiz with Tutor Anna:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {predefinedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      disabled={tutorLoading}
                      onClick={() => handleTutorSubmit(p.query)}
                      className="syllabus-module-card"
                      style={{ textDecoration: 'none', textAlign: 'left', cursor: 'pointer', padding: '12px', border: '1px solid #cbd5e1', transition: 'all 0.15s', background: '#ffffff', borderRadius: '4px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{p.label}</span>
                        <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                      </div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {p.query}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tips Panel */}
              <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--panel-border)', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>💡 Learning Tips</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
                  <li>Use the <strong>Tamil Keyboard</strong> to practice spelling letters directly with modifiers.</li>
                  <li>Ask Tutor Anna to translate any phrase by typing "Translate: [your sentence]".</li>
                  <li>If you are looking for video materials, head over to the <strong>TVA Video Academy</strong> tab!</li>
                  <li>Practice makes perfect—try to keep a streak going on your Dashboard.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conversation' && (
          <Conversations apiKey={apiKey} onLogActivity={handleLogActivity} />
        )}

        {activeTab === 'grammar' && (
          <SpellingGrammar apiKey={apiKey} onLogActivity={handleLogActivity} />
        )}

        {activeTab === 'videos' && (
          <VideoSection />
        )}
      </main>

      <style>{`
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 12px 16px;
          border-radius: 12px;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .nav-btn:hover {
          background: rgba(99, 102, 241, 0.05);
          color: var(--accent-primary);
        }
        .nav-active {
          background: var(--accent-primary-glow) !important;
          color: var(--accent-primary) !important;
          border: 1px solid rgba(99, 102, 241, 0.18) !important;
        }
        .nav-btn-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn-logout:hover {
          background: rgba(239, 68, 68, 0.08);
          color: var(--error);
        }
        .badge-level {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
        }
        .badge-level.beginner { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .badge-level.intermediate { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .badge-level.advanced { background: rgba(99, 102, 241, 0.1); color: var(--accent-primary); }

        .mini-stat-card {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid var(--panel-border);
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .icon-orange { color: var(--warning); }
        .icon-gold { color: #eab308; }

        .stat-box {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        .stat-val {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .text-orange { color: var(--warning); }
        .text-purple { color: var(--accent-primary); }
        .text-blue { color: var(--accent-secondary); }
        .text-green { color: var(--success); }

        /* Syllabus Module Styling */
        .syllabus-module-card {
          border: 1px solid #cbd5e1;
          padding: 16px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }
        .syllabus-module-card:hover {
          border-color: var(--accent-primary);
        }
        .module-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: bold;
        }
        .module-status-completed {
          font-size: 0.7rem;
          color: var(--success);
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .module-status-pending {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .module-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 4px 0;
        }
        .module-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0 0 16px 0;
          flex-grow: 1;
          line-height: 1.4;
        }
        .module-action-btn {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: var(--text-primary);
          padding: 6px 12px;
          font-size: 0.75rem;
          cursor: pointer;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-weight: 500;
          transition: all 0.15s;
        }
        .module-action-btn:hover {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        /* Floating AI Tutor Styling */
        .ai-tutor-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .floating-tutor-trigger {
          border-radius: 20px !important;
          padding: 10px 20px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          font-weight: 500;
        }
        .tutor-chat-box {
          width: 320px;
          height: 420px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          margin-bottom: 8px;
        }
        .tutor-chat-header {
          background: #f8fafc;
          border-bottom: 1px solid #cbd5e1;
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tutor-close-btn {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--text-muted);
          line-height: 1;
        }
        .tutor-close-btn:hover {
          color: var(--text-primary);
        }
        .tutor-chat-body {
          flex-grow: 1;
          padding: 14px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tutor-msg-bubble {
          padding: 8px 12px;
          border-radius: 4px;
          max-width: 90%;
        }
        .anna-bubble {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          align-self: flex-start;
          text-align: left;
        }
        .student-bubble {
          background: var(--accent-primary-glow);
          border: 1px solid rgba(99, 102, 241, 0.2);
          align-self: flex-end;
          color: var(--text-primary);
          text-align: left;
        }
        .tutor-predefined-container {
          padding: 8px 14px;
          border-top: 1px solid #f1f5f9;
          background: #fafafa;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tutor-prompt-chip {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 2px;
          padding: 4px 8px;
          font-size: 0.7rem;
          cursor: pointer;
          font-weight: 500;
          color: var(--text-muted);
          transition: all 0.1s;
        }
        .tutor-prompt-chip:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: var(--accent-primary-glow);
        }
        .tutor-input-form {
          border-top: 1px solid #cbd5e1;
          padding: 10px;
          background: #f8fafc;
          display: flex;
          gap: 8px;
        }
        .spinner-mini {
          border: 2px solid #cbd5e1;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border-left-color: var(--accent-primary);
          animation: spin 0.8s linear infinite;
        }
      `}</style>


    </div>
  );
}
