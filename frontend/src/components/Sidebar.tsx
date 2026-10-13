import React, { useEffect } from 'react';
import {
  Plus,
  Home,
  Newspaper,
  Landmark,
  ClipboardCheck,
  Files,
  Bookmark,
  UserCircle,
  Settings,
  PanelLeftClose,
  PanelLeft,
  X,
} from 'lucide-react';
import type { NavTab } from '../types';
import { useT } from '../i18n';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
  isMobile,
  isMobileOpen,
  onCloseMobile,
}) => {
  useEffect(() => {
    if (!isMobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseMobile();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const t = useT();
  const navItems = [
    { id: 'home' as NavTab, label: t('Home'), icon: Home },
    { id: 'news' as NavTab, label: t('News & Updates'), icon: Newspaper },
    { id: 'schemes' as NavTab, label: t('Explore Schemes'), icon: Landmark },
    { id: 'eligibility' as NavTab, label: t('Eligibility Checker'), icon: ClipboardCheck },
    { id: 'documents' as NavTab, label: t('Document Library'), icon: Files },
    { id: 'saved' as NavTab, label: t('Saved Schemes'), icon: Bookmark },
    { id: 'settings' as NavTab, label: t('Settings'), icon: Settings },
  ];

  return (
    <>
    {isMobile && isMobileOpen && (
      <div
        onClick={onCloseMobile}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(18, 19, 22, 0.45)', zIndex: 39 }}
      />
    )}
    <aside
      aria-label={t('Main navigation')}
      inert={isMobile && !isMobileOpen}
      style={{
        width: isCollapsed ? '72px' : '268px',
        minWidth: isCollapsed ? '72px' : '268px',
        height: '100%',
        ...(isMobile && {
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          maxWidth: '85vw',
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: isMobileOpen ? '0 0 40px rgba(0, 0, 0, 0.3)' : 'none',
        }),
        backgroundColor: 'var(--sidebar-bg)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--sidebar-text-main)',
        zIndex: 40,
        ...(!isMobile && { position: 'relative' }),
        userSelect: 'none',
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Branding Section */}
      <div
        style={{
          padding: isCollapsed ? '18px 0' : '18px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <button
          onClick={() => onSelectTab('home')}
          aria-label={t('Vaidha AI home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            overflow: 'hidden',
            color: 'inherit',
            textAlign: 'left',
            borderRadius: '8px',
          }}
        >
          {/* Actual Vaidha Logo Asset */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#faf8f5',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/vaidha-logo.jpeg"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  color: '#f8fafc',
                }}
              >
                Vaidha <span style={{ color: 'var(--brand-sun)' }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--sidebar-text-muted)',
                  fontWeight: 500,
                }}
              >
                {t('Citizen Portal')}
              </span>
            </div>
          )}
        </button>

        {!isCollapsed && (
          <button
            onClick={isMobile ? onCloseMobile : onToggleCollapse}
            title={t(isMobile ? 'Close menu' : 'Collapse sidebar')}
            aria-label={t(isMobile ? 'Close menu' : 'Collapse sidebar')}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--sidebar-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--sidebar-text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isMobile ? <X size={18} /> : <PanelLeftClose size={17} />}
          </button>
        )}
      </div>

      {/* Collapse button when collapsed */}
      {isCollapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <button
            onClick={onToggleCollapse}
            title={t('Expand sidebar')}
            aria-label={t('Expand sidebar')}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--sidebar-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sidebar-text-muted)')}
          >
            <PanelLeft size={18} />
          </button>
        </div>
      )}

      {/* New Chat Button */}
      <div style={{ padding: isCollapsed ? '12px 10px' : '14px 14px' }}>
        <button
          onClick={onNewChat}
          title={t('Start a new question')}
          aria-label={isCollapsed ? t('New Chat') : undefined}
          style={{
            width: '100%',
            height: '40px',
            borderRadius: '9px',
            backgroundColor: 'var(--sidebar-surface)',
            border: '1px solid var(--sidebar-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '10px',
            padding: isCollapsed ? '0' : '0 14px',
            color: 'var(--sidebar-text-main)',
            fontSize: '13.5px',
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
            e.currentTarget.style.borderColor = 'rgba(217, 72, 43, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--sidebar-surface)';
            e.currentTarget.style.borderColor = 'var(--sidebar-border)';
          }}
        >
          <Plus size={16} color="var(--brand-sun)" />
          {!isCollapsed && <span>{t('New Chat')}</span>}
        </button>
      </div>

      {/* Navigation Items in Order (Ask Vaidha removed) */}
      <nav
        style={{
          flex: 1,
          padding: isCollapsed ? '4px 10px' : '4px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          overflowY: 'auto',
        }}
      >
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              aria-label={isCollapsed ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '12px',
                padding: isCollapsed ? '0' : '0 12px',
                backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--sidebar-text-muted)',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.12s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--sidebar-text-muted)';
                }
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    width: '3px',
                    height: '18px',
                    backgroundColor: 'var(--brand-sun)',
                    borderRadius: '0 2px 2px 0',
                  }}
                />
              )}

              <IconComponent
                size={18}
                color={isActive ? 'var(--brand-sun)' : 'currentColor'}
                style={{ flexShrink: 0 }}
              />

              {!isCollapsed && (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Anchored My Profile Item at Bottom */}
      <div
        style={{
          padding: isCollapsed ? '12px 10px' : '12px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
        }}
      >
        <button
          onClick={() => onSelectTab('profile')}
          title={isCollapsed ? t('My Profile') : undefined}
          aria-label={isCollapsed ? t('My Profile') : undefined}
          aria-current={activeTab === 'profile' ? 'page' : undefined}
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '11px',
            padding: isCollapsed ? '0' : '0 10px',
            backgroundColor: activeTab === 'profile' ? 'var(--sidebar-active)' : 'transparent',
            color: activeTab === 'profile' ? '#ffffff' : 'var(--sidebar-text-muted)',
            transition: 'all 0.12s ease',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'profile') {
              e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
              e.currentTarget.style.color = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'profile') {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--sidebar-text-muted)';
            }
          }}
        >
          <UserCircle size={20} color={activeTab === 'profile' ? 'var(--brand-sun)' : 'currentColor'} />
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{t('My Profile')}</span>
              <span style={{ fontSize: '10.5px', color: 'var(--sidebar-text-muted)' }}>{t('Aadhaar & KYC Verified')}</span>
            </div>
          )}
        </button>
      </div>
    </aside>
    </>
  );
};
