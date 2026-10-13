import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  X,
  FileCheck,
  Calendar,
  CheckCircle2,
  Building2,
  FileText,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import type { SchemeItem } from '../types';

interface ExploreSchemesProps {
  schemes: SchemeItem[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onAskScheme: (schemeName: string) => void;
}

/**
 * Checks whether a scheme qualifies for the "NEW" badge:
 * - announcementDate is known and verified
 * - announcementDate is within the previous 7 calendar days from the user's current date
 * - announcementDate is not in the future
 * - supported by a verifiable official source
 */
export function isSchemeNewlyAnnounced(scheme: SchemeItem, referenceDate: Date = new Date()): boolean {
  if (!scheme.announcementDate) return false;
  if (!scheme.announcementSourceUrl && !scheme.source?.sourceUrl) return false;

  // Parse YYYY-MM-DD
  const parts = scheme.announcementDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return false;

  const annYear = parts[0];
  const annMonth = parts[1] - 1; // 0-indexed
  const annDay = parts[2];

  // Compare strictly using local calendar midnight boundaries
  const annDateMidnight = new Date(annYear, annMonth, annDay, 0, 0, 0, 0);
  const todayMidnight = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    0,
    0,
    0,
    0
  );

  // Must not be in the future
  if (annDateMidnight.getTime() > todayMidnight.getTime()) return false;

  const diffMs = todayMidnight.getTime() - annDateMidnight.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Must be within previous 7 calendar days (0 <= diffDays <= 7)
  return diffDays >= 0 && diffDays <= 7;
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
  const [sortBy, setSortBy] = useState<'latest' | 'name-asc' | 'name-desc' | 'verified'>('latest');
  const [activeModalScheme, setActiveModalScheme] = useState<SchemeItem | null>(null);


  const categories = [
    'All',
    'Healthcare',
    'Education',
    'Housing',
    'Agriculture',
    'Employment',
    'Financial',
    'Women & Child',
    'Social Security',
  ];
  const levels = ['All', 'Central', 'State', 'Central-State'];
  const beneficiaries = [
    'All',
    'Students',
    'Farmers',
    'Families',
    'Artisans',
    'Senior Citizens',
    'Youth & Job Seekers',
    'Women',
    'All Citizens',
  ];

  // Current user's local date
  const now = useMemo(() => new Date(), []);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = schemes.filter((s) => {
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      const matchLevel = selectedLevel === 'All' || s.level === selectedLevel;
      const matchBeneficiary =
        selectedBeneficiary === 'All' ||
        s.beneficiaryGroup === selectedBeneficiary ||
        (s.beneficiaryGroups && s.beneficiaryGroups.includes(selectedBeneficiary));

      let matchSearch = true;
      if (q) {
        const inName = s.name.toLowerCase().includes(q);
        const inReg = s.regionalName ? s.regionalName.toLowerCase().includes(q) : false;
        const inHindi = s.hindiName ? s.hindiName.toLowerCase().includes(q) : false;
        const inBenefit = s.benefit.toLowerCase().includes(q);
        const inDept = s.department.toLowerCase().includes(q);
        const inCategory = s.category.toLowerCase().includes(q);
        const inKeywords = s.searchKeywords ? s.searchKeywords.some((k) => k.toLowerCase().includes(q)) : false;
        const inBeneficiaries = s.beneficiaryGroups
          ? s.beneficiaryGroups.some((b) => b.toLowerCase().includes(q))
          : false;

        matchSearch = inName || inReg || inHindi || inBenefit || inDept || inCategory || inKeywords || inBeneficiaries;
      }

      return matchCat && matchLevel && matchBeneficiary && matchSearch;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'verified') {
        const vA = a.lastVerifiedAt || a.source?.lastVerifiedAt || '';
        const vB = b.lastVerifiedAt || b.source?.lastVerifiedAt || '';
        if (vA && vB) return vB.localeCompare(vA);
        if (vA) return -1;
        if (vB) return 1;
        return a.name.localeCompare(b.name);
      }

      // Default: 'latest' announcements first
      // Priority 1: Genuinely new announcements from previous 7 days (newest announcement first)
      // Priority 2: Other schemes with verified announcement dates (newest first)
      // Priority 3: Schemes with unknown announcement dates (after dated entries, alphabetical)
      const isANew = isSchemeNewlyAnnounced(a, now);
      const isBNew = isSchemeNewlyAnnounced(b, now);

      if (isANew && !isBNew) return -1;
      if (!isANew && isBNew) return 1;

      const dateA = a.announcementDate || '';
      const dateB = b.announcementDate || '';

      if (dateA && dateB) {
        return dateB.localeCompare(dateA);
      }
      if (dateA && !dateB) return -1;
      if (!dateA && dateB) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [schemes, search, selectedCategory, selectedLevel, selectedBeneficiary, sortBy, now]);

  // Check if any verified schemes qualify under the 7-day rule
  const newlyAnnouncedSchemes = useMemo(() => {
    return filteredAndSorted.filter((s) => isSchemeNewlyAnnounced(s, now));
  }, [filteredAndSorted, now]);

  // Accessibility: store trigger element to restore focus when modal closes
  const triggerRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Modal open / close handlers with accessibility
  const handleOpenModal = (scheme: SchemeItem, triggerEl?: HTMLElement) => {
    if (triggerEl) triggerRef.current = triggerEl;
    setActiveModalScheme(scheme);
  };

  const handleCloseModal = () => {
    setActiveModalScheme(null);
    if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  };

  // Keyboard accessibility: Escape to close modal and comprehensive scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalScheme) {
        handleCloseModal();
      }
    };

    if (activeModalScheme) {
      document.body.style.overflow = 'hidden';
      if (containerRef.current) {
        containerRef.current.style.overflowY = 'hidden';
      }
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      if (containerRef.current) {
        containerRef.current.style.overflowY = 'auto';
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (containerRef.current) {
        containerRef.current.style.overflowY = 'auto';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalScheme]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedBeneficiary('All');
    setSortBy('latest');
  };

  const formatDateLabel = (isoDate?: string) => {
    if (!isoDate) return 'Information unavailable';
    const parts = isoDate.split('-').map(Number);
    if (parts.length !== 3) return isoDate;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div
      ref={containerRef}
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
      {/* Page Title & Description */}
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
              aria-label="Search schemes"
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
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                style={{ color: '#888', display: 'flex', alignItems: 'center' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'name-asc' | 'name-desc' | 'verified')}
            aria-label="Sort schemes"
            style={{
              height: '40px',
              borderRadius: '10px',
              border: '1px solid var(--workspace-border)',
              backgroundColor: '#ffffff',
              padding: '0 12px',
              fontSize: '12.5px',
              color: 'var(--workspace-text-main)',
              cursor: 'pointer',
            }}
          >
            <option value="latest">Sort by: Latest Announcements First</option>
            <option value="name-asc">Sort by: Scheme Name (A-Z)</option>
            <option value="name-desc">Sort by: Scheme Name (Z-A)</option>
            <option value="verified">Sort by: Recently Verified</option>
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
              aria-label="Filter by government level"
              style={{
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                backgroundColor: '#ffffff',
                padding: '0 8px',
                fontSize: '12px',
                color: 'var(--workspace-text-main)',
                cursor: 'pointer',
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
              aria-label="Filter by beneficiary group"
              style={{
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--workspace-border)',
                backgroundColor: '#ffffff',
                padding: '0 8px',
                fontSize: '12px',
                color: 'var(--workspace-text-main)',
                cursor: 'pointer',
              }}
            >
              {beneficiaries.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Category Quick Chips */}
          <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', marginLeft: 'auto', paddingBottom: '2px' }}>
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

      {/* Optional: Recently Announced Schemes Banner (only if verified qualifying schemes exist within 7 days) */}
      {newlyAnnouncedSchemes.length > 0 && (
        <div
          style={{
            marginBottom: '18px',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            border: '1px solid #fcd9d1',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                backgroundColor: 'var(--brand-sun)',
                color: '#ffffff',
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '3px 8px',
                borderRadius: '5px',
                textTransform: 'uppercase',
              }}
            >
              NEW
            </span>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
              Recently Announced Schemes
              <span style={{ fontWeight: 400, color: 'var(--workspace-text-muted)', marginLeft: '6px' }}>
                ({newlyAnnouncedSchemes.length} verified within the last 7 calendar days)
              </span>
            </div>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--workspace-text-subtle)' }}>
            Official launch date verified
          </span>
        </div>
      )}

      {/* Schemes Grid (Two-column layout preserved) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(310px, 100%), 1fr))',
          gap: '16px',
        }}
      >
        {filteredAndSorted.map((scheme) => {
          const isSaved = savedIds.includes(scheme.id);
          const isNew = isSchemeNewlyAnnounced(scheme, now);

          return (
            <div
              key={scheme.id}
              onClick={(e) => handleOpenModal(scheme, e.currentTarget)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenModal(scheme, e.currentTarget);
                }
              }}
              aria-label={`View details for ${scheme.name}`}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--workspace-border)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--workspace-border-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--workspace-border)';
              }}
            >
              <div>
                {/* Header row with badges and bookmark */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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

                    {/* Small restrained NEW badge */}
                    {isNew && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#ffffff',
                          backgroundColor: 'var(--brand-sun)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        NEW
                      </span>
                    )}

                    {scheme.verificationStatus === 'Verified source' && (
                      <span
                        style={{
                          fontSize: '10.5px',
                          color: '#2b59c3',
                          backgroundColor: '#eef3fd',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                        title="Information backed by official government gazette or portal"
                      >
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button: Stops propagation so modal doesn't open */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(scheme.id);
                    }}
                    title={isSaved ? 'Remove bookmark' : 'Save scheme'}
                    aria-label={isSaved ? `Remove bookmark for ${scheme.name}` : `Save ${scheme.name}`}
                    style={{
                      color: isSaved ? 'var(--brand-sun)' : 'var(--workspace-text-subtle)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      transition: 'transform 0.12s ease',
                    }}
                  >
                    {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </div>

                {/* Scheme Name */}
                <h3
                  style={{
                    fontSize: '15.5px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    marginBottom: '4px',
                    lineHeight: 1.35,
                  }}
                >
                  {scheme.name}
                </h3>

                {/* Regional / Hindi Name */}
                {(scheme.regionalName || scheme.hindiName) && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--workspace-text-subtle)',
                      marginBottom: '10px',
                    }}
                  >
                    {scheme.regionalName || scheme.hindiName}
                  </p>
                )}

                {/* Direct Benefit */}
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--workspace-text-main)',
                    marginBottom: '8px',
                    lineHeight: 1.45,
                  }}
                >
                  <strong>Benefit:</strong> {scheme.benefit}
                </p>

                {/* Eligibility */}
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--workspace-text-muted)',
                    lineHeight: 1.45,
                    marginBottom: '10px',
                  }}
                >
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </p>

                {/* Metadata: Announcement date when documented */}
                {scheme.announcementDate && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--workspace-text-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                    }}
                  >
                    <Calendar size={11} />
                    <span>Announced: {formatDateLabel(scheme.announcementDate)}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(scheme, e.currentTarget);
                  }}
                  style={{
                    fontSize: '12px',
                    color: 'var(--workspace-text-muted)',
                    fontWeight: 500,
                    padding: '2px 0',
                  }}
                >
                  View Details
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskScheme(`What are the complete eligibility and document rules for ${scheme.name}?`);
                  }}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--brand-sun)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 0',
                  }}
                >
                  Ask Vaidha <ExternalLink size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty State when no results match search or filters */}
        {filteredAndSorted.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '14px',
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Info size={32} color="var(--workspace-text-subtle)" />
            <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: '#1a1a1a' }}>
              No schemes match your filter criteria
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--workspace-text-muted)', maxWidth: '420px' }}>
              Try adjusting your search keywords, clear category chips, or switch the government level filter.
            </p>
            <button
              onClick={handleClearFilters}
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
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Detailed Scheme Information Modal rendered via Portal to cover the entire viewport uniformly */}
      {activeModalScheme &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="scheme-modal-backdrop"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="scheme-modal-title"
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                maxWidth: '560px',
                width: '100%',
                padding: '26px 28px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--workspace-border)',
                maxHeight: '88vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
              className="fade-in"
            >
            {/* Modal Top Bar: Badges & Close Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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

                {/* NEW badge if within 7 calendar days */}
                {isSchemeNewlyAnnounced(activeModalScheme, now) && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: 'var(--brand-sun)',
                      padding: '3px 7px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    NEW
                  </span>
                )}

                {activeModalScheme.verificationStatus && (
                  <span
                    style={{
                      fontSize: '11px',
                      backgroundColor: '#eef3fd',
                      color: '#2b59c3',
                      padding: '3px 7px',
                      borderRadius: '4px',
                      fontWeight: 500,
                    }}
                  >
                    {activeModalScheme.verificationStatus}
                  </span>
                )}
              </div>

              <button
                onClick={handleCloseModal}
                aria-label="Close details modal"
                style={{
                  color: '#666',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={19} />
              </button>
            </div>

            {/* A. Scheme Identity */}
            <h3
              id="scheme-modal-title"
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: '1.3',
                marginBottom: '4px',
              }}
            >
              {activeModalScheme.name}
            </h3>

            {(activeModalScheme.regionalName || activeModalScheme.hindiName) && (
              <p style={{ fontSize: '13px', color: 'var(--workspace-text-subtle)', marginBottom: '12px' }}>
                {activeModalScheme.regionalName || activeModalScheme.hindiName}
              </p>
            )}

            <div
              style={{
                fontSize: '12.5px',
                color: 'var(--workspace-text-muted)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Building2 size={14} color="var(--workspace-text-subtle)" />
              <span>
                Nodal Department: <strong>{activeModalScheme.department}</strong>
              </span>
            </div>

            {/* Modal Body Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              {/* B. Benefits */}
              <div
                style={{
                  backgroundColor: '#fbfaf8',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--workspace-border)',
                }}
              >
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={14} color="var(--brand-sun)" /> Direct Benefits
                </h4>
                {activeModalScheme.benefits && activeModalScheme.benefits.length > 0 ? (
                  <ul
                    style={{
                      paddingLeft: '18px',
                      fontSize: '12.5px',
                      color: 'var(--workspace-text-main)',
                      lineHeight: '1.55',
                      margin: 0,
                    }}
                  >
                    {activeModalScheme.benefits.map((b, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: '1.5', margin: 0 }}>
                    {activeModalScheme.benefit}
                  </p>
                )}
              </div>

              {/* C. Eligibility Criteria */}
              <div
                style={{
                  backgroundColor: '#fbfaf8',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--workspace-border)',
                }}
              >
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={14} color="var(--brand-sun)" /> Eligibility Criteria
                </h4>
                {activeModalScheme.eligibilityCriteria && activeModalScheme.eligibilityCriteria.length > 0 ? (
                  <ul
                    style={{
                      paddingLeft: '18px',
                      fontSize: '12.5px',
                      color: 'var(--workspace-text-main)',
                      lineHeight: '1.55',
                      margin: 0,
                    }}
                  >
                    {activeModalScheme.eligibilityCriteria.map((crit, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>
                        {crit}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: '1.5', margin: 0 }}>
                    {activeModalScheme.eligibility}
                  </p>
                )}
              </div>

              {/* D. Required Documents */}
              <div
                style={{
                  backgroundColor: '#fbfaf8',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--workspace-border)',
                }}
              >
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileCheck size={15} color="var(--brand-sun)" /> Mandatory Documents Checklist
                </h4>

                {activeModalScheme.requiredDocuments ? (
                  <div>
                    {activeModalScheme.requiredDocuments.mandatory.length > 0 && (
                      <ul
                        style={{
                          paddingLeft: '18px',
                          fontSize: '12.5px',
                          color: 'var(--workspace-text-main)',
                          lineHeight: '1.6',
                          margin: 0,
                        }}
                      >
                        {activeModalScheme.requiredDocuments.mandatory.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    )}

                    {activeModalScheme.requiredDocuments.conditional &&
                      activeModalScheme.requiredDocuments.conditional.length > 0 && (
                        <div style={{ marginTop: '8px', borderTop: '1px dashed #e8e4dc', paddingTop: '6px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--workspace-text-subtle)',
                              textTransform: 'uppercase',
                            }}
                          >
                            Conditional / Category-Specific
                          </span>
                          <ul
                            style={{
                              paddingLeft: '18px',
                              fontSize: '12px',
                              color: 'var(--workspace-text-muted)',
                              lineHeight: '1.5',
                              marginTop: '3px',
                              margin: 0,
                            }}
                          >
                            {activeModalScheme.requiredDocuments.conditional.map((doc, i) => (
                              <li key={i}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : activeModalScheme.documents && activeModalScheme.documents.length > 0 ? (
                  <ul
                    style={{
                      paddingLeft: '18px',
                      fontSize: '12.5px',
                      color: 'var(--workspace-text-main)',
                      lineHeight: '1.6',
                      margin: 0,
                    }}
                  >
                    {activeModalScheme.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '12.5px', color: 'var(--workspace-text-muted)', margin: 0 }}>
                    Information unavailable from published notification.
                  </p>
                )}
              </div>

              {/* E. Application Process */}
              <div
                style={{
                  backgroundColor: '#fbfaf8',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--workspace-border)',
                }}
              >
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Clock size={14} color="var(--brand-sun)" /> Application Procedure
                </h4>
                {activeModalScheme.applicationProcess ? (
                  <div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--brand-sun)',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      Mode: {activeModalScheme.applicationProcess.mode}
                      {activeModalScheme.applicationProcess.portalName &&
                        ` (${activeModalScheme.applicationProcess.portalName})`}
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--workspace-text-main)', lineHeight: '1.5', margin: 0 }}>
                      {activeModalScheme.applicationProcess.description}
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: '12.5px', color: 'var(--workspace-text-muted)', margin: 0 }}>
                    Official procedures are carried out via designated nodal departments or district offices.
                  </p>
                )}
              </div>

              {/* F. Official Sources and Documents */}
              <div
                style={{
                  backgroundColor: '#faf9f6',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--workspace-border)',
                }}
              >
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={14} color="var(--brand-sun)" /> Official Sources & Verification Record
                </h4>

                {activeModalScheme.source ? (
                  <div style={{ fontSize: '12px', color: 'var(--workspace-text-muted)', lineHeight: '1.55' }}>
                    <div>
                      <strong>Document:</strong> {activeModalScheme.source.title}
                    </div>
                    <div>
                      <strong>Issuing Authority:</strong> {activeModalScheme.source.department}
                    </div>
                    <div>
                      <strong>Type:</strong> {activeModalScheme.source.documentType}
                    </div>
                    {activeModalScheme.announcementDate && (
                      <div>
                        <strong>Official Announcement:</strong> {formatDateLabel(activeModalScheme.announcementDate)}
                      </div>
                    )}
                    {activeModalScheme.source.publicationDate && (
                      <div>
                        <strong>Publication / Revision:</strong> {formatDateLabel(activeModalScheme.source.publicationDate)}
                      </div>
                    )}
                    <div>
                      <strong>Last Verified:</strong> {formatDateLabel(activeModalScheme.source.lastVerifiedAt)}
                    </div>

                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {activeModalScheme.source.sourceUrl && (
                        <a
                          href={activeModalScheme.source.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: 'var(--brand-sun)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            textDecoration: 'none',
                          }}
                        >
                          Direct Official Source <ExternalLink size={11} />
                        </a>
                      )}

                      {activeModalScheme.announcementSourceUrl &&
                        activeModalScheme.announcementSourceUrl !== activeModalScheme.source.sourceUrl && (
                          <a
                            href={activeModalScheme.announcementSourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: '11.5px',
                              fontWeight: 600,
                              color: 'var(--brand-sun)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              textDecoration: 'none',
                            }}
                          >
                            Announcement Press Release <ExternalLink size={11} />
                          </a>
                        )}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--workspace-text-muted)' }}>
                    {activeModalScheme.officialUrl ? (
                      <a
                        href={activeModalScheme.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: 'var(--brand-sun)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          textDecoration: 'none',
                        }}
                      >
                        Official Information Portal <ExternalLink size={11} />
                      </a>
                    ) : (
                      'Information unavailable'
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* G. Modal Footer Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const schemeName = activeModalScheme.name;
                  handleCloseModal();
                  onAskScheme(
                    `What are the detailed benefits, eligibility criteria, and required documents for ${schemeName}?`
                  );
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

              {(activeModalScheme.officialApplicationUrl || activeModalScheme.officialUrl) && (
                <a
                  href={activeModalScheme.officialApplicationUrl || activeModalScheme.officialUrl}
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  Official Portal <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
