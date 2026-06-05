import React, { useState, useRef } from 'react';
import TamilKeyboard from './TamilKeyboard';
import { SpellCheck, Keyboard, Sparkles, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

export default function SpellingGrammar({ apiKey, onLogActivity }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const textareaRef = useRef(null);

  // Mock checking logic if Gemini API key is missing
  const getMockCorrections = (inputText) => {
    const mockDict = [
      { wrong: 'தமிள்', right: 'தமிழ்', type: 'spelling', explanation: "Using 'ள்' instead of 'ழ்'. 'ழ்' is the unique retroflex lateral approximant for Tamil." },
      { wrong: 'வணக்கம்ம', right: 'வணக்கம்', type: 'spelling', explanation: "Superfluous trailing 'ம'. Greeting is simple 'வணக்கம்'." },
      { wrong: 'சென்றான் நான்', right: 'சென்றேன்', type: 'grammar', explanation: "Subject-verb agreement. 'சென்றான்' is 3rd person singular masculine, but matching with 'நான்' (1st person) is grammatically incorrect. Use 'நான் சென்றேன்'." },
      { wrong: 'சாப்டு', right: 'சாப்பிடு', type: 'spelling', explanation: "Colloquial abbreviation. Standard written form is 'சாப்பிடு' (Eat)." },
      { wrong: 'பள்ளிகூடம்', right: 'பள்ளிக்கூடம்', type: 'spelling', explanation: "Missing consonant doubling (வலிமிகல்). In compound words starting with 'கூ', the preceding hard consonant 'க்' must double after 'பள்ளி'." }
    ];

    let correctedText = inputText;
    let foundErrors = [];

    mockDict.forEach(item => {
      if (inputText.includes(item.wrong)) {
        foundErrors.push({
          error: item.wrong,
          correction: item.right,
          type: item.type,
          explanation: item.explanation
        });
        correctedText = correctedText.replaceAll(item.wrong, item.right);
      }
    });

    // If nothing found and text length > 2, add a generic message indicating Gemini API key is ideal
    if (foundErrors.length === 0 && inputText.trim().length > 0) {
      return {
        correctedText: inputText,
        errors: [],
        note: "No common errors found in mock library. Provide a Gemini API Key in 'Developer Settings' for real-time generative grammar checking of arbitrary inputs!"
      };
    }

    return {
      correctedText,
      errors: foundErrors
    };
  };

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);

    // Track score/activity for analytics
    const wordCount = text.trim().split(/\s+/).length;

    const isValidKey = apiKey && apiKey.trim().startsWith('AIzaSy');

    if (!isValidKey) {
      // Use mock response
      setTimeout(() => {
        const res = getMockCorrections(text);
        setResults(res);
        setLoading(false);
        const errorCount = res.errors?.length || 0;
        onLogActivity('grammar_check', {
          words: wordCount,
          errorsFound: errorCount,
          score: Math.max(0, 100 - errorCount * 20)
        });
      }, 1000);
      return;
    }

    try {
      const prompt = `You are an expert Tamil language tutor and spelling/grammar corrector.
Analyze this Tamil text for spelling mistakes, formatting errors, or grammar issues: "${text}".
Return your findings EXACTLY as a JSON object, containing:
1. "correctedText": the fully corrected text.
2. "errors": an array of objects, each containing:
   - "error": the incorrect part from the original text.
   - "correction": the corrected spelling or grammar.
   - "type": either "spelling" or "grammar".
   - "explanation": a concise clear explanation in English of why it was wrong and the rule behind it.

Ensure you do not return any markdown tags or backticks (e.g. \`\`\`json). Output only the raw JSON.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(rawText.trim());

      setResults(parsed);
      const errorCount = parsed.errors?.length || 0;
      onLogActivity('grammar_check', {
        words: wordCount,
        errorsFound: errorCount,
        score: Math.max(0, 100 - errorCount * 15)
      });
    } catch (err) {
      console.error(err);
      setError("Failed to run Gemini check. Using local fallback. " + err.message);
      // Fallback
      const res = getMockCorrections(text);
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCorrection = () => {
    if (results && results.correctedText) {
      setText(results.correctedText);
      setResults(null);
    }
  };

  const handleReset = () => {
    setText('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SpellCheck className="icon-purple" /> Spelling & Grammar Clinic
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Type or build Tamil sentences below to run an instant spelling, grammar, and syntax sanity check.
          </p>
        </div>
        <button 
          onClick={() => setShowKeyboard(!showKeyboard)}
          className={`btn-secondary ${showKeyboard ? 'active-btn' : ''}`}
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Keyboard size={16} /> {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Input area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span>Enter Tamil Text:</span>
              <span>Try: <code style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }} onClick={() => setText('நான் தமிள் கற்றுக் கொள்கிறேன்.')}>நான் தமிள் ...</code></span>
            </div>
            
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-input"
              placeholder="தமிழ்ப் உரையை இங்கே தட்டச்சு செய்யவும்... (Type or use the keyboard below)"
              rows={6}
              style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '1.1rem', background: '#ffffff' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={handleReset} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RotateCcw size={16} /> Clear
              </button>
              <button 
                onClick={handleCheck} 
                disabled={loading || !text.trim()} 
                className="btn-primary"
                style={{ opacity: text.trim() ? 1 : 0.6 }}
              >
                <Sparkles size={16} /> {loading ? 'Analyzing...' : 'Check Text'}
              </button>
            </div>
          </div>

          {showKeyboard && (
            <TamilKeyboard 
              onKeyPress={(val) => setText(val)} 
              targetInputRef={textareaRef} 
            />
          )}
        </div>

        {/* Results Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', minHeight: '300px', background: 'white' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px', fontWeight: 600 }}>
              AI Feedback & Suggestions
            </h3>

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px' }}>
                <div className="spinner"></div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzing sentence structure and spelling...</span>
              </div>
            )}

            {!loading && !results && !error && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)', textAlign: 'center' }}>
                <SpellCheck size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                <p style={{ fontSize: '0.95rem' }}>Write Tamil text and click check to trigger AI diagnostics.</p>
                {!(apiKey && apiKey.trim().startsWith('AIzaSy')) && (
                  <p style={{ fontSize: '0.75rem', marginTop: '10px', color: 'var(--warning)' }}>
                    * Running in simulated mode. Add a valid Gemini Key starting with AIzaSy directly to App.jsx to test live arbitrary inputs.
                  </p>
                )}
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--error)', borderRadius: '4px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <AlertCircle className="icon-red" size={18} />
                <span>{error}</span>
              </div>
            )}

            {!loading && results && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Score Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '4px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>QUALITY SCORE</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: results.errors?.length === 0 ? 'var(--success)' : 'var(--warning)' }}>
                      {Math.max(0, 100 - (results.errors?.length || 0) * 20)}%
                    </span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 600 }}>ISSUES DETECTED</span>
                    <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'right' }}>
                      {results.errors?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Corrected Preview */}
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} /> Corrected Output:
                    </span>
                    {results.correctedText !== text && (
                      <button onClick={handleApplyCorrection} className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px' }}>
                        Apply Correction
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{results.correctedText || text}</p>
                </div>

                {/* Errors Breakdown */}
                {results.errors && results.errors.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h4 style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Detailed Correction Explanations:</h4>
                    {results.errors.map((item, index) => (
                      <div key={index} className="error-item" style={{ borderLeft: `3px solid ${item.type === 'spelling' ? 'var(--error)' : 'var(--warning)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="wrong-highlight">{item.error}</span>
                          <span style={{ color: 'var(--text-muted)' }}>→</span>
                          <span className="right-highlight">{item.correction}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: item.type === 'spelling' ? 'var(--error)' : 'var(--warning)' }}>[{item.type}] </span>
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {results.errors && results.errors.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--success)' }}>
                    <CheckCircle size={36} style={{ marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Excellent! No spelling or grammatical mistakes detected.</p>
                    {results.note && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>{results.note}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .icon-purple {
          color: var(--accent-primary);
        }
        .active-btn {
          border-color: var(--accent-primary) !important;
          background: var(--accent-primary-glow) !important;
        }
        .spinner {
          border: 3px solid rgba(0,0,0,0.05);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: var(--accent-primary);
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .error-item {
          background: #fafafa;
          border: 1px solid #e2e8f0;
          padding: 10px 12px;
          border-radius: 4px;
        }
        .wrong-highlight {
          color: var(--error);
          text-decoration: line-through;
          font-weight: 500;
        }
        .right-highlight {
          color: var(--success);
          font-weight: 500;
        }
        .icon-red {
          color: var(--error);
        }
      `}</style>
    </div>
  );
}
