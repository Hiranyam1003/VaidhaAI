import React, { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown, Check, Menu } from 'lucide-react';

interface ChatHeaderProps {
  selectedLanguage: 'English' | 'Hindi' | 'Marathi';
  onSelectLanguage: (lang: 'English' | 'Hindi' | 'Marathi') => void;
  onOpenMenu?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onOpenMenu,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <header
      style={{
        height: '54px',
        padding: onOpenMenu ? '0 12px' : '0 24px',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {onOpenMenu && (
          <button
            onClick={onOpenMenu}
            aria-label="Open menu"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--workspace-text-main)',
            }}
          >
            <Menu size={20} />
          </button>
        )}
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
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label={`Language: ${selectedLanguage}`}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
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
                aria-pressed={selectedLanguage === lang}
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
