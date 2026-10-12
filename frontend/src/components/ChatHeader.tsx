import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface ChatHeaderProps {
  selectedLanguage: 'English' | 'Hindi' | 'Marathi';
  onSelectLanguage: (lang: 'English' | 'Hindi' | 'Marathi') => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      style={{
        height: '54px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        backgroundColor: 'rgba(250, 248, 245, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(232, 230, 225, 0.6)',
      }}
    >
      {/* Left: Compact brand identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '17px',
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.01em',
          }}
        >
          Vaidha <span style={{ color: 'var(--brand-sun)' }}>AI</span>
        </span>
      </div>

      {/* Right: Language selection control */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--workspace-text-main)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--workspace-border-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--workspace-border)')}
        >
          <Globe size={13} color="var(--brand-sun)" />
          <span>{selectedLanguage}</span>
          <ChevronDown size={11} color="var(--workspace-text-subtle)" />
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '34px',
              right: 0,
              width: '130px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '10px',
              padding: '4px',
              boxShadow: 'var(--shadow-md)',
              zIndex: 100,
            }}
          >
            {(['English', 'Hindi', 'Marathi'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onSelectLanguage(lang);
                  setDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  fontSize: '12px',
                  color: selectedLanguage === lang ? 'var(--brand-sun)' : 'var(--workspace-text-main)',
                  borderRadius: '6px',
                  backgroundColor: selectedLanguage === lang ? 'var(--brand-sun-light)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (selectedLanguage !== lang) e.currentTarget.style.backgroundColor = '#f7f6f2';
                }}
                onMouseLeave={(e) => {
                  if (selectedLanguage !== lang) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{lang}</span>
                {selectedLanguage === lang && <Check size={12} color="var(--brand-sun)" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
