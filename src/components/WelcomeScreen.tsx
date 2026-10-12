import React from 'react';
import {
  Compass,
  CheckCircle2,
  FileCheck,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';
import { WELCOME_SUGGESTIONS } from '../mockData';
import { QuibiStyleEmblem } from './VaidhaLogo';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  const getSuggestionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass size={18} color="#3b82f6" />;
      case 1:
        return <CheckCircle2 size={18} color="#10b981" />;
      case 2:
        return <FileCheck size={18} color="#f97316" />;
      case 3:
        return <GraduationCap size={18} color="#8b5cf6" />;
      default:
        return <Compass size={18} color="#3b82f6" />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '1120px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 20px',
        zIndex: 10,
      }}
      className="fade-in"
    >
      {/* Central Geometric Emblem */}
      <div style={{ marginBottom: '22px' }}>
        <QuibiStyleEmblem size={56} />
      </div>

      {/* Main Heading with India-inspired Soft Blue & Saffron accent */}
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.025em',
          lineHeight: '1.2',
          marginBottom: '12px',
        }}
      >
        How can we <span style={{ color: '#4f46e5' }}>assist</span> you today?
      </h1>

      {/* Supporting text */}
      <p
        style={{
          fontSize: '15px',
          color: '#64748b',
          maxWidth: '580px',
          lineHeight: '1.55',
          marginBottom: '46px',
        }}
      >
        Understand government schemes, check eligibility, and find the official documents that support your answers.
      </p>

      {/* Four Horizontal Suggestion Cards (Responsive Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '1080px',
        }}
      >
        {WELCOME_SUGGESTIONS.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onSelectPrompt(item.prompt)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px 18px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '150px',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {/* Top row with Title and Arrow icon */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    {getSuggestionIcon(index)}
                  </div>
                </div>

                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <ArrowUpRight size={14} />
                </div>
              </div>

              <h3
                style={{
                  fontSize: '15.5px',
                  fontWeight: 600,
                  color: '#0f172a',
                  lineHeight: '1.3',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {item.title}
              </h3>
            </div>

            <p
              style={{
                fontSize: '12.5px',
                color: '#64748b',
                lineHeight: '1.45',
                marginTop: 'auto',
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
