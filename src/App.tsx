import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ConversationView } from './components/ConversationView';
import { Composer } from './components/Composer';
import { VaidhaLogo } from './components/VaidhaLogo';
import { INITIAL_CHATS, INITIAL_FOLDERS } from './mockData';
import type { ChatSession, Message } from './types';
import { generateAssistantReply } from './responseEngine';
import {
  Globe,
  HelpCircle,
  ChevronDown,
  Menu,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function App() {
  const [chats, setChats] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('vaidha_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_CHATS;
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Marathi'>('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync chats to local storage
  useEffect(() => {
    localStorage.setItem('vaidha_chats', JSON.stringify(chats));
  }, [chats]);

  // Current active chat object
  const activeChat = chats.find((c) => c.id === currentChatId);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [activeChat?.messages, isTyping]);

  // Handle new chat click
  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  // Select existing chat
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  // Delete chat
  const handleDeleteChat = (chatId: string) => {
    const nextChats = chats.filter((c) => c.id !== chatId);
    setChats(nextChats);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  // Select folder action
  const handleSelectFolder = (folderName: string) => {
    const prompt = `Show me all schemes and documentation under the ${folderName} category.`;
    handleSendMessage(prompt);
  };

  // Send message
  const handleSendMessage = (text: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: timeString,
      content: text,
    };

    let targetChatId = currentChatId;

    if (!targetChatId) {
      // Create new session
      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        title: text.length > 36 ? text.substring(0, 36) + '...' : text,
        timeGroup: 'Today',
        preview: text,
        messages: [userMessage],
        updatedAt: timeString,
      };

      setChats((prev) => [newSession, ...prev]);
      setCurrentChatId(newSession.id);
      targetChatId = newSession.id;
    } else {
      // Append user message to active chat
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === targetChatId) {
            return {
              ...c,
              updatedAt: timeString,
              messages: [...c.messages, userMessage],
            };
          }
          return c;
        })
      );
    }

    // Trigger simulated assistant reply
    setIsTyping(true);
    setTimeout(() => {
      const generated = generateAssistantReply(text);
      const assistantMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: generated.content,
        citations: generated.citations,
        followUps: generated.followUps,
        isDemo: true,
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === targetChatId) {
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
            };
          }
          return c;
        })
      );
      setIsTyping(false);
    }, 850);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Desktop / Collapsible Sidebar */}
      <div
        className="sidebar-wrapper"
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <Sidebar
          currentChatId={currentChatId}
          chats={chats}
          folders={INITIAL_FOLDERS}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onSelectFolder={handleSelectFolder}
          onDeleteChat={handleDeleteChat}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Workspace Area */}
      <main
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafbff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Glow in background behind welcome screen */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '420px',
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(224, 231, 255, 0.55), rgba(254, 242, 242, 0.35) 60%, rgba(250, 251, 255, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Workspace Top Header Bar */}
        <header
          style={{
            height: '56px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 20,
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Left: Brand Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                display: 'none',
                padding: '6px',
                borderRadius: '6px',
                color: '#64748b',
              }}
              className="mobile-hamburger"
            >
              <Menu size={20} />
            </button>

            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              Vaidha <span style={{ color: '#4f46e5' }}>AI</span>
            </span>

            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                color: '#2563eb',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldCheck size={12} color="#10b981" /> Citizen Assistant
            </span>
          </div>

          {/* Right: Controls for Language, Help */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  color: '#334155',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              >
                <Globe size={14} color="#3b82f6" />
                <span>{selectedLanguage}</span>
                <ChevronDown size={12} color="#94a3b8" />
              </button>

              {langDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    right: 0,
                    width: '140px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '4px',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 100,
                  }}
                >
                  {(['English', 'Hindi', 'Marathi'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setLangDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        fontSize: '12.5px',
                        color: selectedLanguage === lang ? '#2563eb' : '#334155',
                        borderRadius: '6px',
                        backgroundColor: selectedLanguage === lang ? '#eff6ff' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedLanguage !== lang) e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedLanguage !== lang) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{lang}</span>
                      {selectedLanguage === lang && <Check size={13} color="#2563eb" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Help / Info Button */}
            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#334155',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <HelpCircle size={14} color="#64748b" />
              <span>Guide</span>
            </button>
          </div>
        </header>

        {/* Middle Scrollable Content (Welcome or Chat Stream) */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: currentChatId === null ? 'center' : 'flex-start',
            paddingBottom: '130px', // Space for fixed composer
            zIndex: 10,
          }}
        >
          {currentChatId === null ? (
            <WelcomeScreen onSelectPrompt={handleSendMessage} />
          ) : (
            <ConversationView
              messages={activeChat?.messages || []}
              onSelectFollowUp={handleSendMessage}
              isLoading={isTyping}
            />
          )}
        </div>

        {/* Anchored Persistent Bottom Composer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px 20px 20px',
            background: 'linear-gradient(to top, rgba(250, 251, 255, 0.98) 75%, rgba(250, 251, 255, 0))',
            zIndex: 30,
          }}
        >
          <Composer onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </main>

      {/* Help / Guide Modal */}
      {showHelpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '16px',
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <VaidhaLogo size={32} />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>About Vaidha AI</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Virtual Assistant for Indian Documentation & Administration
                </p>
              </div>
            </div>

            <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>
                <strong>Vaidha AI</strong> is designed to empower citizens across India by simplifying complex government welfare schemes, verifying application prerequisites, and pointing to verified documentation.
              </p>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Demonstration Notice:</span>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  This application is a frontend prototype. Responses, schemes, and citation links are simulated demonstration data without external API calls or database storage.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13.5px',
              }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
