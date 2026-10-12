import React, { useState } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  X,
  FileCheck,
} from 'lucide-react';
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
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  const [activeModalScheme, setActiveModalScheme] = useState<SchemeItem | null>(null);

  const categories = ['All', 'Housing', 'Education', 'Agriculture', 'Healthcare', 'Financial', 'Women & Child'];
  const levels = ['All', 'Central', 'State', 'Central-State'];
  const beneficiaries = ['All', 'Students', 'Farmers', 'Families', 'Artisans', 'Senior Citizens'];

  const filtered = schemes
    .filter((s) => {
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      const matchLevel = selectedLevel === 'All' || s.level === selectedLevel;
      const matchBeneficiary = selectedBeneficiary === 'All' || s.beneficiaryGroup === selectedBeneficiary;
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.hindiName && s.hindiName.includes(search)) ||
        s.benefit.toLowerCase().includes(search.toLowerCase()) ||
        s.department.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchLevel && matchBeneficiary && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '32px 28px 60px 28px',
        maxWidth: '1020px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
      {/* Page Title */}
      <div style={{ marginBottom: '22px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '25px',
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}
        >
          Explore Government Schemes
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)' }}>
          Browse verified central and state welfare initiatives with requirements and documentation.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div
            style={{
              flex: 1,
              minWidth: '240px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '10px',
              padding: '0 12px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Search size={16} color="var(--workspace-text-subtle)" />
            <input
              type="text"
              placeholder="Search by scheme name, benefits, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                fontSize: '13px',
                color: 'var(--workspace-text-main)',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ color: '#888' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}
            style={{
              height: '40px',
              borderRadius: '10px',
              border: '1px solid var(--workspace-border)',
              backgroundColor: '#ffffff',
              padding: '0 12px',
              fontSize: '12.5px',
              color: 'var(--workspace-text-main)',
            }}
          >
            <option value="name">Sort by: Name (A-Z)</option>
            <option value="category">Sort by: Category</option>
          </select>
        </div>

        {/* Multi-tier Filter Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Level Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', fontWeight: 500 }}>Govt Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                backgroundColor: '#ffffff',
                padding: '0 8px',
                fontSize: '12px',
                color: 'var(--workspace-text-main)',
              }}
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Beneficiary Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', fontWeight: 500 }}>Beneficiary:</span>
            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              style={{
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                backgroundColor: '#ffffff',
                padding: '0 8px',
                fontSize: '12px',
                color: 'var(--workspace-text-main)',
              }}
            >
              {beneficiaries.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Category Quick Chips */}
          <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginLeft: 'auto' }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: active ? 'var(--brand-sun)' : '#ffffff',
                    color: active ? '#ffffff' : 'var(--workspace-text-muted)',
                    border: active ? '1px solid var(--brand-sun)' : '1px solid var(--workspace-border)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.12s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(310px, 100%), 1fr))', gap: '16px' }}>
        {filtered.map((scheme) => {
          const isSaved = savedIds.includes(scheme.id);
          return (
            <div
              key={scheme.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--workspace-border)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.15s ease',
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

                <h3
                  onClick={() => setActiveModalScheme(scheme)}
                  style={{
                    fontSize: '15.5px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '4px',
                    lineHeight: 1.3,
                    cursor: 'pointer',
                  }}
                >
                  {scheme.name}
                </h3>

                {scheme.hindiName && (
                  <p style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', marginBottom: '10px' }}>
                    {scheme.hindiName}
                  </p>
                )}

                <p style={{ fontSize: '13px', color: 'var(--workspace-text-main)', marginBottom: '8px', lineHeight: 1.45 }}>
                  <strong>Benefit:</strong> {scheme.benefit}
                </p>

                <p style={{ fontSize: '12px', color: 'var(--workspace-text-muted)', lineHeight: 1.45 }}>
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </p>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f2efe9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={() => setActiveModalScheme(scheme)}
                  style={{ fontSize: '12px', color: 'var(--workspace-text-muted)', fontWeight: 500 }}
                >
                  View Details
                </button>

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

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '14px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)' }}>
              No schemes match your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {activeModalScheme && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 20, 20, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
          onClick={() => setActiveModalScheme(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--workspace-border)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: 'var(--brand-sun-light)',
                  color: 'var(--brand-sun)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {activeModalScheme.category} • {activeModalScheme.level} • {activeModalScheme.beneficiaryGroup}
              </span>
              <button onClick={() => setActiveModalScheme(null)} style={{ color: '#888', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', lineHeight: '1.3', marginBottom: '4px' }}>
              {activeModalScheme.name}
            </h3>
            {activeModalScheme.hindiName && (
              <p style={{ fontSize: '13px', color: 'var(--workspace-text-subtle)', marginBottom: '16px' }}>
                {activeModalScheme.hindiName}
              </p>
            )}

            <div style={{ fontSize: '13px', color: 'var(--workspace-text-muted)', marginBottom: '16px' }}>
              Nodal Department: <strong>{activeModalScheme.department}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: '#fbfaf8', padding: '14px', borderRadius: '10px', border: '1px solid var(--workspace-border)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Direct Benefit</h4>
                <p style={{ fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: '1.5' }}>{activeModalScheme.benefit}</p>
              </div>

              <div style={{ backgroundColor: '#fbfaf8', padding: '14px', borderRadius: '10px', border: '1px solid var(--workspace-border)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Potential Eligibility Criteria</h4>
                <p style={{ fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: '1.5' }}>{activeModalScheme.eligibility}</p>
              </div>

              <div style={{ backgroundColor: '#fbfaf8', padding: '14px', borderRadius: '10px', border: '1px solid var(--workspace-border)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCheck size={15} color="var(--brand-sun)" /> Mandatory Documents Checklist
                </h4>
                <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: 'var(--workspace-text-main)', lineHeight: '1.6' }}>
                  {activeModalScheme.documents.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const name = activeModalScheme.name;
                  setActiveModalScheme(null);
                  onAskScheme(`Provide step-by-step application instructions and required forms for ${name}`);
                }}
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--brand-sun)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                Ask Vaidha in Chat
              </button>

              {activeModalScheme.officialUrl && (
                <a
                  href={activeModalScheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--workspace-border)',
                    backgroundColor: '#ffffff',
                    color: 'var(--workspace-text-main)',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                  }}
                >
                  Official Portal <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
