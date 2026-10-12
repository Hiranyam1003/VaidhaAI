import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface SuggestionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--workspace-border)',
        borderRadius: '14px',
        padding: '18px 16px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        minHeight: '138px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--workspace-border-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--workspace-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              backgroundColor: 'var(--brand-sun-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>

          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '1px solid var(--workspace-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--workspace-text-subtle)',
            }}
          >
            <ArrowUpRight size={13} />
          </div>
        </div>

        <h3
          style={{
            fontSize: '14.5px',
            fontWeight: 600,
            color: '#1a1a1a',
            lineHeight: '1.3',
            marginBottom: '6px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {title}
        </h3>
      </div>

      <p
        style={{
          fontSize: '12px',
          color: 'var(--workspace-text-muted)',
          lineHeight: '1.45',
          marginTop: 'auto',
        }}
      >
        {description}
      </p>
    </div>
  );
};
