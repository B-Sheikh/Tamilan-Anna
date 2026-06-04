import React, { useState, useEffect } from 'react';
import Conversations from './components/Conversations';
import SpellingGrammar from './components/SpellingGrammar';
import VideoSection from './components/VideoSection';
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
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // Toggle between Landing Page & Login Page
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // TO USE GEMINI LIVE FEATURE: Put your Gemini API Key directly inside the quotes below:
  const apiKey = '';

  // Custom user level profile state
  const [loginForm, setLoginForm] = useState({
    name: '',
    level: 'beginner',
    pin: ''
  });

  // User Stats & Activity Tracker
  const [stats, setStats] = useState({
    streak: 3,
    accuracy: 88,
    drills: 14,
    conversations: 4
  });

  const [activities, setActivities] = useState([
    { id: 1, type: 'grammar_check', timestamp: 'Today, 2:40 PM', detail: 'Analyzed spelling of "தமிழ்ப்" - 100% Correct' },
    { id: 2, type: 'pronunciation_check', timestamp: 'Yesterday, 6:15 PM', detail: 'Completed "Greetings" turn 1 - 92% Accurately' },
    { id: 3, type: 'completed_scenario', timestamp: '2 days ago', detail: 'Finished "Greetings & Introduction" module' }
  ]);

  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'translation',
    message: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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
      newStats.accuracy = Math.round((newStats.accuracy * 9 + data.score) / 10);
    } else if (type === 'pronunciation_check') {
      newDetail = `Speech practice on "${data.scenario}" - Match rate: ${data.score}%`;
      newStats.accuracy = Math.round((newStats.accuracy * 9 + data.score) / 10);
    } else if (type === 'completed_scenario') {
      newDetail = `Completed Conversation Module: "${data.title}"`;
      newStats.conversations += 1;
      newStats.streak += 1;
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

  // 1. LANDING PAGE
  if (!user && !showLogin) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Header Branding */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)', color: 'white', padding: '10px', borderRadius: '12px' }}>
              <BookOpen size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Tamilan Anna</h2>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>AI Tamil Classroom</span>
            </div>
          </div>
          <button onClick={() => setShowLogin(true)} className="btn-primary">
            Enter Classroom <ArrowRight size={16} />
          </button>
        </header>

        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '60px 0', maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Transform Your Tamil Learning
          </span>
          <h1 style={{ fontSize: '3.2rem', color: 'var(--text-primary)', margin: '20px 0 16px 0', fontWeight: 800, lineHeight: '1.2' }}>
            Master Tamil Conversations, Spelling, and Grammar with AI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '32px' }}>
            An intuitive study ecosystem customized for school students and language lovers. Speak with our speech recognition tutor, check spelling using AI, and learn with standard Virtual Academy lessons.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setShowLogin(true)} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Start Learning Now <Sparkles size={18} />
            </button>
            <a href="https://www.youtube.com/@TamilVirtualAcademy/videos" target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Watch Academy Videos
            </a>
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '40px' }}>
          <div className="glass-panel feature-card" style={{ padding: '30px', textAlign: 'left' }}>
            <div className="icon-wrapper purple">
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '16px 0 8px 0', fontWeight: 600 }}>Pronunciation Coach</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Speak directly to the platform. Our Speech Recognition system evaluates your speech accuracy and gives helpful guidance.
            </p>
          </div>

          <div className="glass-panel feature-card" style={{ padding: '30px', textAlign: 'left' }}>
            <div className="icon-wrapper teal">
              <SpellCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '16px 0 8px 0', fontWeight: 600 }}>Spelling & Grammar Clinic</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Enter Tamil sentences to highlight errors, get corrections, and view grammar rules instantly using Gemini AI integrations.
            </p>
          </div>

          <div className="glass-panel feature-card" style={{ padding: '30px', textAlign: 'left' }}>
            <div className="icon-wrapper orange">
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '16px 0 8px 0', fontWeight: 600 }}>On-screen Keyboard</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              No Tamil keyboard installed? No problem. Use our built-in vowel, consonant, and modifier touch keyboard mapping.
            </p>
          </div>

          <div className="glass-panel feature-card" style={{ padding: '30px', textAlign: 'left' }}>
            <div className="icon-wrapper blue">
              <Video size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '16px 0 8px 0', fontWeight: 600 }}>TVA Video Academy</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Enjoy direct, filterable access to online lectures hosted by the official Tamil Virtual Academy lessons.
            </p>
          </div>
        </section>

        <style>{`
          .icon-wrapper {
            display: inline-flex;
            padding: 12px;
            border-radius: 12px;
            color: white;
          }
          .icon-wrapper.purple { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); }
          .icon-wrapper.teal { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); }
          .icon-wrapper.orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
          .icon-wrapper.blue { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); }
          .feature-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent-primary);
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
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>AI Classroom</span>
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
              { id: 'conversation', label: 'Conversations & Voice', icon: MessageSquare },
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
              Tamilan Anna Classroom v1.0 • Connected to {apiKey ? 'Gemini Live' : 'Simulated AI local engine'}
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
                  {activities.map(act => (
                    <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-primary)', display: 'block' }}>{act.detail}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Type: {act.type.replace('_', ' ')}</span>
                      </div>
                      <span style={{ color: 'var(--accent-secondary)', fontSize: '0.75rem' }}>{act.timestamp}</span>
                    </div>
                  ))}
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
      `}</style>
    </div>
  );
}
