import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Building2,
  Tag,
  Sparkles,
  X,
} from 'lucide-react';
import { NewsService } from '../utils/newsService';
import type { NewsItem } from '../types';
import { useFormatDate, useT } from '../i18n';

interface NewsUpdatesProps {
  bookmarkedNewsIds: string[];
  onToggleBookmarkNews: (id: string) => void;
  onAskAboutNews: (topic: string) => void;
}

export const NewsUpdates: React.FC<NewsUpdatesProps> = ({
  bookmarkedNewsIds,
  onToggleBookmarkNews,
  onAskAboutNews,
}) => {
  const t = useT();
  const formatDate = useFormatDate();
  // Live items only carry a headline, so their summary line is built here in the reader's language.
  const summaryOf = (item: NewsItem) =>
    item.isDemo ? item.summary : t('Reported by {source}. Open the source for the full story.', { source: item.authority });
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Updates');
  const [selectedItemForModal, setSelectedItemForModal] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All Updates',
    'Central Government',
    'Maharashtra',
    'Education',
    'Healthcare',
    'Agriculture',
    'Employment',
  ];

  useEffect(() => {
    NewsService.getNews(selectedCategory, searchQuery).then((data) => {
      setNewsList(data);
      setLoading(false);
    });
  }, [selectedCategory, searchQuery]);

  // Featured entry
  const featuredItem = newsList.find((item) => item.featured);
  const regularItems = newsList.filter((item) => !item.featured);

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '32px 28px 60px 28px',
        maxWidth: '920px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
      {/* Page Heading */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '25px',
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
            }}
          >
            {t('News & Updates')}
          </h2>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--brand-sun-light)',
              color: 'var(--brand-sun)',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {t('Live · Updated every 15 min')}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)', lineHeight: '1.5' }}>
          {t('Stay informed about government policies, scheme announcements and important public updates.')}
        </p>
      </div>

      {/* Search Field */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--workspace-border)',
          borderRadius: '12px',
          padding: '0 14px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Search size={16} color="var(--workspace-text-subtle)" />
        <input
          type="text"
          placeholder={t('Search policies, schemes or government updates...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            fontSize: '13.5px',
            color: 'var(--workspace-text-main)',
          }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ color: '#888', padding: '2px' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Horizontally Scrollable Category Filters */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px',
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 15px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                backgroundColor: isSelected ? 'var(--brand-sun)' : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--workspace-text-muted)',
                border: isSelected ? '1px solid var(--brand-sun)' : '1px solid var(--workspace-border)',
                transition: 'all 0.12s ease',
                boxShadow: isSelected ? '0 2px 6px rgba(217, 72, 43, 0.25)' : 'none',
              }}
            >
              {t(cat)}
            </button>
          );
        })}
      </div>

      {/* Featured Item (if present) */}
      {featuredItem && !searchQuery && selectedCategory === 'All Updates' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--brand-sun-border)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--brand-sun)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {t('Featured Update')}
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  backgroundColor: 'var(--brand-sun-light)',
                  color: 'var(--brand-sun)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                {t(featuredItem.updateType)}
              </span>
            </div>

            <button
              onClick={() => onToggleBookmarkNews(featuredItem.id)}
              title={t(bookmarkedNewsIds.includes(featuredItem.id) ? 'Remove bookmark' : 'Bookmark update')}
              style={{
                color: bookmarkedNewsIds.includes(featuredItem.id) ? 'var(--brand-sun)' : 'var(--workspace-text-subtle)',
                padding: '4px',
              }}
            >
              {bookmarkedNewsIds.includes(featuredItem.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>

          <h3
            onClick={() => setSelectedItemForModal(featuredItem)}
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: '1.35',
              marginBottom: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {featuredItem.title}
          </h3>

          <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)', lineHeight: '1.55', marginBottom: '16px' }}>
            {summaryOf(featuredItem)}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid #f1eee7',
              fontSize: '12px',
              color: 'var(--workspace-text-subtle)',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={13} /> {featuredItem.authority}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> {formatDate(featuredItem.publishedAt)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onAskAboutNews(t('Explain the impact and requirements of: {title}', { title: featuredItem.title }))}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--brand-sun)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={13} /> {t('Discuss in Chat')}
              </button>
              {featuredItem.sourceUrl && (
                <a
                  href={featuredItem.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--workspace-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                  }}
                >
                  {t('Read Full Story')} <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vertically Stacked News Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(searchQuery || selectedCategory !== 'All Updates' ? newsList : regularItems).map((item) => {
          const isBookmarked = bookmarkedNewsIds.includes(item.id);
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--workspace-border)',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: 'var(--brand-sun-light)',
                      color: 'var(--brand-sun)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {t(item.updateType)}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--workspace-text-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Tag size={11} /> {t(item.category)}
                  </span>
                </div>

                <button
                  onClick={() => onToggleBookmarkNews(item.id)}
                  title={t(isBookmarked ? 'Remove bookmark' : 'Bookmark update')}
                  style={{
                    color: isBookmarked ? 'var(--brand-sun)' : 'var(--workspace-text-subtle)',
                    padding: '2px',
                  }}
                >
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
              </div>

              <h3
                onClick={() => setSelectedItemForModal(item)}
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  lineHeight: '1.35',
                  marginBottom: '6px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {item.title}
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--workspace-text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                {summaryOf(item)}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #f4f1ea',
                  fontSize: '11.5px',
                  color: 'var(--workspace-text-subtle)',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{item.authority}</span>
                  <span>•</span>
                  <span>{formatDate(item.publishedAt)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => onAskAboutNews(t("How does the update '{title}' apply to citizens?", { title: item.title }))}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--brand-sun)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={12} /> {t('Ask in Chat')}
                  </button>

                  <button
                    onClick={() => setSelectedItemForModal(item)}
                    style={{
                      fontSize: '12px',
                      color: 'var(--workspace-text-main)',
                      fontWeight: 500,
                    }}
                  >
                    {t('View Details')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {(loading || newsList.length === 0) && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '14px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)' }}>
              {loading
                ? t('Loading the latest government news...')
                : searchQuery
                  ? t('No government updates found matching “{query}”.', { query: searchQuery })
                  : t('Could not load the latest news right now. Make sure the backend is running, then refresh.')}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItemForModal && (
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
          onClick={() => setSelectedItemForModal(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '600px',
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
                {t(selectedItemForModal.updateType)} • {t(selectedItemForModal.category)}
              </span>
              <button
                onClick={() => setSelectedItemForModal(null)}
                style={{ color: '#888', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', lineHeight: '1.35', marginBottom: '10px' }}>
              {selectedItemForModal.title}
            </h3>

            <div style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', marginBottom: '16px' }}>
              {t('Published by:')} <strong>{selectedItemForModal.authority}</strong> · {formatDate(selectedItemForModal.publishedAt)}
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-main)', lineHeight: '1.6', marginBottom: '14px' }}>
              {summaryOf(selectedItemForModal)}
            </p>

            {selectedItemForModal.details && (
              <div
                style={{
                  backgroundColor: '#fbfaf8',
                  border: '1px solid var(--workspace-border)',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '13px',
                  color: 'var(--workspace-text-muted)',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                }}
              >
                <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>{t('Administrative Summary:')}</strong>
                {selectedItemForModal.details}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const title = selectedItemForModal.title;
                  setSelectedItemForModal(null);
                  onAskAboutNews(t('Explain the impact and requirements of: {title}', { title }));
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
                <Sparkles size={14} /> {t('Ask Vaidha in Chat')}
              </button>

              {selectedItemForModal.sourceUrl && (
                <a
                  href={selectedItemForModal.sourceUrl}
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
                  {t('Read Full Story')} <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
