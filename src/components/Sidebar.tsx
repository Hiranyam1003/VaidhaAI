import { useState } from 'react';
import {
  Plus,
  Search,
  Home,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  FolderCheck,
  GraduationCap,
  HeartPulse,
  Sprout,
  Folder,
  Trash2,
  Pin,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import type { PinnedFolder, ChatSession } from '../types';
import { VaidhaLogo } from './VaidhaLogo';

interface SidebarProps {
  currentChatId: string | null;
  chats: ChatSession[];
  folders: PinnedFolder[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onSelectFolder: (folderName: string) => void;
  onDeleteChat: (chatId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentChatId,
  chats,
  folders,
  onSelectChat,
  onNewChat,
  onSelectFolder,
  onDeleteChat,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [chatsExpanded, setChatsExpanded] = useState(true);
  const [activeMenuChatId, setActiveMenuChatId] = useState<string | null>(null);

  // Group chats by Today, Yesterday, Earlier
  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayChats = filteredChats.filter((c) => c.timeGroup === 'Today');
  const yesterdayChats = filteredChats.filter((c) => c.timeGroup === 'Yesterday');
  const earlierChats = filteredChats.filter((c) => c.timeGroup === 'Earlier');

  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderCheck':
        return <FolderCheck size={16} />;
      case 'GraduationCap':
        return <GraduationCap size={16} />;
      case 'HeartPulse':
        return <HeartPulse size={16} />;
      case 'Sprout':
        return <Sprout size={16} />;
      default:
        return <Folder size={16} />;
    }
  };

  if (isCollapsed) {
    return (
      <aside
        style={{
          width: '68px',
          height: '100%',
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          gap: '20px',
          zIndex: 40,
          transition: 'width 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          onClick={onToggleCollapse}
          title="Expand sidebar"
          style={{
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--sidebar-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sidebar-text-muted)')}
        >
          <PanelLeft size={20} />
        </button>

        <VaidhaLogo size={36} dark />

        <button
          onClick={onNewChat}
          title="New Chat"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--sidebar-surface)',
            border: '1px solid var(--sidebar-border)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-saffron)';
            e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--sidebar-border)';
            e.currentTarget.style.backgroundColor = 'var(--sidebar-surface)';
          }}
        >
          <Plus size={20} />
        </button>

        <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--sidebar-border)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={onNewChat}
            title="Home"
            style={{
              padding: '10px',
              borderRadius: '10px',
              color: currentChatId === null ? '#fff' : 'var(--sidebar-text-muted)',
              backgroundColor: currentChatId === null ? 'var(--sidebar-active)' : 'transparent',
            }}
          >
            <Home size={18} />
          </button>
          <button
            onClick={() => chats[0] && onSelectChat(chats[0].id)}
            title="Chats"
            style={{
              padding: '10px',
              borderRadius: '10px',
              color: currentChatId !== null ? '#fff' : 'var(--sidebar-text-muted)',
              backgroundColor: currentChatId !== null ? 'var(--sidebar-active)' : 'transparent',
            }}
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: '310px',
        minWidth: '310px',
        height: '100%',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--sidebar-text-main)',
        zIndex: 40,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          padding: '18px 18px 14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <VaidhaLogo size={34} showText dark />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
            <PanelLeftClose size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons: New Chat & Search */}
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--sidebar-surface)',
            border: '1px solid var(--sidebar-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 14px',
            color: 'var(--sidebar-text-main)',
            fontSize: '13.5px',
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--sidebar-surface)';
            e.currentTarget.style.borderColor = 'var(--sidebar-border)';
          }}
        >
          <Plus size={16} color="var(--accent-saffron)" />
          <span>New Chat</span>
        </button>

        {/* Search Input */}
        <div
          style={{
            width: '100%',
            height: '38px',
            borderRadius: '9px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '0 12px',
            color: 'var(--sidebar-text-muted)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <Search size={15} style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--sidebar-text-muted)', padding: '2px' }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Nav Items: Home, Chats */}
      <div style={{ padding: '12px 14px 6px 14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <button
          onClick={onNewChat}
          style={{
            height: '38px',
            borderRadius: '8px',
            backgroundColor: currentChatId === null ? 'var(--sidebar-active)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 12px',
            color: currentChatId === null ? '#fff' : 'var(--sidebar-text-muted)',
            fontSize: '13.5px',
            fontWeight: 500,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (currentChatId !== null) e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
          }}
          onMouseLeave={(e) => {
            if (currentChatId !== null) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Home size={16} />
          <span>Home</span>
        </button>

        <button
          onClick={() => chats[0] && onSelectChat(chats[0].id)}
          style={{
            height: '38px',
            borderRadius: '8px',
            backgroundColor: currentChatId !== null ? 'var(--sidebar-surface)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 12px',
            color: currentChatId !== null ? '#fff' : 'var(--sidebar-text-muted)',
            fontSize: '13.5px',
            fontWeight: 500,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (currentChatId === null) e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
          }}
          onMouseLeave={(e) => {
            if (currentChatId === null) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <MessageSquare size={16} />
          <span>Chats</span>
        </button>
      </div>

      {/* Separator */}
      <div style={{ height: '1px', backgroundColor: 'var(--sidebar-border)', margin: '8px 16px' }} />

      {/* Scrollable sections */}
      <div
        className="dark-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 12px 16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Pinned Collections Section */}
        <div>
          <div
            onClick={() => setFoldersExpanded(!foldersExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              cursor: 'pointer',
              color: 'var(--sidebar-text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {foldersExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>Pinned Folders</span>
            </div>
            <Plus
              size={13}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                alert('Add to pinned collection demonstration');
              }}
            />
          </div>

          {foldersExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => onSelectFolder(folder.name)}
                  style={{
                    height: '34px',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px 0 8px',
                    cursor: 'pointer',
                    color: 'var(--sidebar-text-muted)',
                    fontSize: '13px',
                    position: 'relative',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--sidebar-text-muted)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                    {/* Indicator accent line */}
                    <div
                      style={{
                        width: '3px',
                        height: '14px',
                        borderRadius: '2px',
                        backgroundColor: folder.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: folder.color, display: 'flex', alignItems: 'center' }}>
                      {getFolderIcon(folder.iconName)}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {folder.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', opacity: 0.6 }}>{folder.count}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Folder options for ${folder.name}`);
                      }}
                      style={{
                        color: 'var(--sidebar-text-subtle)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sidebar-text-subtle)')}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Chats Section */}
        <div>
          <div
            onClick={() => setChatsExpanded(!chatsExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              cursor: 'pointer',
              color: 'var(--sidebar-text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {chatsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>Chats</span>
            </div>
            <Plus
              size={13}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onNewChat();
              }}
            />
          </div>

          {chatsExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
              {todayChats.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--sidebar-text-subtle)',
                      padding: '4px 8px',
                      fontWeight: 600,
                    }}
                  >
                    Today
                  </div>
                  {renderChatList(todayChats)}
                </div>
              )}

              {yesterdayChats.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--sidebar-text-subtle)',
                      padding: '4px 8px',
                      fontWeight: 600,
                    }}
                  >
                    Yesterday
                  </div>
                  {renderChatList(yesterdayChats)}
                </div>
              )}

              {earlierChats.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--sidebar-text-subtle)',
                      padding: '4px 8px',
                      fontWeight: 600,
                    }}
                  >
                    Earlier
                  </div>
                  {renderChatList(earlierChats)}
                </div>
              )}

              {filteredChats.length === 0 && (
                <div style={{ padding: '16px 8px', fontSize: '12.5px', color: 'var(--sidebar-text-subtle)', textAlign: 'center' }}>
                  No chats match &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Footer */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--sidebar-border)',
          backgroundColor: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            RK
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>Rohan R Kapoor</span>
            <span style={{ fontSize: '11px', color: 'var(--sidebar-text-muted)' }}>Citizen Portal • Maharashtra</span>
          </div>
        </div>
        <div
          title="Aadhaar KYC Active"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
          }}
        />
      </div>
    </aside>
  );

  function renderChatList(chatItems: ChatSession[]) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {chatItems.map((chat) => {
          const isSelected = currentChatId === chat.id;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              style={{
                minHeight: '34px',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px',
                cursor: 'pointer',
                backgroundColor: isSelected ? 'var(--sidebar-active)' : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--sidebar-text-muted)',
                fontSize: '13px',
                transition: 'background 0.12s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--sidebar-text-muted)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                <MessageSquare size={14} style={{ flexShrink: 0, opacity: isSelected ? 1 : 0.65 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.title}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuChatId(activeMenuChatId === chat.id ? null : chat.id);
                  }}
                  style={{
                    color: 'var(--sidebar-text-subtle)',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sidebar-text-subtle)')}
                >
                  <MoreHorizontal size={14} />
                </button>

                {activeMenuChatId === chat.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '28px',
                      backgroundColor: '#1f2229',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '4px',
                      zIndex: 100,
                      minWidth: '130px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    }}
                  >
                    <button
                      onClick={() => {
                        alert(`Pinned: ${chat.title}`);
                        setActiveMenuChatId(null);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        color: '#e2e8f0',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2c303a')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Pin size={12} /> Pin Chat
                    </button>
                    <button
                      onClick={() => {
                        onDeleteChat(chat.id);
                        setActiveMenuChatId(null);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        color: '#f87171',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2c303a')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};
