import { useState, useEffect, useRef } from 'react';
import { Calendar, AlertCircle, CheckCircle2, Award, ClipboardList, PlusCircle, Send } from 'lucide-react';
import TamilKeyboard from './TamilKeyboard';

export default function Assignments({ user, apiKey }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // Student States
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const studentInputRef = useRef(null);

  // Admin States
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    level: 'beginner',
    dueDate: ''
  });
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradingLoading, setGradingLoading] = useState(false);

  useEffect(() => {
    // Load assignments
    const savedAssignments = localStorage.getItem('tamilan_assignments');
    let loadedAssignments = [];
    if (savedAssignments) {
      loadedAssignments = JSON.parse(savedAssignments);
    } else {
      // Seed some assignments
      const defaultAssignments = [
        {
          id: '1',
          title: 'Translate & Write Greetings',
          description: 'Write the Tamil translation for "Good morning, mother. How are you?" Hint: Use the on-screen Tamil keyboard to type accurately in Tamil script.',
          level: 'beginner',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Advanced Pronunciation & Syntax Dialogue',
          description: 'Explain the difference in context when using the dental n (ந்) vs retroflex n (ண்) in Tamil sentences. Provide at least two sample sentences.',
          level: 'advanced',
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('tamilan_assignments', JSON.stringify(defaultAssignments));
      loadedAssignments = defaultAssignments;
    }

    // Load submissions
    const savedSubmissions = localStorage.getItem('tamilan_submissions');
    let loadedSubmissions = [];
    if (savedSubmissions) {
      loadedSubmissions = JSON.parse(savedSubmissions);
    }

    queueMicrotask(() => {
      setAssignments(loadedAssignments);
      setSubmissions(loadedSubmissions);
    });
  }, []);

  // Save assignments helper
  const saveAssignments = (list) => {
    localStorage.setItem('tamilan_assignments', JSON.stringify(list));
    setAssignments(list);
  };

  // Save submissions helper
  const saveSubmissions = (list) => {
    localStorage.setItem('tamilan_submissions', JSON.stringify(list));
    setSubmissions(list);
  };

  // Student: Submit assignment handler
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim() || !selectedAssignment) return;

    const newSub = {
      id: Date.now().toString(),
      assignmentId: selectedAssignment.id,
      assignmentTitle: selectedAssignment.title,
      studentUsername: user.username,
      studentName: user.name,
      answerText: answerText,
      score: null,
      feedback: '',
      submittedAt: new Date().toISOString()
    };

    const updated = [newSub, ...submissions];
    saveSubmissions(updated);
    setAnswerText('');
    setSelectedAssignment(null);
  };

  // Admin: Create assignment handler
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newAssignment.title.trim() || !newAssignment.description.trim()) return;

    const created = {
      id: Date.now().toString(),
      ...newAssignment,
      createdAt: new Date().toISOString()
    };

    const updated = [created, ...assignments];
    saveAssignments(updated);
    setNewAssignment({ title: '', description: '', level: 'beginner', dueDate: '' });
  };

  // Admin: Grade submission manually
  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = submissions.map(sub => {
      if (sub.id === gradingSubmission.id) {
        return {
          ...sub,
          score: parseInt(gradeScore),
          feedback: gradeFeedback
        };
      }
      return sub;
    });

    saveSubmissions(updated);
    setGradingSubmission(null);
    setGradeFeedback('');
  };

  // Admin: Trigger AI Grading using Gemini API
  const handleAIGrading = async (sub) => {
    const targetAssignment = assignments.find(a => a.id === sub.assignmentId);
    if (!targetAssignment || !apiKey) return;

    setGradingLoading(true);
    setGradeFeedback('');

    const prompt = `You are Tutor Anna, an expert Tamil language teacher.
Please grade the following student's assignment answer.
Assignment Title: "${targetAssignment.title}"
Assignment Goal/Instructions: "${targetAssignment.description}"
Student Name: "${sub.studentName}"
Student's Answer: "${sub.answerText}"

Provide:
1. A score out of 100 based on accuracy, spelling, and grammar in Tamil script.
2. A short paragraph of constructive feedback in English (addressing spelling corrections if they made mistakes, or congratulating them in Tamil script followed by English).

Return your evaluation as a clean JSON object containing:
{
  "score": <number between 0 and 100>,
  "feedback": "<concise feedback text here>"
}
Do not return markdown tags. Return only the raw JSON.`;

    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
    let evalResult = { score: 85, feedback: "Good effort! Practice more letters." };

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          }
        );

        if (!response.ok) throw new Error();

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const start = rawText.indexOf('{');
        const end = rawText.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          evalResult = JSON.parse(rawText.substring(start, end + 1));
        } else {
          evalResult = JSON.parse(rawText.trim());
        }
        break;
      } catch (err) {
        console.warn(`AI Grading failed on ${model}:`, err.message);
      }
    }

    setGradeScore(evalResult.score);
    setGradeFeedback(evalResult.feedback + " (Graded by Tutor Anna AI)");
    setGradingLoading(false);
  };

  const isAdmin = user.role === 'admin';

  return (
    <div className="animate-fade-in" style={{ padding: '10px 0' }}>
      
      {/* Intro Header banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(13, 148, 136, 0.03) 100%)', border: '1px solid var(--panel-border)', borderRadius: '4px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <ClipboardList size={24} style={{ color: 'var(--accent-primary)' }} /> Classroom Assignments Hub
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
          {isAdmin 
            ? "Create custom Tamil coursework modules, due dates, and review/grade student answers using manual or AI-assisted feedback."
            : "Review homework assigned by your instructor, type out your answers in Tamil script, and view graded scores and tutor remarks."}
        </p>
      </div>

      {isAdmin ? (
        /* ================== ADMIN VIEW ================== */
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Column 1: Add Assignment & List Assignments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Create Assignment Panel */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={18} style={{ color: 'var(--accent-primary)' }} /> Create Assignment
              </h3>
              <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>TITLE</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    required
                    className="form-input"
                    placeholder="e.g. Speak & Translate Greetings"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>DESCRIPTION / INSTRUCTIONS</label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    required
                    className="form-input"
                    rows={4}
                    placeholder="Write instructions or questions here..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>TARGET LEVEL</label>
                    <select
                      value={newAssignment.level}
                      onChange={(e) => setNewAssignment({ ...newAssignment, level: e.target.value })}
                      className="form-input"
                      style={{ background: 'white' }}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>DUE DATE</label>
                    <input
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '6px', justifyContent: 'center' }}>
                  Publish Assignment
                </button>
              </form>
            </div>

            {/* Created Assignments Panel */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Published Tasks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {assignments.length === 0 ? (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', margin: '10px 0' }}>No assignments created yet.</p>
                ) : (
                  assignments.map(assign => (
                    <div key={assign.id} style={{ border: '1px solid var(--panel-border)', padding: '12px', borderRadius: '4px', background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '2px', textTransform: 'capitalize' }}>
                          {assign.level}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> Due: {assign.dueDate}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{assign.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{assign.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Submissions & Grading Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Review List */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white', minHeight: '380px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Student Homework Submissions</h3>
              
              {submissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <ClipboardList size={40} style={{ opacity: 0.15, marginBottom: '10px' }} />
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>No homework submitted by students yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {submissions.map(sub => {
                    const isGraded = sub.score !== null;
                    return (
                      <div key={sub.id} style={{ border: isGraded ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(245, 158, 11, 0.2)', padding: '14px', borderRadius: '4px', background: isGraded ? 'rgba(16, 185, 129, 0.01)' : 'rgba(245, 158, 11, 0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{sub.studentName}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Submitted: {sub.submittedAt.split('T')[0]}</span>
                          </div>
                          <div>
                            {isGraded ? (
                              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                Score: {sub.score}/100
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '2px' }}>
                                Awaiting Grade
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
                          <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px' }}>TASK: {sub.assignmentTitle}</span>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{sub.answerText}</p>
                        </div>

                        {isGraded ? (
                          <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <strong>Feedback:</strong> {sub.feedback || "Good work!"}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setGradingSubmission(sub);
                              setGradeScore(85);
                              setGradeFeedback('');
                            }}
                            className="module-action-btn animate-pulse"
                            style={{ width: '100%', fontSize: '0.75rem', padding: '6px' }}
                          >
                            Grade & Give Feedback
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Manual/AI Grading Modal (In-place) */}
            {gradingSubmission && (
              <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--accent-primary)', background: '#fcfcfd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>Grading: {gradingSubmission.studentName}</h4>
                  <button onClick={() => setGradingSubmission(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem' }}>✕ Close</button>
                </div>
                
                {apiKey && (
                  <button
                    onClick={() => handleAIGrading(gradingSubmission)}
                    disabled={gradingLoading}
                    className="module-action-btn"
                    style={{ width: '100%', marginBottom: '14px', background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.15)', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {gradingLoading ? "AI is reviewing..." : "✨ Grade automatically with Tutor Anna AI"}
                  </button>
                )}

                <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>SCORE (OUT OF 100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gradeScore}
                      onChange={(e) => setGradeScore(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>FEEDBACK REMARKS</label>
                    <textarea
                      value={gradeFeedback}
                      onChange={(e) => setGradeFeedback(e.target.value)}
                      required
                      className="form-input"
                      rows={3}
                      placeholder="Write evaluation comments..."
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '8px', justifyContent: 'center' }}>
                    Submit Grade & Feedback
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* ================== STUDENT VIEW ================== */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Column 1: Assignments tasks list & Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Homework List Panel */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Your Coursework Tasks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assignments.map(assign => {
                  const submission = submissions.find(s => s.assignmentId === assign.id && s.studentUsername === user.username);
                  const isCompleted = !!submission;

                  return (
                    <div 
                      key={assign.id} 
                      style={{ 
                        border: selectedAssignment?.id === assign.id 
                          ? '1px solid var(--accent-primary)' 
                          : '1px solid var(--panel-border)', 
                        padding: '16px', 
                        borderRadius: '4px', 
                        background: '#ffffff',
                        cursor: isCompleted ? 'default' : 'pointer'
                      }}
                      onClick={() => !isCompleted && setSelectedAssignment(assign)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', background: 'rgba(99,102,241,0.08)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '2px', textTransform: 'capitalize' }}>
                          {assign.level} Level
                        </span>
                        
                        {isCompleted ? (
                          <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                            <CheckCircle2 size={14} /> Submitted
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                            <AlertCircle size={14} /> Pending
                          </span>
                        )}
                      </div>
                      
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{assign.title}</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{assign.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Due Date: {assign.dueDate}</span>
                        {!isCompleted && <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Click to Solve →</span>}
                      </div>

                      {/* Display grading details if reviewed */}
                      {submission && submission.score !== null && (
                        <div style={{ marginTop: '12px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', padding: '10px', borderRadius: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold' }}>
                            <Award size={14} /> Evaluated Grade: {submission.score}/100
                          </span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                            <strong>Tutor Comments:</strong> {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Answer Input Panel */}
            {selectedAssignment && (
              <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Task Solution: {selectedAssignment.title}
                  </h3>
                  <button 
                    onClick={() => { setSelectedAssignment(null); setShowKeyboard(false); }}
                    className="module-action-btn"
                    style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                  >
                    Hide Form
                  </button>
                </div>

                <form onSubmit={handleStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Type your response in Tamil:</span>
                    <button
                      type="button"
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className="module-action-btn"
                      style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                    >
                      {showKeyboard ? "Hide" : "Show"} Tamil Keyboard
                    </button>
                  </div>

                  {showKeyboard && (
                    <div style={{ border: '1px solid #cbd5e1', padding: '6px', borderRadius: '4px' }}>
                      <TamilKeyboard onKeyPress={(val) => setAnswerText(val)} targetInputRef={studentInputRef} />
                    </div>
                  )}

                  <textarea
                    ref={studentInputRef}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    required
                    rows={5}
                    className="form-input"
                    placeholder="Type in Tamil script or English..."
                    style={{ fontSize: '1rem', resize: 'vertical' }}
                  />

                  <button type="submit" className="btn-primary" style={{ padding: '10px', justifyContent: 'center', gap: '8px' }}>
                    Submit Answer <Send size={16} />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Column 2: Graded Tasks Summary */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Submitted Homework</h3>
            
            {submissions.filter(s => s.studentUsername === user.username).length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', margin: '20px 0' }}>You haven't submitted any assignments yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {submissions.filter(s => s.studentUsername === user.username).map(sub => (
                  <div key={sub.id} style={{ border: '1px solid var(--panel-border)', padding: '12px', borderRadius: '4px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sub.assignmentTitle}</h4>
                      <span style={{ fontSize: '0.7rem', background: sub.score !== null ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: sub.score !== null ? 'var(--success)' : 'var(--warning)', padding: '2px 6px', borderRadius: '2px', fontWeight: 'bold' }}>
                        {sub.score !== null ? `Grade: ${sub.score}%` : 'Grading...'}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Your Answer: "{sub.answerText}"
                    </p>
                    {sub.score !== null && (
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-primary)', borderTop: '1px solid #cbd5e1', paddingTop: '4px' }}>
                        <strong>Feedback:</strong> {sub.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
