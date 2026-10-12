import React from 'react';
import {
  Plus,
  Home,
  Landmark,
  ClipboardCheck,
  Files,
  Bookmark,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import type { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'schemes' as NavTab, label: 'Explore Schemes', icon: Landmark },
    { id: 'eligibility' as NavTab, label: 'Eligibility Checker', icon: ClipboardCheck },
    { id: 'documents' as NavTab, label: 'Document Library', icon: Files },
    { id: 'saved' as NavTab, label: 'Saved Schemes', icon: Bookmark },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '260px',
        minWidth: isCollapsed ? '72px' : '260px',
        height: '100%',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--sidebar-text-main)',
        zIndex: 40,
        position: 'relative',
        userSelect: 'none',
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
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
        <div
          onClick={() => onSelectTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          {/* Official Vaidha Logo Image */}
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
              alt="Vaidha AI Logo"
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
                Citizen Portal
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            title="Collapse sidebar"
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
            <PanelLeftClose size={17} />
          </button>
        )}
      </div>

      {/* Collapse button when collapsed */}
      {isCollapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
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
          title="Start a new question"
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
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Icon-based Navigation Items */}
      <nav
        style={{
          flex: 1,
          padding: isCollapsed ? '6px 10px' : '6px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
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
              {/* Active accent pill indicator */}
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

      {/* Minimal Footer */}
      <div
        style={{
          padding: isCollapsed ? '16px 0' : '14px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-sun)',
              boxShadow: '0 0 6px rgba(217, 72, 43, 0.6)',
            }}
          />
          {!isCollapsed && (
            <span style={{ fontSize: '11px', color: 'var(--sidebar-text-muted)', fontWeight: 500 }}>
              Govt Services Active
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
