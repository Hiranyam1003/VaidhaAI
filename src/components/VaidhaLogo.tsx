import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  dark?: boolean;
}

export const VaidhaLogo: React.FC<LogoProps> = ({ size = 32, showText = false, className = '', dark = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.max(8, size * 0.26),
          background: dark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
          border: dark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src="/vaidha-logo.jpeg"
          alt="Vaidha AI Emblem"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            // Fallback geometric glyph inspired by 'वै' if image fails to load
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      </div>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: size > 32 ? '18px' : '15px',
              letterSpacing: '0.02em',
              color: dark ? '#f8fafc' : '#0f172a',
            }}
          >
            Vaidha <span style={{ color: '#f97316' }}>AI</span>
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: dark ? '#94a3b8' : '#64748b',
            }}
          >
            Citizen Assistant
          </span>
        </div>
      )}
    </div>
  );
};

// Geometric Central Emblem inspired by the reference screenshot's flower/circle arrangement
export const QuibiStyleEmblem: React.FC<{ size?: number }> = ({ size = 52 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="12" r="5" fill="#0f172a" />
        <circle cx="49" cy="22" r="5" fill="#f97316" />
        <circle cx="49" cy="42" r="5" fill="#0f172a" />
        <circle cx="32" cy="52" r="5" fill="#3b82f6" />
        <circle cx="15" cy="42" r="5" fill="#0f172a" />
        <circle cx="15" cy="22" r="5" fill="#0f172a" />
        <circle cx="32" cy="32" r="3.5" fill="#0f172a" />
      </svg>
    </div>
  );
};
