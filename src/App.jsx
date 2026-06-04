import React, { useState, useEffect } from 'react';
import Conversations from './components/Conversations';
import SpellingGrammar from './components/SpellingGrammar';
import VideoSection from './components/VideoSection';
import { 
  BookOpen, 
  Settings, 
  MessageSquare, 
  Video, 
  SpellCheck, 
  BarChart3, 
  User, 
  Lock, 
  Award, 
  Flame, 
  Target, 
  HelpCircle, 
  Send,
  LogOut,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  // TO USE GEMINI LIVE FEATURE: Put your Gemini API Key directly inside the quotes below:
  const apiKey = '';
  
  // Custom user level profile state
  const [loginForm, setLoginForm] = useState({
    name: '',
    level: 'beginner', // beginner, intermediate, advanced
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

  // LOGIN PAGE
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <form onSubmit={handleLogin} className="glass-panel login-card animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '450px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="logo-glow" style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <BookOpen size={48} />
            </div>
            <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Tamilan Anna</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>AI-powered interactive Tamil learning sanctuary</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>YOUR NAME</label>
              <input 
                type="text" 
                value={loginForm.name} 
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                required 
                className="form-input" 
                placeholder="Enter your name..." 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>YOUR PROFICIENCY LEVEL</label>
              <select 
                value={loginForm.level}
                onChange={(e) => setLoginForm({ ...loginForm, level: e.target.value })}
                className="form-input"
                style={{ background: '#0f172a' }}
              >
                <option value="beginner">Beginner (தொடக்க நிலை)</option>
                <option value="intermediate">Intermediate (இடைநிலை)</option>
                <option value="advanced">Advanced (உயர்நிலை)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>SECRET PIN (Optional)</label>
              <input 
                type="password" 
                value={loginForm.pin}
                onChange={(e) => setLoginForm({ ...loginForm, pin: e.target.value })}
                className="form-input" 
                placeholder="Choose any pin code..." 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
              Enter Learning Sanctuary <Lock size={16} />
            </button>
          </div>
        </form>

        <style>{`
          .login-card {
            border-color: rgba(139, 92, 246, 0.2);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          }
          .logo-glow {
            animation: pulseGlow 3s infinite;
          }
        `}</style>
      </div>
    );
  }

  const guide = getLevelGuide();

  // MAIN DASHBOARD LAYOUT
  return (
    <div className="layout-container">
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ background: 'rgba(15, 23, 42, 0.6)', borderRight: '1px solid var(--panel-border)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Logo Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--accent-primary)', background: 'var(--accent-primary-glow)', padding: '8px', borderRadius: '10px' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>Tamilan Anna</h2>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>AI ACADEMY</span>
            </div>
          </div>

          {/* User Profile Mini */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</h4>
              <span className={`badge-level ${user.level}`} style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{user.level}</span>
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
                    setShowSettings(false);
                  }}
                  className={`nav-btn ${activeTab === item.id && !showSettings ? 'nav-active' : ''}`}
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
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 600 }}>
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
            <div className="glass-panel guide-banner" style={{ padding: '24px', borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'var(--accent-primary-glow)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                  <Target size={28} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem' }}>{guide.title}</h3>
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
              <div className="glass-panel stat-box">
                <span className="stat-label">Daily Streak</span>
                <span className="stat-val text-orange">{stats.streak} Days</span>
              </div>
              <div className="glass-panel stat-box">
                <span className="stat-label">Pronunciation Score</span>
                <span className="stat-val text-purple">{stats.accuracy}%</span>
              </div>
              <div className="glass-panel stat-box">
                <span className="stat-label">Grammar Drills Done</span>
                <span className="stat-val text-blue">{stats.drills} completed</span>
              </div>
              <div className="glass-panel stat-box">
                <span className="stat-label">Dialogues Finished</span>
                <span className="stat-val text-green">{stats.conversations} modules</span>
              </div>
            </div>

            {/* Bottom Row - Split: Activity Log / Feedback */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
              {/* Activity feeds */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>Performance Activity Logs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activities.map(act => (
                    <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
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
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 600 }}>Submit Content Feedback</h3>
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
                        style={{ padding: '8px 12px', fontSize: '0.85rem', background: '#0f172a' }}
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
                        <div key={item.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.75rem' }}>
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
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-primary);
        }
        .nav-active {
          background: var(--accent-primary-glow) !important;
          color: var(--accent-primary) !important;
          border: 1px solid rgba(139, 92, 246, 0.2) !important;
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
          background: rgba(244, 63, 94, 0.1);
          color: var(--error);
        }
        .badge-level {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
        }
        .badge-level.beginner { background: rgba(16, 185, 129, 0.15); color: var(--success); }
        .badge-level.intermediate { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
        .badge-level.advanced { background: rgba(139, 92, 246, 0.15); color: var(--accent-primary); }

        .mini-stat-card {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.02);
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
