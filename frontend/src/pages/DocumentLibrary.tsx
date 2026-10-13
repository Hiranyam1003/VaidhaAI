import React, { useEffect, useState } from 'react';
import { ExternalLink, FileText, Lightbulb, Search, Sparkles, X } from 'lucide-react';
import { useLanguage, useT } from '../i18n';
import { localizeDocuments } from '../i18n/documents';
import { DOCUMENTS, DOCUMENT_CATEGORIES, type DocumentCategory, type DocumentGuide } from '../data/documents';

const imageFor = (doc: DocumentGuide) => `/assets/documents/${doc.id}.jpg`;
const englishName = (doc: DocumentGuide) => DOCUMENTS.find((d) => d.id === doc.id)?.name ?? '';

interface DocumentLibraryProps {
  onAskDoc: (question: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ onAskDoc }) => {
  const t = useT();
  const documents = localizeDocuments(useLanguage());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocumentCategory | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = documents.filter(
    (doc) =>
      (category === 'all' || doc.category === category) &&
      (!query ||
        [doc.name, englishName(doc), doc.summary, doc.issuedBy, doc.portalName].some((text) =>
          text.toLowerCase().includes(query),
        )),
  );
  const openDoc = documents.find((doc) => doc.id === openId);

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '32px 28px 60px 28px',
        maxWidth: '1080px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
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
          {t('docs.title')}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)' }}>{t('docs.subtitle')}</p>
      </div>

      {/* Search */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--workspace-border)',
          borderRadius: '10px',
          padding: '0 12px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '12px',
        }}
      >
        <Search size={16} color="var(--workspace-text-subtle)" />
        <input
          type="text"
          placeholder={t('docs.searchPlaceholder')}
          aria-label={t('docs.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', background: 'transparent', fontSize: '13.5px', color: 'var(--workspace-text-main)' }}
        />
        {search && (
          <button onClick={() => setSearch('')} aria-label={t('common.clearSearch')} style={{ color: '#888' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
        {(['all', ...DOCUMENT_CATEGORIES] as const).map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={active}
              style={{
                padding: '6px 13px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                backgroundColor: active ? 'var(--brand-sun)' : '#ffffff',
                color: active ? '#ffffff' : 'var(--workspace-text-muted)',
                border: active ? '1px solid var(--brand-sun)' : '1px solid var(--workspace-border)',
                transition: 'all 0.12s ease',
              }}
            >
              {cat === 'all' ? t('common.all') : t(`docCat.${cat}`)}
            </button>
          );
        })}
      </div>

      {/* Document cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: '18px' }}>
        {filtered.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} onOpen={() => setOpenId(doc.id)} />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '14px',
              padding: '48px 24px',
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--workspace-text-muted)',
            }}
          >
            {t('docs.noMatch')}
          </div>
        )}
      </div>

      {openDoc && (
        <DocumentModal
          doc={openDoc}
          onClose={() => setOpenId(null)}
          onAsk={() => {
            setOpenId(null);
            onAskDoc(t('prompt.docProcess', { doc: openDoc.name }));
          }}
        />
      )}
    </div>
  );
};

// Shows the Nano Banana illustration, or a calm placeholder if it hasn't been added yet.
const DocumentImage: React.FC<{ doc: DocumentGuide; height: number; className?: string }> = ({ doc, height, className }) => {
  const t = useT();
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={className}
      style={{
        height: `${height}px`,
        backgroundColor: 'var(--brand-sun-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {failed ? (
        <FileText size={height / 3} color="var(--brand-sun)" strokeWidth={1.4} aria-hidden="true" />
      ) : (
        <img
          src={imageFor(doc)}
          alt={t('docs.imageAlt', { name: doc.name })}
          loading="lazy"
          onError={() => setFailed(true)}
          className="doc-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
};

const DocumentCard: React.FC<{ doc: DocumentGuide; onOpen: () => void }> = ({ doc, onOpen }) => {
  const t = useT();

  return (
    <article
      className="doc-card"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--workspace-border)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button onClick={onOpen} style={{ textAlign: 'left', display: 'block', position: 'relative' }} aria-label={`${doc.name}: ${t('docs.howToApply')}`}>
        <DocumentImage doc={doc} height={150} />
        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '10.5px',
            fontWeight: 600,
            color: '#1a1a1a',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '3px 8px',
            borderRadius: '6px',
          }}
        >
          {t(`docCat.${doc.category}`)}
        </span>
      </button>

      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15.5px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>
          {doc.name}
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--workspace-text-muted)', lineHeight: 1.45 }}>{doc.summary}</p>
        <p style={{ fontSize: '11.5px', color: 'var(--workspace-text-subtle)' }}>
          {t('docs.issuedBy')}: {doc.issuedBy}
        </p>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid #f2efe9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button onClick={onOpen} style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--workspace-text-main)' }}>
            {t('docs.howToApply')}
          </button>
          <a
            href={doc.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--brand-sun)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
          >
            {t('docs.applyOnline')} <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>{children}</h4>
);

const DocumentModal: React.FC<{ doc: DocumentGuide; onClose: () => void; onAsk: () => void }> = ({ doc, onClose, onAsk }) => {
  const t = useT();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
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
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={doc.name}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          maxWidth: '640px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--workspace-border)',
          maxHeight: '88vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
        className="fade-in"
      >
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          autoFocus
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1,
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            color: '#444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <X size={18} />
        </button>

        <DocumentImage doc={doc} height={220} className="doc-modal-image" />

        <div style={{ padding: '22px 26px 26px' }}>
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
            {t(`docCat.${doc.category}`)}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '21px',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.3,
              margin: '10px 0 6px',
            }}
          >
            {doc.name}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--workspace-text-main)', lineHeight: 1.55, marginBottom: '6px' }}>{doc.summary}</p>
          <p style={{ fontSize: '12.5px', color: 'var(--workspace-text-muted)', marginBottom: '18px' }}>
            {t('docs.issuedBy')}: <strong>{doc.issuedBy}</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '22px' }}>
            <div>
              <SectionTitle>{t('docs.whoCanApply')}</SectionTitle>
              <p style={{ fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: 1.55 }}>{doc.whoCanApply}</p>
            </div>

            <div>
              <SectionTitle>{t('docs.papers')}</SectionTitle>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--workspace-text-main)', lineHeight: 1.6 }}>
                {doc.papers.map((paper) => (
                  <li key={paper}>{paper}</li>
                ))}
              </ul>
            </div>

            <div>
              <SectionTitle>{t('docs.steps')}</SectionTitle>
              <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {doc.steps.map((step, i) => (
                  <li key={step} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: 1.55, color: 'var(--workspace-text-main)' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-sun)',
                        color: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                backgroundColor: '#fbfaf8',
                border: '1px solid var(--workspace-border)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '13px',
                lineHeight: 1.5,
                color: 'var(--workspace-text-main)',
              }}
            >
              <Lightbulb size={16} color="var(--brand-sun)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <span>
                <strong>{t('docs.tip')}:</strong> {doc.tip}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href={doc.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: '1 1 220px',
                minHeight: '42px',
                padding: '8px 14px',
                borderRadius: '9px',
                backgroundColor: 'var(--brand-sun)',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(217, 72, 43, 0.3)',
              }}
            >
              {t('docs.applyOn', { portal: doc.portalName })} <ExternalLink size={14} />
            </a>
            <button
              onClick={onAsk}
              style={{
                flex: '1 1 180px',
                minHeight: '42px',
                padding: '8px 14px',
                borderRadius: '9px',
                border: '1px solid var(--workspace-border)',
                backgroundColor: '#ffffff',
                color: 'var(--workspace-text-main)',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="var(--brand-sun)" /> {t('docs.ask')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
