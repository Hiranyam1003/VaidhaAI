import React from 'react';
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import type { SchemeItem } from '../types';

interface SavedSchemesProps {
  schemes: SchemeItem[];
  savedIds: string[];
  onRemoveSaved: (id: string) => void;
  onAskScheme: (schemeName: string) => void;
  onGoToExplore: () => void;
}

export const SavedSchemes: React.FC<SavedSchemesProps> = ({
  schemes,
  savedIds,
  onRemoveSaved,
  onAskScheme,
  onGoToExplore,
}) => {
  const bookmarked = schemes.filter((s) => savedIds.includes(s.id));

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '32px 24px 60px 24px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>
          Saved Schemes
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)' }}>
          Quick access to government initiatives and application guidelines you have bookmarked.
        </p>
      </div>

      {bookmarked.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Bookmark size={36} color="var(--workspace-text-subtle)" />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>No saved schemes yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--workspace-text-muted)', maxWidth: '380px' }}>
            Browse through the scheme catalog and bookmark the ones relevant to you or your family.
          </p>
          <button
            onClick={onGoToExplore}
            style={{
              marginTop: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-sun)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Explore Schemes
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {bookmarked.map((scheme) => (
            <div
              key={scheme.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--workspace-border)',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--brand-sun)',
                      backgroundColor: 'var(--brand-sun-light)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {scheme.category}
                  </span>
                  <button
                    onClick={() => onRemoveSaved(scheme.id)}
                    title="Remove from saved"
                    style={{ color: 'var(--workspace-text-subtle)', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>
                  {scheme.name}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--workspace-text-muted)', lineHeight: '1.45', marginBottom: '12px' }}>
                  {scheme.benefit}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f2eee8', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--workspace-text-subtle)' }}>{scheme.level}</span>
                <button
                  onClick={() => onAskScheme(`How do I apply for ${scheme.name}?`)}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--brand-sun)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Ask in Chat <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
