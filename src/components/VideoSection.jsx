import React, { useState } from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';

export default function VideoSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const videos = [
    {
      id: 'ujc6jifKxk0',
      title: 'Tamil Virtual Academy - Introduction Lesson',
      category: 'grammar',
      description: 'Understanding the overview of structured Tamil courses from the Academy.',
      duration: '11:20'
    },
    {
      id: 'gC9c7v1sYqQ',
      title: 'Learn Tamil Lesson 1 (உயிரெழுத்துக்கள்) - Vowels',
      category: 'alphabets',
      description: 'Explore the basics of Tamil writing starting with fundamental vowel systems.',
      duration: '14:15'
    },
    {
      id: 'Gw76_fnOOkM',
      title: 'Tamil Alphabets & Basics - Pebbles Education',
      category: 'alphabets',
      description: 'A friendly, student-focused animated guide to Tamil alphabet sounds and letters.',
      duration: '18:40'
    },
    {
      id: 'l_a6a0qB72s',
      title: 'Common Conversational Tamil Sentences & Dialogs',
      category: 'conversations',
      description: 'Daily spoken sentences for beginners, from greeting people to asking directions.',
      duration: '12:50'
    },
    {
      id: 'H0O7sE6jXfU',
      title: 'Learn Tamil Conversation for Beginners',
      category: 'conversations',
      description: 'Essential everyday conversational expressions, greetings, and sentence structures.',
      duration: '45:10'
    },
    {
      id: 'R8jB9F4oTNY',
      title: 'Tamil Consonants (மெய்யெழுத்துக்கள்)',
      category: 'alphabets',
      description: 'Complete breakdown of writing and reciting Tamil consonant letters (Mei Ezhuthukkal).',
      duration: '10:25'
    },
    {
      id: 'aF07rCekF_0',
      title: 'Grammar: Double Consonants Rules in Tamil',
      category: 'grammar',
      description: 'Learn where hard consonants double (வலிமிகும் இடங்கள்) to improve grammar accuracy.',
      duration: '12:30'
    },
    {
      id: '29JtN_G9c04',
      title: 'Tamil Vocabulary - 100 Common Words',
      category: 'conversations',
      description: 'Expand your word bank with 100 high-frequency Tamil words and meanings.',
      duration: '15:40'
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
