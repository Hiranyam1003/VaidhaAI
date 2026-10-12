import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { Home } from './pages/Home';
import { ExploreSchemes } from './pages/ExploreSchemes';
import { EligibilityChecker } from './pages/EligibilityChecker';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { SavedSchemes } from './pages/SavedSchemes';
import { SCHEMES_DATA, getAssistantResponse } from './data/mockData';
import type { Message, NavTab } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Marathi'>('English');

  // Messages in the active conversation
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Saved / bookmarked schemes IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const local = localStorage.getItem('vaidha_saved_schemes');
    return local ? JSON.parse(local) : ['sch-1', 'sch-2'];
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('vaidha_saved_schemes', JSON.stringify(savedIds));
  }, [savedIds]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // New Chat action: resets current conversation and returns to the clean welcome screen on Home
  const handleNewChat = () => {
    setMessages([]);
    setActiveTab('home');
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSendMessage = (text: string) => {
    // If not currently on Home, switch to Home to show chatbot conversation
    if (activeTab !== 'home') {
      setActiveTab('home');
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: timeString,
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const resp = getAssistantResponse(text);
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: resp.content,
        citations: resp.citations,
        followUps: resp.followUps,
        isDemo: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--workspace-bg)',
      }}
    >
      {/* Minimal Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
        }}
        onNewChat={handleNewChat}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Workspace Area */}
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--workspace-bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Header with clean branding and language selector */}
        <ChatHeader
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />

        {/* View Router based on active tab */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeTab === 'home' && (
            <Home
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              scrollRef={scrollRef}
            />
          )}

          {activeTab === 'schemes' && (
            <ExploreSchemes
              schemes={SCHEMES_DATA}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
              onAskScheme={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
            />
          )}

          {activeTab === 'eligibility' && (
            <EligibilityChecker
              onCheckCriteria={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentLibrary
              onAskDoc={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
            />
          )}

          {activeTab === 'saved' && (
            <SavedSchemes
              schemes={SCHEMES_DATA}
              savedIds={savedIds}
              onRemoveSaved={handleToggleSave}
              onAskScheme={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
              onGoToExplore={() => setActiveTab('schemes')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
