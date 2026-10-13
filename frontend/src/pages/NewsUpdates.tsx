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
import { useLanguage, useT, type StringKey } from '../i18n';
import type { NewsItem } from '../types';

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
  const language = useLanguage();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Updates');
  const [selectedItemForModal, setSelectedItemForModal] = useState<NewsItem | null>(null);

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
    NewsService.getNews(selectedCategory, searchQuery, language).then((data) => {
      setNewsList(data);
    });
  }, [selectedCategory, searchQuery, language]);

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
            {t('news.title')}
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
            {t('news.demoFeed')}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--workspace-text-muted)', lineHeight: '1.5' }}>
          {t('news.subtitle')}
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
          placeholder={t('news.searchPlaceholder')}
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
          <button onClick={() => setSearchQuery('')} aria-label={t('common.clearSearch')} style={{ color: '#888', padding: '2px' }}>
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
              {t(`newsCat.${cat}` as StringKey)}
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
                {t('news.featured')}
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
                {t(`update.${featuredItem.updateType}`)}
              </span>
            </div>

            <button
              onClick={() => onToggleBookmarkNews(featuredItem.id)}
              title={bookmarkedNewsIds.includes(featuredItem.id) ? t('news.removeBookmark') : t('news.bookmark')}
              aria-label={bookmarkedNewsIds.includes(featuredItem.id) ? t('news.removeBookmark') : t('news.bookmark')}
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
            {featuredItem.summary}
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
                <Calendar size={13} /> {featuredItem.publishedAt}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onAskAboutNews(t('prompt.newsImpact', { title: featuredItem.title }))}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--brand-sun)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={13} /> {t('news.discuss')}
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
                  {t('news.officialPortal')} <ExternalLink size={12} />
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
                    {t(`update.${item.updateType}`)}
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
                    <Tag size={11} /> {t(`newsCat.${item.category}`)}
                  </span>
                </div>

                <button
                  onClick={() => onToggleBookmarkNews(item.id)}
                  title={isBookmarked ? t('news.removeBookmark') : t('news.bookmark')}
                  aria-label={isBookmarked ? t('news.removeBookmark') : t('news.bookmark')}
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
                {item.summary}
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
                  <span>{item.publishedAt}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => onAskAboutNews(t('prompt.newsCitizens', { title: item.title }))}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--brand-sun)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Sparkles size={12} /> {t('news.askInChat')}
                  </button>

                  <button
                    onClick={() => setSelectedItemForModal(item)}
                    style={{
                      fontSize: '12px',
                      color: 'var(--workspace-text-main)',
                      fontWeight: 500,
                    }}
                  >
                    {t('news.viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {newsList.length === 0 && (
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
              {t('news.noResults', { query: searchQuery })}
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
                {t(`update.${selectedItemForModal.updateType}`)} • {t(`newsCat.${selectedItemForModal.category}`)}
              </span>
              <button
                onClick={() => setSelectedItemForModal(null)}
                aria-label={t('common.close')}
                style={{ color: '#888', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', lineHeight: '1.35', marginBottom: '10px' }}>
              {selectedItemForModal.title}
            </h3>

            <div style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)', marginBottom: '16px' }}>
              {t('news.publishedBy', { authority: selectedItemForModal.authority, date: selectedItemForModal.publishedAt })}
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-main)', lineHeight: '1.6', marginBottom: '14px' }}>
              {selectedItemForModal.summary}
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
                <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>{t('news.adminSummary')}</strong>
                {selectedItemForModal.details}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const title = selectedItemForModal.title;
                  setSelectedItemForModal(null);
                  onAskAboutNews(t('prompt.newsImpact', { title }));
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
                <Sparkles size={14} /> {t('news.askVaidhaInChat')}
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
                  {t('news.officialSource')} <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
