import React from 'react';
import { Sparkles } from 'lucide-react';
import { EXPLORE_IMAGE_CARDS, QUICK_PROMPTS } from '../utils/responseEngine';
import { ImageCard } from './ImageCard';
import { useT } from '../i18n';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectPrompt,
  onNavigateTab,
}) => {
  const t = useT();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '1060px',
        width: '100%',
        margin: '0 auto',
        padding: '36px 24px 20px 24px',
        zIndex: 10,
      }}
      className="fade-in"
    >
      {/* Official Vaidha Logo Asset */}
      <div
        style={{
          width: '74px',
          height: '74px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#faf8f5',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <img
          src="/assets/vaidha-logo.jpeg"
          alt="Vaidha AI"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4.2vw, 42px)',
          fontWeight: 700,
          color: '#1a1a1a',
          letterSpacing: '-0.025em',
          lineHeight: '1.2',
          marginBottom: '10px',
        }}
      >
        {t('How can I help you today?')}
      </h1>

      {/* Supporting Text */}
      <p
        style={{
          fontSize: '15px',
          color: 'var(--workspace-text-muted)',
          maxWidth: '580px',
          lineHeight: '1.55',
          marginBottom: '38px',
        }}
      >
        {t('Your guide to government schemes, benefits and essential documents.')}
      </p>

      {/* Image-Based Explore Section */}
      <div style={{ width: '100%', marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '0 4px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '17px',
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.01em',
            }}
          >
            {t('What are you looking for today?')}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)' }}>
            {t('Explore verified citizen services')}
          </span>
        </div>

        {/* 4 Image Cards Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            width: '100%',
          }}
        >
          {EXPLORE_IMAGE_CARDS.map((card) => (
            <ImageCard
              key={card.id}
              card={card}
              onClick={() => {
                if (card.targetNav && onNavigateTab) {
                  onNavigateTab(card.targetNav);
                } else {
                  onSelectPrompt(t(card.actionPrompt));
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Prompts Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '6px',
          padding: '0 8px',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', marginRight: '4px' }}>
          {t('Suggested questions:')}
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(t(qp.prompt))}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--workspace-text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-sun-border)';
              e.currentTarget.style.backgroundColor = 'var(--brand-sun-light)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--workspace-border)';
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Sparkles size={11} color="var(--brand-sun)" />
            <span>&ldquo;{t(qp.label)}&rdquo;</span>
          </button>
        ))}
      </div>
    </div>
  );
};
