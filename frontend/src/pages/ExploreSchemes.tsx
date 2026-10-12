import React, { useState } from 'react';
import { Search, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import type { SchemeItem } from '../types';

interface ExploreSchemesProps {
  schemes: SchemeItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onAskScheme: (schemeName: string) => void;
}

export const ExploreSchemes: React.FC<ExploreSchemesProps> = ({
  schemes,
  savedIds,
  onToggleSave,
  onAskScheme,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Housing', 'Education', 'Agriculture', 'Healthcare', 'Financial'];

  const filtered = schemes.filter((s) => {
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.hindiName && s.hindiName.includes(search)) ||
      s.benefit.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '28px 24px 60px 24px',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>
          Explore Government Schemes
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)' }}>
          Browse verified central and state welfare initiatives with requirements and documentation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1,
            minWidth: '220px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--workspace-border)',
            borderRadius: '10px',
            padding: '0 12px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Search size={16} color="var(--workspace-text-subtle)" />
          <input
            type="text"
            placeholder="Search by scheme name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'transparent', fontSize: '13px', color: 'var(--workspace-text-main)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 500,
                backgroundColor: selectedCategory === cat ? 'var(--brand-sun)' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--workspace-text-muted)',
                border: selectedCategory === cat ? '1px solid var(--brand-sun)' : '1px solid var(--workspace-border)',
                transition: 'all 0.12s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map((scheme) => {
          const isSaved = savedIds.includes(scheme.id);
          return (
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
                    {scheme.category} • {scheme.level}
                  </span>
                  <button
                    onClick={() => onToggleSave(scheme.id)}
                    title={isSaved ? 'Remove bookmark' : 'Save scheme'}
                    style={{ color: isSaved ? 'var(--brand-sun)' : 'var(--workspace-text-subtle)', padding: '4px' }}
                  >
                    {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px', lineHeight: 1.3 }}>
                  {scheme.name}
                </h3>
                {scheme.hindiName && (
                  <p style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', marginBottom: '10px' }}>
                    {scheme.hindiName}
                  </p>
                )}

                <p style={{ fontSize: '12.5px', color: 'var(--workspace-text-main)', marginBottom: '8px', lineHeight: 1.45 }}>
                  <strong>Benefit:</strong> {scheme.benefit}
                </p>

                <p style={{ fontSize: '12px', color: 'var(--workspace-text-muted)', lineHeight: 1.45 }}>
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f2efe9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--workspace-text-subtle)' }}>
                  {scheme.department.substring(0, 32)}...
                </span>
                <button
                  onClick={() => onAskScheme(`What are the complete eligibility and document rules for ${scheme.name}?`)}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--brand-sun)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Ask Vaidha <ExternalLink size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
