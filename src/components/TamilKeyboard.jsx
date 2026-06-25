
export default function TamilKeyboard({ onKeyPress, targetInputRef }) {
  const vowels = [
    { char: 'அ', name: 'a' }, { char: 'ஆ', name: 'aa' }, { char: 'இ', name: 'i' }, { char: 'ஈ', name: 'ee' },
    { char: 'உ', name: 'u' }, { char: 'ஊ', name: 'uu' }, { char: 'எ', name: 'e' }, { char: 'ஏ', name: 'ae' },
    { char: 'ஐ', name: 'ai' }, { char: 'ஒ', name: 'o' }, { char: 'ஓ', name: 'oo' }, { char: 'ஔ', name: 'au' },
    { char: 'ஃ', name: 'ak' }
  ];

  const consonants = [
    { char: 'க', name: 'ka' }, { char: 'ங', name: 'nga' }, { char: 'ச', name: 'sa' }, { char: 'ஞ', name: 'nya' },
    { char: 'ட', name: 'ta' }, { char: 'ண', name: 'na' }, { char: 'த', name: 'tha' }, { char: 'ந', name: 'na' },
    { char: 'ப', name: 'pa' }, { char: 'ம', name: 'ma' }, { char: 'ய', name: 'ya' }, { char: 'ர', name: 'ra' },
    { char: 'ல', name: 'la' }, { char: 'வ', name: 'va' }, { char: 'ழ', name: 'zha' }, { char: 'ள', name: 'la' },
    { char: 'ற', name: 'ra' }, { char: 'ன', name: 'na' }
  ];

  // Tamil vowel signs (modifiers) that modify the preceding consonant
  const modifiers = [
    { char: '்', name: 'pulli (mute)' },
    { char: 'ா', name: 'aa sign' },
    { char: 'ி', name: 'i sign' },
    { char: 'ீ', name: 'ee sign' },
    { char: 'ு', name: 'u sign' },
    { char: 'ூ', name: 'uu sign' },
    { char: 'ெ', name: 'e sign' },
    { char: 'ே', name: 'ae sign' },
    { char: 'ை', name: 'ai sign' },
    { char: 'ொ', name: 'o sign' },
    { char: 'ோ', name: 'oo sign' },
    { char: 'ௌ', name: 'au sign' }
  ];

  const handleKeyClick = (char) => {
    if (targetInputRef && targetInputRef.current) {
      const input = targetInputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const val = input.value;
      
      let newVal = val.substring(0, start) + char + val.substring(end);
      onKeyPress(newVal);

      // Restore focus and selection
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + char.length, start + char.length);
      }, 0);
    } else {
      onKeyPress(char);
    }
  };

  const handleBackspace = () => {
    if (targetInputRef && targetInputRef.current) {
      const input = targetInputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const val = input.value;

      if (start === 0 && end === 0) return;

      let newVal;
      let newCursorPos;
      if (start !== end) {
        newVal = val.substring(0, start) + val.substring(end);
        newCursorPos = start;
      } else {
        // Simple backspace deletes one character (Tamil character strings can have combining marks)
        // Let's remove the last codepoint/combining character
        newVal = val.substring(0, start - 1) + val.substring(start);
        newCursorPos = start - 1;
      }

      onKeyPress(newVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleSpace = () => {
    handleKeyClick(' ');
  };

  return (
    <div className="glass-panel keyboard-container" style={{ padding: '16px', marginTop: '16px' }}>
      <div className="keyboard-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          IN-BUILT TAMIL KEYBOARD (தமிழ் விசைப்பலகை)
        </span>
        <button 
          onClick={handleBackspace}
          className="btn-secondary" 
          style={{ padding: '4px 12px', fontSize: '0.8rem', height: '30px' }}
        >
          Backspace
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Vowels Row */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginBottom: '4px', textAlign: 'left', fontWeight: 'bold' }}>
            Vowels (உயிரெழுத்துகள்)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {vowels.map(v => (
              <button
                key={v.char}
                onClick={() => handleKeyClick(v.char)}
                className="key-btn vowel-key"
              >
                {v.char}
              </button>
            ))}
          </div>
        </div>

        {/* Consonants Row */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '4px', textAlign: 'left', fontWeight: 'bold' }}>
            Consonants (மெய்யெழுத்துகள் - Base)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {consonants.map(c => (
              <button
                key={c.char}
                onClick={() => handleKeyClick(c.char)}
                className="key-btn consonant-key"
              >
                {c.char}
              </button>
            ))}
          </div>
        </div>

        {/* Modifiers / Combining Signs */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginBottom: '4px', textAlign: 'left', fontWeight: 'bold' }}>
            Vowel Modifiers (உயிர்மெய் குறியீடுகள்)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {modifiers.map(m => (
              <button
                key={m.char}
                onClick={() => handleKeyClick(m.char)}
                className="key-btn modifier-key"
                title={m.name}
              >
                {m.char}
              </button>
            ))}
            <button
              onClick={handleSpace}
              className="key-btn space-key"
              style={{ flexGrow: 1, minWidth: '100px' }}
            >
              Space
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .key-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          color: var(--text-primary);
          padding: 8px 10px;
          min-width: 40px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .key-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          transform: none;
        }
        .vowel-key:hover {
          border-color: var(--accent-secondary);
        }
        .consonant-key:hover {
          border-color: var(--accent-primary);
        }
        .modifier-key:hover {
          border-color: var(--success);
        }
        .space-key {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
