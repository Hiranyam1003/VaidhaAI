import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ImageExploreCard } from '../utils/responseEngine';

interface ImageCardProps {
  card: ImageExploreCard;
  onClick: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ card, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--workspace-border)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        height: '100%',
        minHeight: '260px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--brand-sun-border)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--workspace-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Top Image Container */}
      <div
        style={{
          width: '100%',
          height: '140px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#f5f3ef',
        }}
      >
        {!imageError ? (
          <img
            src={card.imageUrl}
            alt={card.altText}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--brand-sun-light)',
              color: 'var(--brand-sun)',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {card.category}
          </div>
        )}

        {/* Category Pill Tag Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            color: 'var(--brand-ink)',
            fontSize: '10.5px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            letterSpacing: '0.02em',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          {card.category}
        </div>

        {/* Small Arrow Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            color: 'var(--brand-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <ArrowUpRight size={13} />
        </div>
      </div>

      {/* Card Body Content */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '15px',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: '1.3',
              marginBottom: '6px',
            }}
          >
            {card.title}
          </h3>

          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--workspace-text-muted)',
              lineHeight: '1.45',
            }}
          >
            {card.description}
          </p>
        </div>

        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: 'var(--brand-sun)',
          }}
        >
          <span>Ask Vaidha</span>
          <ArrowUpRight size={12} />
        </div>
      </div>
    </div>
  );
};
