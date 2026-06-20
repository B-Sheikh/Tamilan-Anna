import React, { useState, useEffect } from 'react';
import Conversations from './components/Conversations';
import SpellingGrammar from './components/SpellingGrammar';
import VideoSection from './components/VideoSection';
import TamilKeyboard from './components/TamilKeyboard';
import TamilBasics from './components/TamilBasics';
import VoiceConversation from './components/VoiceConversation';
import Assignments from './components/Assignments';
import Scheduler from './components/Scheduler';
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
  Keyboard,
  Mic,
  ClipboardList,
  Calendar,
  AlertCircle
} from 'lucide-react';


const placementQuestions = [
  {
    id: 1,
    level: 'beginner',
    question: "What is the first letter of the Tamil alphabet? (தமிழ் எழுத்துக்களின் முதல் எழுத்து எது?)",
    options: ["ஆ (aa)", "இ (i)", "அ (a)", "உ (u)"],
    answerIndex: 2,
    explanation: "அ (a) is the first vowel (உயிர் எழுத்து) and the starting character of the Tamil language."
  },
  {
    id: 2,
    level: 'beginner',
    question: "What is the Tamil word for 'Mother'? (அம்மா என்பதன் தமிழ் சொல்?)",
    options: ["தந்தை (Father)", "அம்மா (Mother)", "அக்கா (Sister)", "தம்பி (Brother)"],
    answerIndex: 1,
    explanation: "அம்மா (Amma) means Mother in Tamil."
  },
  {
    id: 3,
    level: 'beginner',
    question: "How do you say 'Hello / Greetings' in Tamil? (தமிழில் வாழ்த்துக்கள் எவ்வாறு கூறுவது?)",
    options: ["நன்றி (Nandri)", "வணக்கம் (Vanakkam)", "எப்படி இருக்கிறீர்கள் (How are you)", "போய்வருகிறேன் (Goodbye)"],
    answerIndex: 1,
    explanation: "வணக்கம் (Vanakkam) is the standard respectful greeting in Tamil."
  },
  {
    id: 4,
    level: 'beginner',
    question: "Which of the following is a Tamil vowel (உயிர் எழுத்து)?",
    options: ["க் (k)", "ம் (m)", "ஈ (ee)", "த் (th)"],
    answerIndex: 2,
    explanation: "ஈ (ee) is a vowel. The others are consonants (மெய் எழுத்துக்கள்)."
  },
  {
    id: 5,
    level: 'intermediate',
    question: "What is the correct Tamil translation of 'I am studying Tamil'?",
    options: [
      "நான் தமிழ் படிக்கிறேன் (Naan Thamizh padikkiren)",
      "நான் தமிழ் படித்தேன் (Naan Thamizh padithen)",
      "நான் தமிழ் படிப்பேன் (Naan Thamizh padippen)",
      "எனக்கு தமிழ் தெரியும் (Enakku Thamizh theriyum)"
    ],
    answerIndex: 0,
    explanation: "படிக்கிறேன் indicates present tense continuous study."
  },
  {
    id: 6,
    level: 'intermediate',
    question: "Which sentence uses the correct case ending for 'He likes Tamil'?",
    options: [
      "அவனுக்கு தமிழ் பிடிக்கும் (Avanukku Thamizh pidikkum)",
      "அவன் தமிழ் பிடிக்கும் (Avan Thamizh pidikkum)",
      "அவளை தமிழ் பிடிக்கும் (Avalai Thamizh pidikkum)",
      "அவர்கள் தமிழ் பிடிக்கும் (Avargal Thamizh pidikkum)"
    ],
    answerIndex: 0,
    explanation: "In Tamil, the verb 'பிடிக்கும்' requires a dative case ending (-உக்கு) on the subject, thus 'அவனுக்கு'."
  },
  {
    id: 7,
    level: 'intermediate',
    question: "What is the correct plural form of 'மரம்' (Tree) in Tamil?",
    options: ["மரங்கள் (Marangal)", "மரம்கள் (Maramgal)", "மரமாக்கள் (Maramaakkal)", "மரசு (Marasu)"],
    answerIndex: 0,
    explanation: "Words ending with 'ம்' change the 'ம்' to 'ங்' when combined with the plural suffix 'கள்'."
  },
  {
    id: 8,
    level: 'advanced',
    question: "Identify the correct progressive action verb structure (தொடர்வினை):",
    options: [
      "பறவைகள் பறந்துகொண்டிருக்கின்றன (Birds are flying)",
      "பறவைகள் பறந்தன (Birds flew)",
      "பறவைகள் பறக்கும் (Birds will fly)",
      "பறவைகள் பறக்கின்றன (Birds fly)"
    ],
    answerIndex: 0,
    explanation: "'பறந்துகொண்டிருக்கின்றன' is the present continuous form of flying."
  },
  {
    id: 9,
    level: 'advanced',
    question: "Which of the following demonstrates a Tamil sandhi sound alteration rule (புணர்ச்சி விதி)?",
    options: [
      "கடல் + அலை = கடலலை",
      "மண் + குடம் = மட்குடம்",
      "பூ + சோலை = பூஞ்சோலை",
      "All of the above (மேற்கூறிய அனைத்தும்)"
    ],
    answerIndex: 3,
    explanation: "All show standard sandhi alterations (u+a combination, n+k assimilation, and nasal insertion)."
  },
  {
    id: 10,
    level: 'advanced',
    question: "What is the primary literary meaning of the classical Tamil word 'ஒண்மை' (Onmai)?",
    options: ["இருள் (Darkness)", "அறிவு / ஒளி / சிறப்பு (Knowledge/Light/Splendor)", "வெறுமை (Emptiness)", "வறுமை (Poverty)"],
    answerIndex: 1,
    explanation: "'ஒண்மை' is a classical word signifying brightness, brilliance, righteousness, or wisdom."
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // Toggle between Landing Page & Login Page
  const [activeTab, setActiveTab] = useState('dashboard');

  // Interactive preview state for landing page
  const [previewText, setPreviewText] = useState('வணக்');

  // Helper to validate if the key starts with the standard Gemini prefix 'AIzaSy' or GCP prefix 'AQ.'
  const isValidGeminiKey = (key) => typeof key === 'string' && (key.trim().startsWith('AIzaSy') || key.trim().startsWith('AQ.'));

  // TO USE GEMINI LIVE FEATURE: Put your Gemini API Key directly inside the quotes below:
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  const initialLoginFormState = {
    username: '',
    pin: '',
    name: '',
    level: 'beginner',
    role: 'student',
    email: '',
    phoneCountry: '+91',
    phone: '',
    dob: '',
    gender: 'Male',
    photo: '',
    address: '',
    country: 'Select',
    state: '',
    city: '',
    postalCode: '',
    branch: 'Select',
    course: 'Select'
  };

  const [loginForm, setLoginForm] = useState(initialLoginFormState);

  // Placement Quiz States
  const [placementQuizActive, setPlacementQuizActive] = useState(false);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [placementEvaluation, setPlacementEvaluation] = useState(null); // { score, allottedLevel, finalLevel, aiReport }
  const [aiPlacementLoading, setAiPlacementLoading] = useState(false);
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPlacementNotice, setShowPlacementNotice] = useState(false);
  const [loginError, setLoginError] = useState(null);

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

    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
    let lastError = null;
    let success = false;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `You are Tutor Anna, a highly helpful, student-friendly AI Tamil tutor. The user asks: "${queryText}". Answer in simple, concise English with Tamil examples where appropriate. Keep it clear, neat, and structured for school kids.` }] }]
            })
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Try again!";
        setTutorMessages(prev => [...prev, { role: 'assistant', text: answer }]);
        success = true;
        break; // exit loop on success
      } catch (err) {
        console.warn(`Failed with model ${model}:`, err.message);
        lastError = err;
      }
    }

    if (!success) {
      setTutorMessages(prev => [...prev, { role: 'assistant', text: `Error connecting to AI tutor: ${lastError?.message || 'Unknown error'}. (API Key loaded: ${apiKey ? apiKey.substring(0, 6) + '...' : 'empty/missing'})` }]);
    }
    setTutorLoading(false);
  };

  // Load user from localStorage & Initialize users list
  useEffect(() => {
    // Check/initialize users list
    const existingList = localStorage.getItem('tamilan_users_list');
    if (!existingList) {
      const defaultUsers = [
        { name: "Admin Instructor", username: "admin", pin: "admin123", role: "admin", level: "advanced" },
        { name: "Student Demo", username: "student", pin: "1234", role: "student", level: "beginner" }
      ];
      localStorage.setItem('tamilan_users_list', JSON.stringify(defaultUsers));
    }

    const savedUser = localStorage.getItem('tamilan_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(null);
    const users = JSON.parse(localStorage.getItem('tamilan_users_list') || '[]');
    const matched = users.find(u => u.username === loginForm.username && u.pin === loginForm.pin);
    if (matched) {
      localStorage.setItem('tamilan_current_user', JSON.stringify(matched));
      setUser(matched);
      setLoginForm(initialLoginFormState);
    } else {
      setLoginError("Invalid username or PIN. Hint: Admin is 'admin' / 'admin123'");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoginError(null);
    
    // Core validations
    if (!loginForm.username.trim() || !loginForm.pin.trim() || !loginForm.name.trim()) {
      setLoginError("Please fill in all registration fields.");
      return;
    }
    
    // Additional Profile Field validations
    if (!loginForm.email.trim() || !loginForm.phone.trim() || !loginForm.dob || !loginForm.address.trim() || !loginForm.state.trim() || !loginForm.postalCode.trim()) {
      setLoginError("Please fill in all required fields marked with *");
      return;
    }
    if (loginForm.country === 'Select' || loginForm.branch === 'Select' || loginForm.course === 'Select') {
      setLoginError("Please select a valid Country, Branch, and Course.");
      return;
    }
    if (!loginForm.photo) {
      setLoginError("Please choose/upload a learner photo.");
      return;
    }

    const users = JSON.parse(localStorage.getItem('tamilan_users_list') || '[]');
    if (users.some(u => u.username === loginForm.username)) {
      setLoginError("Username is already taken. Try another!");
      return;
    }

    if (loginForm.role === 'student') {
      // Trigger Placement Quiz Onboarding
      setPlacementQuizActive(true);
      setQuizCurrentIndex(0);
      setQuizAnswers({});
      setPlacementEvaluation(null);
    } else {
      // Admins/Instructors register directly with advanced level by default
      const newUser = {
        username: loginForm.username.trim().toLowerCase(),
        pin: loginForm.pin,
        name: loginForm.name.trim(),
        level: 'advanced',
        role: loginForm.role,
        email: loginForm.email.trim(),
        phoneCountry: loginForm.phoneCountry,
        phone: loginForm.phone.trim(),
        dob: loginForm.dob,
        gender: loginForm.gender,
        photo: loginForm.photo,
        address: loginForm.address.trim(),
        country: loginForm.country,
        state: loginForm.state.trim(),
        city: loginForm.city.trim(),
        postalCode: loginForm.postalCode.trim(),
        branch: loginForm.branch,
        course: loginForm.course
      };
      const updated = [...users, newUser];
      localStorage.setItem('tamilan_users_list', JSON.stringify(updated));
      localStorage.setItem('tamilan_current_user', JSON.stringify(newUser));
      setUser(newUser);
      setIsRegisterMode(false);
      setLoginForm(initialLoginFormState);
    }
  };

  const analyzePlacementQuizWithAI = async (score, answers) => {
    setAiPlacementLoading(true);
    let allotted = 'beginner';
    if (score >= 8) allotted = 'advanced';
    else if (score >= 5) allotted = 'intermediate';

    let report = `Placement evaluated. You scored ${score}/10. Allotted level: ${allotted.toUpperCase()}.`;

    // Check if Gemini key is available for AI analysis report
    if (apiKey && isValidGeminiKey(apiKey)) {
      const prompt = `A student just completed an onboarding Tamil placement quiz.
Score: ${score}/10.
Answers details:
${placementQuestions.map((q, idx) => {
  const isCorrect = answers[idx] === q.answerIndex;
  return `Q${idx+1} (${q.level} level): ${q.question}
User answered: "${q.options[answers[idx]] || 'No answer'}" (Correct answer: "${q.options[q.answerIndex]}") - ${isCorrect ? 'CORRECT' : 'WRONG'}`;
}).join('\n')}

Analyze their performance and write a concise, encouraging 2-sentence summary in English about their Tamil proficiency level and what they should focus on. Keep it friendly and motivational.`;

      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
          );
          if (response.ok) {
            const data = await response.json();
            report = data.candidates?.[0]?.content?.parts?.[0]?.text || report;
            break;
          }
        } catch (err) {
          console.warn(`Placement AI report failed with model ${model}:`, err.message);
        }
      }
    } else {
      if (allotted === 'advanced') {
        report = "Fantastic! You possess a robust command of advanced Tamil vocabulary, grammar rules, and syntax structure. Ready to practice speaking fluently!";
      } else if (allotted === 'intermediate') {
        report = "Great job! You have solid intermediate skills and understand general sentence structure. Ready to focus on fluid conversations.";
      } else {
        report = "Welcome! You are starting your journey with core Tamil letters, sounds, and basic greetings. We will build your vocabulary step-by-step.";
      }
    }

    // Automatically create the student profile
    const users = JSON.parse(localStorage.getItem('tamilan_users_list') || '[]');
    const newUser = {
      username: loginForm.username.trim().toLowerCase(),
      pin: loginForm.pin,
      name: loginForm.name.trim(),
      level: allotted, // Automatically save the determined level
      role: loginForm.role,
      email: loginForm.email.trim(),
      phoneCountry: loginForm.phoneCountry,
      phone: loginForm.phone.trim(),
      dob: loginForm.dob,
      gender: loginForm.gender,
      photo: loginForm.photo,
      address: loginForm.address.trim(),
      country: loginForm.country,
      state: loginForm.state.trim(),
      city: loginForm.city.trim(),
      postalCode: loginForm.postalCode.trim(),
      branch: loginForm.branch,
      course: loginForm.course,
      placementScore: score,
      placementReport: report
    };

    const updated = [...users, newUser];
    localStorage.setItem('tamilan_users_list', JSON.stringify(updated));
    localStorage.setItem('tamilan_current_user', JSON.stringify(newUser));
    
    // Log in user and clean up states to head to dashboard
    setUser(newUser);
    setIsRegisterMode(false);
    setPlacementQuizActive(false);
    setPlacementEvaluation(null);
    setLoginForm(initialLoginFormState);
    setAiPlacementLoading(false);
  };

  const handleFinalizePlacement = () => {
    // Retained for fallback compatibility
    setPlacementQuizActive(false);
    setPlacementEvaluation(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('tamilan_current_user');
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
          <button onClick={() => { setIsRegisterMode(false); setLoginError(null); setShowLogin(true); }} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
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
              <button onClick={() => { setIsRegisterMode(true); setLoginError(null); setShowLogin(true); setShowPlacementNotice(true); }} className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
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

  // 2. LOGIN & SIGNUP PAGE
  if (!user && showLogin) {
    if (placementQuizActive) {
      const currentQuestion = placementQuestions[quizCurrentIndex];
      const hasAnsweredCurrent = quizAnswers[quizCurrentIndex] !== undefined;

      const handleSelectOption = (idx) => {
        setQuizAnswers({ ...quizAnswers, [quizCurrentIndex]: idx });
      };

      const handleNextQuestion = () => {
        if (quizCurrentIndex < placementQuestions.length - 1) {
          setQuizCurrentIndex(quizCurrentIndex + 1);
        } else {
          // Calculate score and trigger AI analysis
          let score = 0;
          placementQuestions.forEach((q, idx) => {
            if (quizAnswers[idx] === q.answerIndex) score++;
          });
          analyzePlacementQuizWithAI(score, quizAnswers);
        }
      };

      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', background: 'var(--panel-bg)' }}>
          <div className="glass-panel login-card animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '520px', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <GraduationCap style={{ color: 'var(--accent-primary)' }} size={28} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Onboarding Placement Quiz
              </span>
            </div>

            {aiPlacementLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <RefreshCw className="animate-spin" size={44} style={{ color: 'var(--accent-primary)', margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0 0 8px 0', fontWeight: 600 }}>Analyzing Proficiency...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Comparing answers to construct your student level profile.</p>
              </div>
            ) : placementEvaluation ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
                    {placementEvaluation.score}/10
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 4px 0', fontWeight: 700 }}>Quiz Completed!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>You have correctly answered {placementEvaluation.score} out of 10 questions.</p>
                </div>

                <div className="glass-panel" style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.04)', borderRadius: '4px', marginBottom: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>TUTOR ANNA'S EVALUATION</div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{placementEvaluation.aiReport}"
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ALLOTTED LEVEL: <span style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>{placementEvaluation.allottedLevel.toUpperCase()}</span>
                  </label>

                  {placementEvaluation.allottedLevel === 'advanced' && (
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>
                        You scored advanced level! Select a level to start with (you can override to beginner/intermediate):
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['advanced', 'intermediate', 'beginner'].map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setPlacementEvaluation({ ...placementEvaluation, finalLevel: lvl })}
                            className={placementEvaluation.finalLevel === lvl ? 'btn-primary' : 'btn-secondary'}
                            style={{ justifyContent: 'space-between', padding: '12px 16px', width: '100%', border: '1px solid #cbd5e1' }}
                            type="button"
                          >
                            <span>{lvl.toUpperCase() === 'ADVANCED' ? 'Advanced (உயர்நிலை) - Recommended' : lvl.toUpperCase() === 'INTERMEDIATE' ? 'Intermediate (இடைநிலை)' : 'Beginner (தொடக்க நிலை)'}</span>
                            {placementEvaluation.finalLevel === lvl && <Check size={18} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {placementEvaluation.allottedLevel === 'intermediate' && (
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>
                        You scored intermediate level! Select a level to start with (you can override to beginner):
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['intermediate', 'beginner'].map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setPlacementEvaluation({ ...placementEvaluation, finalLevel: lvl })}
                            className={placementEvaluation.finalLevel === lvl ? 'btn-primary' : 'btn-secondary'}
                            style={{ justifyContent: 'space-between', padding: '12px 16px', width: '100%', border: '1px solid #cbd5e1' }}
                            type="button"
                          >
                            <span>{lvl.toUpperCase() === 'INTERMEDIATE' ? 'Intermediate (இடைநிலை) - Recommended' : 'Beginner (தொடக்க நிலை)'}</span>
                            {placementEvaluation.finalLevel === lvl && <Check size={18} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {placementEvaluation.allottedLevel === 'beginner' && (
                    <div style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Beginner (தொடக்க நிலை)</span>
                      <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        Level locked to Beginner. You cannot change your level at this stage to ensure you build a proper foundation.
                      </p>
                    </div>
                  )}
                </div>

                <button onClick={handleFinalizePlacement} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}>
                  Finalize Profile & Start Learning
                </button>
              </div>
            ) : (
              <div>
                <div style={{ width: '100%', background: '#e2e8f0', height: '6px', borderRadius: '3px', marginBottom: '20px', overflow: 'hidden' }}>
                  <div style={{ width: `${((quizCurrentIndex) / placementQuestions.length) * 100}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600 }}>
                  <span>QUESTION {quizCurrentIndex + 1} OF {placementQuestions.length}</span>
                  <span style={{ textTransform: 'uppercase', color: 'var(--accent-secondary)' }}>{currentQuestion.level} Level</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.5, marginBottom: '20px' }}>
                  {currentQuestion.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[quizCurrentIndex] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        type="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 16px',
                          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid #cbd5e1',
                          background: isSelected ? 'var(--accent-primary-glow)' : 'white',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid var(--accent-primary)' : '2px solid #cbd5e1',
                          marginRight: '12px',
                          background: 'white',
                          boxSizing: 'border-box'
                        }} />
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setPlacementQuizActive(false);
                      setPlacementEvaluation(null);
                    }}
                    className="btn-secondary"
                    type="button"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Quit Setup
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!hasAnsweredCurrent}
                    className="btn-primary"
                    type="button"
                    style={{ flex: 1, justifyContent: 'center', opacity: hasAnsweredCurrent ? 1 : 0.6, cursor: hasAnsweredCurrent ? 'pointer' : 'not-allowed' }}
                  >
                    {quizCurrentIndex === placementQuestions.length - 1 ? 'Finish & Analyze' : 'Next Question'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', background: 'var(--panel-bg)' }}>
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="glass-panel login-card animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: isRegisterMode ? '900px' : '450px', background: 'white', transition: 'max-width 0.3s ease-in-out' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="logo-glow" style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <GraduationCap size={44} />
            </div>
            <h1 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', color: 'var(--text-primary)', fontWeight: 700 }}>
              {isRegisterMode ? "Create Study Profile" : "Enter Tamilan Anna"}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {isRegisterMode ? "Register a new student or instructor card" : "Access your interactive Tamil learning portal"}
            </p>
          </div>

          {loginError && (
            <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--error)', borderRadius: '4px', marginBottom: '20px', fontSize: '0.82rem', color: 'var(--error)' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegisterMode ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: '24px',
                textAlign: 'left'
              }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Student name (in English) * */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STUDENT NAME (IN ENGLISH) *</label>
                    <input
                      type="text"
                      value={loginForm.name}
                      onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Username & PIN */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>USERNAME *</label>
                      <input
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter username"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SECURITY PIN (PASSWORD) *</label>
                      <input
                        type="password"
                        value={loginForm.pin}
                        onChange={(e) => setLoginForm({ ...loginForm, pin: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter PIN"
                      />
                    </div>
                  </div>

                  {/* Email * */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL *</label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Phone No. * */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PHONE NO. *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={loginForm.phoneCountry}
                        onChange={(e) => setLoginForm({ ...loginForm, phoneCountry: e.target.value })}
                        className="form-input"
                        style={{ width: '100px', background: 'white' }}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+60">🇲🇾 +60</option>
                        <option value="+94">🇱🇰 +94</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>
                      <input
                        type="tel"
                        value={loginForm.phone}
                        onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                        required
                        className="form-input"
                        style={{ flex: 1 }}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Date of Birth * */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATE OF BIRTH *</label>
                    <input
                      type="date"
                      value={loginForm.dob}
                      onChange={(e) => setLoginForm({ ...loginForm, dob: e.target.value })}
                      required
                      className="form-input"
                    />
                  </div>

                  {/* Gender * */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>GENDER *</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {['Male', 'Female', 'Others'].map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setLoginForm({ ...loginForm, gender: g })}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '20px',
                            border: loginForm.gender === g ? '2px solid var(--accent-primary)' : '1px solid #cbd5e1',
                            background: loginForm.gender === g ? 'var(--accent-primary-glow)' : 'white',
                            color: loginForm.gender === g ? 'var(--accent-primary)' : 'var(--text-primary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Portal Role Selection */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PORTAL ROLE</label>
                    <select
                      value={loginForm.role}
                      onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
                      className="form-input"
                      style={{ background: 'white' }}
                    >
                      <option value="student">Student (மாணவர்)</option>
                      <option value="admin">Instructor / Admin (ஆசிரியர்)</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Learner Photo * */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LEARNER PHOTO *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        flex: 1,
                        border: '2px dashed #cbd5e1',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        position: 'relative'
                      }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 3 * 1024 * 1024) {
                                alert("File size must be within 3MB");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setLoginForm({ ...loginForm, photo: event.target.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            opacity: 0, cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>☁️</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--accent-primary)' }}>Choose a file</span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>The file size should be within 3MB</p>
                      </div>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '1px solid #cbd5e1',
                        overflow: 'hidden',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {loginForm.photo ? (
                          <img src={loginForm.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '2rem', color: '#94a3b8' }}>👤</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address * */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ADDRESS *</label>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loginForm.address.length} / 256</span>
                    </div>
                    <textarea
                      value={loginForm.address}
                      onChange={(e) => setLoginForm({ ...loginForm, address: e.target.value.slice(0, 256) })}
                      required
                      className="form-input"
                      rows={3}
                      placeholder="Enter your address"
                      style={{ resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Country * & State * */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>COUNTRY *</label>
                      <select
                        value={loginForm.country}
                        onChange={(e) => setLoginForm({ ...loginForm, country: e.target.value })}
                        required
                        className="form-input"
                        style={{ background: 'white' }}
                      >
                        <option value="Select">Select</option>
                        <option value="India">India</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATE *</label>
                      <input
                        type="text"
                        value={loginForm.state}
                        onChange={(e) => setLoginForm({ ...loginForm, state: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter your state name"
                      />
                    </div>
                  </div>

                  {/* City & Postal Code * */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CITY</label>
                      <input
                        type="text"
                        value={loginForm.city}
                        onChange={(e) => setLoginForm({ ...loginForm, city: e.target.value })}
                        className="form-input"
                        placeholder="Enter your city name"
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>POSTAL CODE *</label>
                      <input
                        type="text"
                        value={loginForm.postalCode}
                        onChange={(e) => setLoginForm({ ...loginForm, postalCode: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter your postal code"
                      />
                    </div>
                  </div>

                  {/* Branch * & Course * */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>BRANCH *</label>
                      <select
                        value={loginForm.branch}
                        onChange={(e) => setLoginForm({ ...loginForm, branch: e.target.value })}
                        required
                        className="form-input"
                        style={{ background: 'white' }}
                      >
                        <option value="Select">Select</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Coimbatore">Coimbatore</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Trichy">Trichy</option>
                        <option value="Jaffna">Jaffna</option>
                        <option value="Singapore Central">Singapore Central</option>
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                        <option value="Virtual Campus">Virtual Campus</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>COURSE *</label>
                      <select
                        value={loginForm.course}
                        onChange={(e) => setLoginForm({ ...loginForm, course: e.target.value })}
                        required
                        className="form-input"
                        style={{ background: 'white' }}
                      >
                        <option value="Select">Select</option>
                        <option value="Certificate in Basic Tamil">Certificate in Basic Tamil (அடிப்படைத் தமிழ்)</option>
                        <option value="Diploma in Tamil Language">Diploma in Tamil Language</option>
                        <option value="Tamil Literature and Grammar">Tamil Literature and Grammar</option>
                        <option value="Spoken Tamil Academy">Spoken Tamil Academy</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Login Mode Forms
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>USERNAME</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Enter username..."
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SECURITY PIN (PASSWORD)</label>
                  <input
                    type="password"
                    value={loginForm.pin}
                    onChange={(e) => setLoginForm({ ...loginForm, pin: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Enter password..."
                  />
                </div>
              </>
            )}

            {isRegisterMode && (
              <>
                {loginForm.role === 'student' ? (
                  <div style={{ fontSize: '0.8rem', padding: '12px', background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed var(--accent-primary)', borderRadius: '4px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    📝 <strong>Tamil Level Placement:</strong> To personalize your experience, you will complete a 10-question placement quiz right after registration to dynamically determine your learning level.
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed var(--success)', borderRadius: '4px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    👑 <strong>Instructor Level:</strong> Instructors bypass the placement test and are automatically granted Advanced (உயர்நிலை) status.
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={() => { setShowLogin(false); setLoginError(null); }} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {isRegisterMode ? "Register Profile" : "Sign In"}
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              {isRegisterMode ? (
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setLoginError(null); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Already have a profile? Sign In here
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(true); setLoginError(null); setShowPlacementNotice(true); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Need a student card? Create new profile
                </button>
              )}
            </div>
          </div>
        </form>

        {showPlacementNotice && (
          <div className="animate-fade-in" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div className="glass-panel animate-scale-in" style={{
              background: '#ffffff',
              borderRadius: '8px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid var(--panel-border)',
              position: 'relative'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--accent-primary)',
                marginBottom: '20px'
              }}>
                <GraduationCap size={32} />
              </div>

              <h2 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '12px'
              }}>
                Tamil Level Placement
              </h2>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '24px'
              }}>
                To personalize your experience, you will complete a 10-question placement quiz right after registration to dynamically determine your learning level.
              </p>

              <button
                onClick={() => setShowPlacementNotice(false)}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px 24px',
                  fontSize: '0.95rem'
                }}
              >
                Got it, let's go!
              </button>
            </div>
          </div>
        )}

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
              { id: 'voice_chat', label: 'Continuous Voice Chat', icon: Mic },
              { id: 'conversation', label: 'Conversations & Voice', icon: Volume2 },
              { id: 'grammar', label: 'Spelling & Grammar', icon: SpellCheck },
              { id: 'assignments', label: 'Assignments', icon: ClipboardList },
              { id: 'scheduler', label: 'Study Scheduler', icon: Calendar },
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
          <TamilBasics user={user} />
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

        {activeTab === 'voice_chat' && (
          <VoiceConversation apiKey={apiKey} />
        )}

        {activeTab === 'assignments' && (
          <Assignments user={user} apiKey={apiKey} />
        )}

        {activeTab === 'scheduler' && (
          <Scheduler user={user} />
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
