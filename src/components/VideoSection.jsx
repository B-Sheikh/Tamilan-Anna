import React, { useState } from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';

export default function VideoSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const videos = [
    {
      id: 'D0T_eF1P3wM',
      title: 'Tamil Alphabets (உயிரெழுத்துக்கள்) - Primary Lessons',
      category: 'alphabets',
      description: 'Learn the primary Tamil vowels and pronunciation patterns step-by-step.',
      duration: '12:45'
    },
    {
      id: 'z-aW7G-W6Xo',
      title: 'Consonant Letters (மெய்யெழுத்துக்கள்) - Learning Tamil',
      category: 'alphabets',
      description: 'Explore the 18 basic consonants and how they combine with vowels.',
      duration: '15:20'
    },
    {
      id: 'xGla24w-2W8',
      title: 'Common Daily Tamil Conversations & Greetings',
      category: 'conversations',
      description: 'Useful daily conversation phrases for beginners interacting in Tamil Nadu.',
      duration: '18:10'
    },
    {
      id: 'qC_qP83B6f4',
      title: 'Tamil Grammar (இலக்கணம்) - Intro to Rules',
      category: 'grammar',
      description: 'Understanding Tamil grammar, word formation, and basic structures.',
      duration: '22:30'
    },
    {
      id: 'yJcMebXhA_k',
      title: 'Advanced Tamil Conversations & Sentence Structuring',
      category: 'conversations',
      description: 'Refine your conversational skills with complex compound sentence patterns.',
      duration: '25:15'
    },
    {
      id: 'vP1w47H013s',
      title: 'Tamil Spelling Rules & Orthography (எழுத்துப்பிழை நீக்கம்)',
      category: 'grammar',
      description: 'How to write Tamil without spelling mistakes (La, Lla, Zha rules).',
      duration: '14:40'
    }
  ];

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video className="icon-cyan" /> Video Academy Hub
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Curated lessons and classes hosted by the Tamil Virtual Academy and experts.
          </p>
        </div>
        <a 
          href="https://www.youtube.com/@TamilVirtualAcademy/videos" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-secondary"
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          View Channel <ExternalLink size={16} />
        </a>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'alphabets', 'conversations', 'grammar'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="video-grid">
        {filteredVideos.map(vid => (
          <div key={vid.id} className="glass-panel video-card">
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${vid.id}?rel=0`}
                title={vid.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge">{vid.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {vid.duration}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', margin: '4px 0 8px 0', color: 'var(--text-primary)', fontWeight: 600 }}>
                {vid.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {vid.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .tab-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--panel-border);
          color: var(--text-muted);
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }
        .tab-btn.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 4px 12px var(--accent-primary-glow);
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }
        .video-card {
          overflow: hidden;
        }
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          overflow: hidden;
        }
        .video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
        .badge {
          background: rgba(6, 182, 212, 0.15);
          color: var(--accent-secondary);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .icon-cyan {
          color: var(--accent-secondary);
        }
      `}</style>
    </div>
  );
}
