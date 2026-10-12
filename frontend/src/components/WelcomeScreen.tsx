import React from 'react';
import { Landmark, ClipboardCheck, Files, GraduationCap } from 'lucide-react';
import { WELCOME_SUGGESTIONS } from '../utils/responseEngine';
import { SuggestionCard } from './SuggestionCard';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  const getSuggestionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Landmark size={16} color="var(--brand-sun)" />;
      case 1:
        return <ClipboardCheck size={16} color="var(--brand-sun)" />;
      case 2:
        return <Files size={16} color="var(--brand-sun)" />;
      case 3:
        return <GraduationCap size={16} color="var(--brand-sun)" />;
      default:
        return <Landmark size={16} color="var(--brand-sun)" />;
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
        maxWidth: '1040px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 20px',
        zIndex: 10,
      }}
      className="fade-in"
    >
      {/* Official Vaidha Logo Asset */}
      <div
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#faf8f5',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '22px',
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
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: '#1a1a1a',
          letterSpacing: '-0.025em',
          lineHeight: '1.2',
          marginBottom: '12px',
        }}
      >
        How can I help you today?
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: '14.5px',
          color: 'var(--workspace-text-muted)',
          maxWidth: '560px',
          lineHeight: '1.55',
          marginBottom: '42px',
        }}
      >
        Understand government schemes, check your <span style={{ color: 'var(--brand-sun)', fontWeight: 600 }}>eligibility</span>, and find the official documents that support your answers.
      </p>

      {/* Suggestion Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          width: '100%',
          maxWidth: '1000px',
        }}
      >
        {WELCOME_SUGGESTIONS.map((item, index) => (
          <SuggestionCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={getSuggestionIcon(index)}
            onClick={() => onSelectPrompt(item.prompt)}
          />
        ))}
      </div>
    </div>
  );
};
